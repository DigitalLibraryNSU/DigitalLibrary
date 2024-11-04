from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'documentId', 'name',
                  'description', 'author', 'publisher',
                  'image', 'createdAt', 'updatedAt', 'publishedAt')