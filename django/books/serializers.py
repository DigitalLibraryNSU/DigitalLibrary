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
    books = BookSerializer(many=True)
    class Meta:
        model = Collection
        # fields = ('id', 'title', 'description', 'books')
        fields = '__all__'

class CollectionSerializerWithIds(serializers.ModelSerializer):
    class Meta:
        model = Collection
        # fields = ('id', 'title', 'description', 'books')
        fields = '__all__'