from django.core.files.storage import FileSystemStorage
from django.db import models
from digitalLibraryBackend import settings

fs = FileSystemStorage(location=settings.MEDIA_ROOT)

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    author = models.CharField(max_length=300)
    publisher = models.CharField(max_length=300, null=True, blank=True)
    image = models.ImageField(storage=fs, upload_to='images/', null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    publishedAt = models.IntegerField(null=True, blank=True)
    book = models.FileField(storage=fs, upload_to='books/', default="books/default.epub")

    def __str__(self):
        return self.title

class Collection(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    books = models.ManyToManyField(Book)

    def __str__(self):
        return self.title


