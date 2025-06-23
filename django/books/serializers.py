from math import log

from django.db.models import Avg
from rest_framework import serializers
from .models import Book, Collection, LibraryUser, Review
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer


class BookSerializer(serializers.ModelSerializer):
    reviews_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ('id', 'title', 'description', 'author', 'publisher',
                  'image', 'createdAt', 'updatedAt', 'publishedAt',
                  'bookFile', 'reviews_count', 'average_rating', 'score')

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(avg_rating=Avg('rate'))['avg_rating'] or 0.0

    def get_score(self, obj):
        count = self.get_reviews_count(obj)
        avg = self.get_average_rating(obj)
        return round(avg * log(count + 1), 2)


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

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['title', 'body', 'rate', 'book']


class ReviewGetSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = Review
        fields = ['title', 'body', 'rate', 'username']

    def get_username(self, obj):
        return obj.user.username

class ReviewByUserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    book_title = serializers.SerializerMethodField()
    class Meta:
        model = Review
        fields = ['book', 'title', 'body', 'rate', 'username', 'book_title']

    def get_username(self, obj):
        return obj.user.username

    def get_book_title(self, obj):
        return obj.book.title