import os
import tempfile
from django import forms
from django.contrib import admin
from .models import Book, Collection
from .book_search import get_epub_metadata, get_epub_cover


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

        if "error" in metadata:
            raise forms.ValidationError(metadata["error"])

        self.instance.title = self.cleaned_data.get('title') or metadata.get('title', 'No Title')
        self.instance.description = self.cleaned_data.get('description') or metadata.get('description', '')
        self.instance.author = self.cleaned_data.get('author') or ', '.join(metadata.get('author', []))
        self.instance.publisher = self.cleaned_data.get('publisher') or metadata.get('publisher', '')

        published_date_str = metadata.get('date', '')
        if (published_date_str is None):
            year_str = ''
        else:
            year_str = published_date_str[:4]

        self.instance.publishedAt = self.cleaned_data.get('publishedAt') or (
            int(year_str) if year_str.isdigit() else None
        )

        self.instance.image = self.cleaned_data.get('image') or get_epub_cover(temp_file.name)
        os.remove(temp_file.name)

        return super().save(commit=commit)


class BookAdmin(admin.ModelAdmin):
    form = BookForm

    def save_model(self, request, obj, form, change):
        form.save()


admin.site.register(Book, BookAdmin)
admin.site.register(Collection)
