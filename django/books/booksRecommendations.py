from django.db.models import Case, When
from elasticsearch import Elasticsearch
from rest_framework.exceptions import ValidationError

from books.collectionEmbeddingUtils import get_collection_embedding_by_book_ids
from books.models import Collection, Book
from digitalLibraryBackend.settings import ELASTIC_URL


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