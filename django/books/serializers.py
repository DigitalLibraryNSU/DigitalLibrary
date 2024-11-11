from rest_framework import serializers
from .models import Book, Collection

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        # fields = ('id', 'title',
        #           'description', 'author', 'publisher',
        #           'image', 'createdAt', 'updatedAt', 'publishedAt', 'book')
        fields = '__all__'



class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        # fields = ('id', 'title', 'description', 'books')
        fields = '__all__'