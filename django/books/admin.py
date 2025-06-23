from django import forms
from django.contrib import admin

from .booksRecommendations import getCollectionSuggestionsForBook
from .models import Book, Collection, Review
from .book_search import get_epub_metadata, get_epub_cover, get_book_embedding, get_chapters
from .views import getBooksSuggestionForCollection
from django.core.exceptions import ValidationError
from elasticsearch import Elasticsearch, NotFoundError, ConnectionError
from digitalLibraryBackend.settings import ELASTIC_URL
import os
import tempfile
import time
import numpy as np
from django.db.models import Case, When


def check_embeddings_exist(book_id):
    """Check if embeddings exist for the book in Elasticsearch"""
    try:
        client = Elasticsearch(ELASTIC_URL)
        resp = client.search(
            index="books",
            body={
                "query": {
                    "terms": {
                        "_id": [str(book_id)]
                    }
                },
                "_source": ["embedding"]
            }
        )

        hits = resp.get('hits', {}).get('hits', [])
        if hits:
            hit = hits[0]
            source = hit.get('_source', {})
            if 'embedding' in source:
                embedding_data = source['embedding']
                if isinstance(embedding_data, list) and len(embedding_data) > 0:
                    return True
        return False
    except Exception as e:
        print(f"Error checking embeddings: {e}", flush=True)
        return False


class BookForm(forms.ModelForm):
    suggested_collections = forms.ModelMultipleChoiceField(
        queryset=Collection.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple,
        label="Предлагаемые коллекции для добавления"
    )

    class Meta:
        model = Book
        fields = ['title', 'description', 'author', 'publisher', 'publishedAt', 'bookFile', 'image']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance and self.instance.pk:
            try:
                if check_embeddings_exist(self.instance.pk):
                    suggested_collections, similarity_percentages = getCollectionSuggestionsForBook(self.instance.pk)
                    self.fields['suggested_collections'].queryset = suggested_collections

                    if suggested_collections.exists():
                        # Показываем проценты совпадения для каждой коллекции
                        help_text_parts = []
                        for collection, percentage in zip(suggested_collections, similarity_percentages):
                            help_text_parts.append(f"{collection.title}: {percentage}%")

                        help_text = "Процент совпадения эмбеддингов: " + ", ".join(help_text_parts)
                        self.fields['suggested_collections'].help_text = help_text

                        print(f"Collection suggestions for '{self.instance.title}': {', '.join(help_text_parts)}",
                              flush=True)
                    else:
                        self.fields[
                            'suggested_collections'].help_text = "Нет коллекций с достаточным уровнем совпадения."
                else:
                    self.fields['suggested_collections'].queryset = Collection.objects.none()
                    self.fields['suggested_collections'].help_text = "Сначала создайте эмбеддинги для книги."
            except Exception as e:
                print(f"Error getting collection suggestions: {e}", flush=True)
                self.fields['suggested_collections'].queryset = Collection.objects.none()
        else:
            self.fields['suggested_collections'].queryset = Collection.objects.none()
            self.fields[
                'suggested_collections'].help_text = "Предложения коллекций будут доступны после сохранения книги."

    def save(self, commit=True):
        book_file_changed = 'bookFile' in self.changed_data

        if book_file_changed:
            book_file = self.cleaned_data.get('bookFile')

            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                for chunk in book_file.chunks():
                    temp_file.write(chunk)

                metadata = get_epub_metadata(temp_file.name)

                if "error" in metadata:
                    raise forms.ValidationError(metadata["error"])

                if self.cleaned_data.get('title'):
                    self.instance.title = self.cleaned_data.get('title', '')
                elif metadata.get('title'):
                    self.instance.title = metadata.get('title', '')
                else:
                    self.instance.title = ""

                if self.cleaned_data.get('description'):
                    self.instance.description = self.cleaned_data.get('description', '')
                elif metadata.get('description'):
                    self.instance.description = metadata.get('description', '')
                else:
                    self.instance.description = ""

                if self.cleaned_data.get('author'):
                    self.instance.author = self.cleaned_data.get('author', '').strip()
                elif metadata.get('author', []) != [None]:
                    self.instance.author = ', '.join(metadata.get('author', []))
                else:
                    self.instance.author = ""

                if self.cleaned_data.get('publisher'):
                    self.instance.publisher = self.cleaned_data.get('publisher', '').strip()
                elif metadata.get('publisher'):
                    self.instance.publisher = metadata.get('publisher', '')
                else:
                    self.instance.publisher = ""

                published_date_str = metadata.get('date', '')
                year_str = published_date_str[:4] if published_date_str else ''
                self.instance.publishedAt = (
                        self.cleaned_data.get('publishedAt')
                        or (int(year_str) if year_str.isdigit() else None)
                )

                if not self.cleaned_data.get('image'):
                    cover_file = get_epub_cover(temp_file.name)
                    if cover_file:
                        file_name = f"{self.instance.title}_cover.jpg"
                        self.instance.image.save(file_name, cover_file, save=False)

                os.remove(temp_file.name)
        else:
            for field_name in self.changed_data:
                if field_name not in ['bookFile', 'suggested_collections']:
                    setattr(self.instance, field_name, self.cleaned_data[field_name])

        return super().save(commit=commit)

    def clean(self):
        cleaned_data = super().clean()
        self._suggested_collections = cleaned_data.get('suggested_collections', [])
        return cleaned_data


