from elasticsearch_dsl.query import MultiMatch

from django.db.models import Case, When
from .models import Book, Collection, Review
from .serializers import BookSerializer, CollectionSerializer, CollectionSerializerWithIds, ReviewCreateSerializer, \
    ReviewGetSerializer
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from elasticsearch import Elasticsearch
import numpy as np

from .documents import BookDocument
from .book_search import search_best_matching_book

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    #
    # def perform_create(self, serializer):
    #     serializer.save(data=self.request.data)


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
            results = BookDocument.search().query(
                MultiMatch(
                query=book_author,
                fields=['author'],
                type="best_fields",
                fuzziness="AUTO"
            )
            )[:10].execute()
            book_ids = [hit.meta.id for hit in results]
            books = Book.objects.filter(id__in=book_ids)

            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

class BookTitleSearch(APIView):
    def get(self, request, book_title):
        try:
            results = BookDocument.search().query(
                MultiMatch(
                    query=book_title,
                    fields=['title'],
                    type="best_fields",
                    fuzziness="AUTO"
                )
            ).execute()

            book_ids = [hit.meta.id for hit in results]
            books = Book.objects.filter(id__in=book_ids)
            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)


class BookExcerptSearch(APIView):
    def get(self, request, excerpt):
        try:
            print(f"Searching for excerpt: {excerpt}")

            # Выполняем поиск по фразе в полях excerpts
            results = BookDocument.search().query("match_phrase", excerpts=excerpt)[:10].execute()

            # Проверяем, есть ли результаты
            if results.hits.total.value > 0:
                book_ids = [hit.meta.id for hit in results.hits]

                # Создаем список условий для сортировки
                order = Case(*[When(id=book_id, then=pos) for pos, book_id in enumerate(book_ids)])

                # Получаем книги в нужном порядке
                books = Book.objects.filter(id__in=book_ids).order_by(order)

                serializer = BookSerializer(books, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No books found for this excerpt."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print(f"Error during search: {e}")
            return Response({"error": "An error occurred during the search."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookThemeSearch(APIView):
    def get(self, request, theme):
        try:
            print(theme)

            result = search_best_matching_book(theme)
            if result['hits']['total']['value'] > 0:
                book_ids = [hit['_id'] for hit in result['hits']['hits']]

                # Создаем список условий для сортировки
                order = Case(*[When(id=book_id, then=pos) for pos, book_id in enumerate(book_ids)])

                # Получаем книги в нужном порядке
                books = Book.objects.filter(id__in=book_ids).order_by(order)

                serializer = BookSerializer(books, many=True)
                #print(book_ids)
                print(books)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No books found for this theme."}, status=status.HTTP_404_NOT_FOUND)

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

class ReviewCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # автоматически ставит текущего пользователя
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewGetView(APIView):
    def get(self, request, book_id):
        try:
            reviews = Review.objects.filter(book_id=book_id)
            serializer = ReviewGetSerializer(reviews, many=True)
            return Response(serializer.data)
        except Collection.DoesNotExist:
            return Response({"error": "Collection not found"}, status=status.HTTP_404_NOT_FOUND)


class CollectionBookSuggestionsView(APIView):
    def get(self, request, collection_id):
        try:
            # Retrieve the collection and its book IDs
            collection = Collection.objects.get(id=collection_id)
            book_ids = [str(book.id) for book in collection.books.all()]
            if not book_ids:
                return Response({"message": "No books in the collection to base suggestions on."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Connect to Elasticsearch
            client = Elasticsearch("http://elasticsearch:9200")

            # Fetch embeddings of books in the collection
            resp = client.search(
                index="books",
                body={
                    "query": {
                        "terms": {
                            "_id": book_ids
                        }
                    },
                    "_source": ["embedding"]
                }
            )
            # Replace the embeddings extraction with safer code
            embeddings = []
            for hit in resp['hits']['hits']:
                if '_source' in hit and 'embedding' in hit['_source']:
                    embedding_data = hit['_source']['embedding']
                    if embedding_data and isinstance(embedding_data, list) and len(embedding_data) > 0:
                        try:
                            embedding_array = np.array(embedding_data, dtype=np.float32)
                            if not np.isnan(embedding_array).any() and not np.isinf(embedding_array).any():
                                embeddings.append(embedding_array)
                        except (ValueError, TypeError) as e:
                            print(f"Invalid embedding for book {hit['_id']}: {e}")
                            continue

            if not embeddings:
                return Response(
                    {"message": "No valid embeddings found for books in this collection."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Compute the average embedding
            average_embedding = np.mean(embeddings, axis=0)

            # Search for similar books, excluding those already in the collection
            search_resp = client.search(
                index="books",
                body={
                    "query": {
                        "script_score": {
                            "query": {
                                "bool": {
                                    "must_not": {
                                        "terms": {
                                            "_id": book_ids
                                        }
                                    }
                                }
                            },
                            "script": {
                                "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                "params": {"query_vector": average_embedding.tolist()},
                            },
                        }
                    },
                    "_source": ["title", "author", "description"],
                    "size": 10  # Return top 10 suggestions
                }
            )

            # Extract book IDs and preserve order based on similarity score
            suggested_book_ids = [int(hit['_id']) for hit in search_resp['hits']['hits']]
            order = Case(*[When(id=book_id, then=pos) for pos, book_id in enumerate(suggested_book_ids)])
            suggested_books = Book.objects.filter(id__in=suggested_book_ids).order_by(order)

            # Serialize and return the suggestions
            serializer = BookSerializer(suggested_books, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Collection.DoesNotExist:
            return Response({"error": "Collection not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)