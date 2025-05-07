from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from . import views
from .views import ReviewCreateView

urlpatterns = [
    path('books/', views.BookListCreate.as_view()),
    path('collections/', views.CollectionListCreate.as_view() ),
    path('books/<int:book_id>/', views.BookDetailView.as_view(), name='get_book_by_id'),
    path('collections/<int:collection_id>/', views.CollectionDetailView.as_view(), name='get_collection_by_id'),
    path('bookByAuthor/<str:book_author>/', views.BookAuthorSearch.as_view(), name='book_by_author'),
    path('bookByTitle/<str:book_title>/', views.BookTitleSearch.as_view(), name='book_by_title'),
    path('bookByExcerpt/<str:excerpt>/', views.BookExcerptSearch.as_view(), name='book_by_excerpt'),
    path('bookByTheme/<str:theme>/', views.BookThemeSearch.as_view(), name='book_by_theme'),

    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('reviews/create/', ReviewCreateView.as_view(), name='review-create'),
]