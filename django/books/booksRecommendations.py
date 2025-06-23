from django.db.models import Case, When
from elasticsearch import Elasticsearch
from rest_framework.exceptions import ValidationError

from books.collectionEmbeddingUtils import get_collection_embedding_by_book_ids
from books.models import Collection, Book, Review
from digitalLibraryBackend.settings import ELASTIC_URL
import numpy as np
import logging


def getBooksSuggestionForCollection(collection_id):
    # Retrieve the collection and its book IDs
    collection = Collection.objects.get(id=collection_id)
    book_ids = [str(book.id) for book in collection.books.all()]

    if not book_ids:
        raise ValidationError('No books in the collection to base suggestions on.')

    client = Elasticsearch(ELASTIC_URL)

    average_embedding = get_collection_embedding_by_book_ids(book_ids, client)

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

    return Book.objects.filter(id__in=suggested_book_ids).order_by(order)


# Set up logging
logger = logging.getLogger(__name__)


def get_book_recommendations_for_user(user_id, limit=10):
    # Подключаемся к Elasticsearch
    client = Elasticsearch(ELASTIC_URL)

    # Получаем queryset положительных отзывов, отсортированных по дате (убывание)
    positive_reviews_qs = Review.objects.filter(user_id=user_id, rate__gte=3).order_by('-createdAt')

    # Проверяем наличие положительных отзывов
    if not positive_reviews_qs.exists():
        # Проверяем, есть ли вообще отзывы у пользователя
        if not Review.objects.filter(user_id=user_id).exists():
            logger.warning(f"Нет отзывов для пользователя {user_id}")
            raise ValidationError("У пользователя нет отзывов.")
        else:
            logger.warning(f"Нет положительных отзывов для пользователя {user_id}")
            raise ValidationError("У пользователя нет положительных отзывов.")

    # Берем последние 10 положительных отзывов
    positive_reviews = positive_reviews_qs[:10]
    logger.info(f"Используется {len(positive_reviews)} положительных отзывов для пользователя {user_id}")

    # Получаем ID книг из положительных отзывов
    book_ids = [str(review.book.id) for review in positive_reviews]

    # Получаем все ID книг, которые пользователь уже оценил (для исключения из рекомендаций)
    reviewed_book_ids = [str(review.book.id) for review in Review.objects.filter(user_id=user_id)]

    # Запрашиваем эмбеддинги книг из Elasticsearch
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

    # Создаем словарь эмбеддингов по ID книг
    embeddings_dict = {}
    for hit in resp['hits']['hits']:
        book_id = hit['_id']
        if '_source' in hit and 'embedding' in hit['_source']:
            embedding_data = hit['_source']['embedding']
            if embedding_data and isinstance(embedding_data, list) and len(embedding_data) > 0:
                embedding_array = np.array(embedding_data, dtype=np.float32)
                if not np.isnan(embedding_array).any() and not np.isinf(embedding_array).any():
                    embeddings_dict[book_id] = embedding_array

    # Собираем эмбеддинги и веса (рейтинги) для положительных отзывов
    embeddings = []
    weights = []
    for review in positive_reviews:
        book_id = str(review.book.id)
        if book_id in embeddings_dict:
            embeddings.append(embeddings_dict[book_id])
            weights.append(review.rate)
            logger.info(f"Обрабатывается книга {book_id} с рейтингом {review.rate} для пользователя {user_id}")

    if not embeddings:
        logger.error(f"Не найдены валидные эмбеддинги для книг пользователя {user_id}")
        raise ValidationError("Не удалось найти валидные эмбеддинги для книг пользователя.")

    # Вычисляем средневзвешенный эмбеддинг
    average_embedding = np.average(embeddings, axis=0, weights=weights)

    # Ищем похожие книги, исключая уже оцененные
    search_resp = client.search(
        index="books",
        body={
            "query": {
                "script_score": {
                    "query": {
                        "bool": {
                            "must_not": {
                                "terms": {
                                    "_id": reviewed_book_ids
                                }
                            }
                        }
                    },
                    "script": {
                        "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                        "params": {"query_vector": average_embedding.tolist()}
                    }
                }
            },
            "_source": ["title", "author", "description"],
            "size": limit
        }
    )

    # Извлекаем ID рекомендованных книг и сохраняем порядок релевантности
    recommended_book_ids = [int(hit['_id']) for hit in search_resp['hits']['hits']]
    order = Case(*[When(id=book_id, then=pos) for pos, book_id in enumerate(recommended_book_ids)])

    # Получаем рекомендованные книги из базы данных
    recommended_books = Book.objects.filter(id__in=recommended_book_ids).order_by(order)

    # Логируем рекомендованные книги
    logger.info(f"Рекомендации для пользователя {user_id}: " +
                ", ".join([f"{book.title} (ID: {book.id})" for book in recommended_books]))

    return recommended_books


def getCollectionSuggestionsForBook(book_id, similarity_threshold=0.91, max_suggestions=5):
    """
    Находит подходящие коллекции для книги на основе семантического сходства
    """
    from elasticsearch import Elasticsearch
    from books.models import Collection, Book
    from books.collectionEmbeddingUtils import get_collection_embedding_by_book_ids
    import numpy as np

    try:
        client = Elasticsearch(ELASTIC_URL)
        resp = client.get(index="books", id=book_id)

        if '_source' not in resp or 'embedding' not in resp['_source']:
            return Collection.objects.none(), []

        book_embedding = np.array(resp['_source']['embedding'], dtype=np.float32)

        book = Book.objects.get(id=book_id)
        all_collections = Collection.objects.exclude(books=book)

        collection_similarities = []

        for collection in all_collections:
            book_ids = [str(book.id) for book in collection.books.all()]

            if not book_ids:
                continue

            try:
                collection_embedding = get_collection_embedding_by_book_ids(book_ids, client)

                # Убеждаемся, что все вычисления в float64 для точности
                book_emb = book_embedding.astype(np.float64)
                coll_emb = collection_embedding.astype(np.float64)

                # Вычисляем косинусное сходство
                similarity = np.dot(book_emb, coll_emb) / (
                        np.linalg.norm(book_emb) * np.linalg.norm(coll_emb)
                )

                # Преобразуем в float для корректного сравнения
                similarity_float = float(similarity)

                # Добавляем только если сходство выше порога
                if similarity_float >= similarity_threshold:
                    collection_similarities.append((collection.id, similarity_float))
                    print(f"Added collection '{collection.title}' with similarity {similarity_float:.1%}", flush=True)
                else:
                    print(
                        f"Skipped collection '{collection.title}' - below threshold ({similarity_float:.1%} < {similarity_threshold:.1%})",
                        flush=True)

            except Exception as e:
                print(f"Error processing collection {collection.id}: {e}", flush=True)
                continue

        # Сортируем по убыванию сходства и берем максимум max_suggestions
        collection_similarities.sort(key=lambda x: x[1], reverse=True)
        suggested_collection_ids = [cid for cid, _ in collection_similarities[:max_suggestions]]
        similarity_percentages = [round(sim * 100, 1) for _, sim in collection_similarities[:max_suggestions]]

        if not suggested_collection_ids:
            return Collection.objects.none(), []

        order = Case(*[When(id=collection_id, then=pos)
                       for pos, collection_id in enumerate(suggested_collection_ids)])

        collections = Collection.objects.filter(id__in=suggested_collection_ids).order_by(order)

        return collections, similarity_percentages

    except Exception as e:
        print(f"Error finding collection suggestions for book {book_id}: {e}", flush=True)
        return Collection.objects.none(), []
