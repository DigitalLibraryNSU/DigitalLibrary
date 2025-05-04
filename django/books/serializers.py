from rest_framework import serializers
from .models import Book, Collection, LibraryUser
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer


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

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = LibraryUser
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = LibraryUser
        fields = ('id', 'username', 'email')