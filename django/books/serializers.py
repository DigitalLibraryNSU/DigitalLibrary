from rest_framework import serializers
from .models import Book, Collection

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'title',
                  'description', 'author', 'publisher',
                  'image', 'createdAt', 'updatedAt', 'publishedAt')



class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ('id', 'title', 'description', 'books')