from django.shortcuts import render

# Create your views here.
from .models import Book, Collection
from .serializers import BookSerializer, CollectionSerializer
from rest_framework import generics

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class CollectionListCreate(generics.ListCreateAPIView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer