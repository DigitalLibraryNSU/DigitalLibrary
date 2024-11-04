from django.urls import path
from . import views

urlpatterns = [
    path('api/book/', views.BookListCreate.as_view() ),
    path('api/collection/', views.CollectionListCreate.as_view() ),
]