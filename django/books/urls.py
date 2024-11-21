from django.urls import path
from . import views
from django.contrib import admin

urlpatterns = [
    path('books/', views.BookListCreate.as_view()),
    path('collections/', views.CollectionListCreate.as_view() ),
    path('books/<int:book_id>/', views.BookDetailView.as_view(), name='get_book_by_id'),
    path('collections/<int:collection_id>/', views.CollectionDetailView.as_view(), name='get_collection_by_id'),
    path('bookByAuthor/<str:book_author>/', views.BookAuthorSearch.as_view(), name='book_by_author'),
    path('bookByTitle/<str:book_title>/', views.BookTitleSearch.as_view(), name='book_by_title'),
    path('admin/', admin.site.urls),
]