class BookAdmin(admin.ModelAdmin):
    form = BookForm

    def save_model(self, request, obj, form, change):
        print(f"Saving book: {obj.title} (Mode: {'Update' if change else 'Create'})", flush=True)

        super().save_model(request, obj, form, change)

        # Обрабатываем добавление в коллекции
        if hasattr(form, '_suggested_collections') and form._suggested_collections:
            print(f"Adding book to {len(form._suggested_collections)} collections", flush=True)
            for collection in form._suggested_collections:
                collection.books.add(obj)

        should_recalculate = False

        if not change:
            should_recalculate = True
            reason = "new book"
        else:
            if 'bookFile' in form.changed_data:
                should_recalculate = True
                reason = "book file changed"
            else:
                try:
                    client = Elasticsearch(ELASTIC_URL)
                    client.indices.refresh(index="books")
                except Exception as e:
                    print(f"Could not refresh index: {e}", flush=True)

                time.sleep(0.5)

                embeddings_exist = check_embeddings_exist(obj.id)
                if not embeddings_exist:
                    should_recalculate = True
                    reason = "embeddings missing"
                else:
                    reason = "embeddings exist, file not changed"

        print(f"Decision: {'RECALCULATE' if should_recalculate else 'SKIP'} - {reason}", flush=True)

        if should_recalculate:
            try:
                print(f"Creating embeddings for: {obj.title}", flush=True)
                book_path = obj.bookFile.path
                embedding = get_book_embedding(book_path)
                excerpts = get_chapters(book_path)

                if isinstance(embedding, np.ndarray):
                    embedding = embedding.tolist()

                try:
                    client = Elasticsearch(ELASTIC_URL)
                    doc = {
                        "title": obj.title,
                        "author": obj.author,
                        "description": obj.description,
                        "excerpts": excerpts,
                        "embedding": embedding
                    }

                    result = client.index(
                        index="books",
                        id=obj.id,
                        body=doc
                    )

                    client.indices.refresh(index="books")
                    print(f"Embeddings indexed successfully: {result.get('result', 'unknown')}", flush=True)
                except Exception as e:
                    print(f"Error during indexing: {e}", flush=True)

            except Exception as e:
                print(f"Error creating embeddings for {obj.title}: {e}", flush=True)


class CollectionForm(forms.ModelForm):
    suggested_books = forms.ModelMultipleChoiceField(
        queryset=Book.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple,
        label="Suggested books to add"
    )

    class Meta:
        model = Collection
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            try:
                suggested_books = getBooksSuggestionForCollection(self.instance.pk)
            except ValidationError:
                suggested_books = Book.objects.none()
            self.fields['suggested_books'].queryset = suggested_books
            self.fields['suggested_books'].help_text = "Check the boxes to add these suggested books to the collection."
        else:
            self.fields['suggested_books'].queryset = Book.objects.none()

    def clean(self):
        cleaned_data = super().clean()
        books = cleaned_data.get('books', [])
        suggested_books = cleaned_data.get('suggested_books', [])
        all_books = list(set(books) | set(suggested_books))
        cleaned_data['books'] = all_books
        return cleaned_data


class CollectionAdmin(admin.ModelAdmin):
    form = CollectionForm
    filter_horizontal = ['books']


admin.site.register(Book, BookAdmin)
admin.site.register(Collection, CollectionAdmin)
admin.site.register(Review)
