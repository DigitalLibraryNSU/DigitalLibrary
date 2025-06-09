from django import forms
from django.contrib import admin
from .models import Book, Collection, Review
from .book_search import get_epub_metadata, get_epub_cover, get_book_embedding, get_chapters, index_book
from .views import getBooksSuggestionForCollection
from django.core.exceptions import ValidationError
import os
import tempfile


# Existing BookForm (unchanged)
class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'description', 'author', 'publisher', 'publishedAt', 'bookFile', 'image']

    def save(self, commit=True):
        book_file = self.cleaned_data.get('bookFile')

        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            for chunk in book_file.chunks():
                temp_file.write(chunk)

            metadata = get_epub_metadata(temp_file.name)
            print(metadata)

        if "error" in metadata:
            raise forms.ValidationError(metadata["error"])

        if (self.cleaned_data.get('title')):
            self.instance.title = self.cleaned_data.get('title', '')
        elif (metadata.get('title')):
            self.instance.title = metadata.get('title', '')
        else:
            self.instance.title = ""

        if (self.cleaned_data.get('description', '')):
            self.instance.description = self.cleaned_data.get('description', '')
        elif (metadata.get('description', '')):
            self.instance.description = metadata.get('description', '')
        else:
            self.instance.description = ""

        if (self.cleaned_data.get('author', '')):
            self.instance.author = self.cleaned_data.get('author', '').strip()
        elif (metadata.get('author', []) != [None]):
            self.instance.author = ', '.join(metadata.get('author', []))
        else:
            self.instance.author = ""

        if (self.cleaned_data.get('publisher', '')):
            self.instance.publisher = self.cleaned_data.get('author', '').strip()
        elif (metadata.get('publisher', '')):
            self.instance.publisher = ', '.join(metadata.get('author', []))
        else:
            self.instance.publisher = ""

        published_date_str = metadata.get('date', '')
        year_str = published_date_str[:4] if published_date_str else ''
        self.instance.publishedAt = (
                self.cleaned_data.get('publishedAt')
                or (int(year_str) if year_str.isdigit() else None)
        )
        print(self.cleaned_data)
        if not self.cleaned_data.get('image'):
            print(temp_file.name)
            cover_file = get_epub_cover(temp_file.name)
            print(cover_file)
            if cover_file:
                file_name = f"{self.instance.title}_cover.jpg"
                self.instance.image.save(file_name, cover_file, save=False)
        os.remove(temp_file.name)

        return super().save(commit=commit)


class BookAdmin(admin.ModelAdmin):
    form = BookForm

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        book_path = obj.bookFile.path
        embedding = get_book_embedding(book_path)
        excerpts = get_chapters(book_path)
        index_book(
            book_id=obj.id,
            title=obj.title,
            author=obj.author,
            description=obj.description,
            excerpts=excerpts,
            embedding=embedding
        )


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
            self.fields['suggested_books'].queryset = Book.objects.none()  # No suggestions for new collections

    def clean(self):
        cleaned_data = super().clean()
        books = cleaned_data.get('books', [])
        suggested_books = cleaned_data.get('suggested_books', [])
        # Merge selected books and suggested books
        all_books = list(set(books) | set(suggested_books))
        cleaned_data['books'] = all_books
        return cleaned_data


class CollectionAdmin(admin.ModelAdmin):
    form = CollectionForm
    filter_horizontal = ['books']


# Register models with admin
admin.site.register(Book, BookAdmin)
admin.site.register(Collection, CollectionAdmin)
admin.site.register(Review)
