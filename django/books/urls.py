from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.conf import settings
from django.conf.urls.static import static
from .views import CollectionBookSuggestionsView, UserBookRecommendationsView, ReviewsByUserView

from . import views
from .views import ReviewCreateView

urlpatterns = [
                  path('books/', views.BookListCreate.as_view()),
                  path('collections/', views.CollectionListCreate.as_view()),
                  path('books/<int:book_id>/', views.BookDetailView.as_view(), name='get_book_by_id'),
                  path('collections/<int:collection_id>/', views.CollectionDetailView.as_view(),
                       name='get_collection_by_id'),
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
                  path('reviews/<int:book_id>/', views.ReviewGetView.as_view(), name='review-detail'),
                  path('reviews/byUser/', ReviewsByUserView.as_view(), name='review-by-user'),

                  path('collections/<int:collection_id>/suggestions/', CollectionBookSuggestionsView.as_view(),
                       name='collection-suggestions'),
                  path('books/recommendations/', UserBookRecommendationsView.as_view(),
                       name='user-recommendations'),

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
