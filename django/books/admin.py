import os
import tempfile
from django.contrib import admin
from django import forms
from .models import Book, BookUpload, Collection
from .book_search import get_epub_metadata

class BookUploadForm(forms.ModelForm):

    class Meta:
        model = BookUpload
        fields = ['epub_file']

    def save(self, commit=True):
        upload_instance = super().save(commit=False)
        epub_file = self.cleaned_data['epub_file']

        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            for chunk in epub_file.chunks():
                temp_file.write(chunk)

            # Call the metadata function with the temporary file path
            metadata = get_epub_metadata(temp_file.name)

        if "error" in metadata:
            raise forms.ValidationError(metadata["error"])

        published_date_str = metadata.get('date', '')
        year_str = published_date_str[:4]

        # Создание объекта Book
        book = Book(
            title=metadata.get('title', 'Без названия'),
            description=metadata.get('description', ''),
            author=', '.join(metadata.get('author', [])),
            publisher=metadata.get('publisher', ''),
            publishedAt=int(year_str),
            bookFile=epub_file
        )
        os.remove(temp_file.name)

        if commit:
            book.save()

        return upload_instance

class BookUploadAdmin(admin.ModelAdmin):
    """
    Админка для модели загрузки EPUB файла.
    """
    form = BookUploadForm

    def save_model(self, request, obj, form, change):
        # Сохраняем файл и создаем объект Book
        form.save()

admin.site.register(BookUpload, BookUploadAdmin)
admin.site.register(Book)
admin.site.register(Collection)
