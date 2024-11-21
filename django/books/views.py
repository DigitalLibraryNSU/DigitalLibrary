from django.shortcuts import render

# Create your views here.
from .models import Book, Collection
from .serializers import BookSerializer, CollectionSerializer, CollectionSerializerWithIds
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookDetailView(APIView):
    def get(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id)
            serializer = BookSerializer(book)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)


class BookAuthorSearch(APIView):
    def get(self, request, book_author):
        try:
            books = Book.objects.filter(author=book_author)
            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

class BookTitleSearch(APIView):
    def get(self, request, book_title):
        try:
            books = Book.objects.filter(title=book_title)
            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

class CollectionListCreate(generics.ListCreateAPIView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializerWithIds


class CollectionDetailView(APIView):
    def get(self, request, collection_id):
        try:
            collection = Collection.objects.get(id=collection_id)
            serializer = CollectionSerializer(collection)

            return Response(serializer.data)
        except Collection.DoesNotExist:
            return Response({"error": "Collection not found"}, status=status.HTTP_404_NOT_FOUND)
