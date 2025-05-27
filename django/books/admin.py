import os
import tempfile
from django import forms
from django.contrib import admin
from .models import Book, Collection, Review
from .book_search import get_epub_metadata, get_epub_cover, get_embedding, get_chapters, index_book
from elasticsearch import Elasticsearch

# # Функция для индексации книги
# def index_book(book_id, title, author, description, excerpts, embedding):
#     client = Elasticsearch("http://elasticsearch:9200")
#     doc = {
#         "title": title,
#         "author": author,
#         "description": description,
#         "excerpts": excerpts,
#         "embedding": embedding.tolist(),
#     }
#     try:
#         resp = client.index(index="books", id=book_id, document=doc)
#         print(f"Book {title} indexed: {resp['result']}")
#     except Exception as e:
#         print(f"Error indexing book: {e}")

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

        if  (self.cleaned_data.get('author', '')):
            self.instance.author = self.cleaned_data.get('author', '').strip()
        elif (metadata.get('author', []) != [None]):
            self.instance.author = ', '.join(metadata.get('author', []))
        else:
            self.instance.author = ""

        if  (self.cleaned_data.get('publisher', '')):
            self.instance.publisher = self.cleaned_data.get('author', '').strip()
        elif (metadata.get('publisher', '')):
            self.instance.publisher = ', '.join(metadata.get('author', []))
        else:
            self.instance.publisher = ""

        # Обработка даты публикации
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
        # Сохраняем объект в базе данных
        super().save_model(request, obj, form, change)

        # Генерируем эмбеддинг книги
        book_path = obj.bookFile.path
        embedding = get_embedding(book_path)
        excerpts = get_chapters(book_path)

        # Индексируем книгу в Elasticsearch
        index_book(
            book_id=obj.id,
            title=obj.title,
            author=obj.author,
            description=obj.description,
            excerpts=excerpts,
            embedding=embedding
        )

admin.site.register(Book, BookAdmin)
admin.site.register(Collection)
admin.site.register(Review)