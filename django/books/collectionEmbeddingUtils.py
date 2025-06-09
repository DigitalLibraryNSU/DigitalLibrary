import numpy as np
from elasticsearch import Elasticsearch
from rest_framework.exceptions import ValidationError

from digitalLibraryBackend.settings import ELASTIC_URL


def get_collection_embedding_by_book_ids(book_ids, client=Elasticsearch(ELASTIC_URL)):

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
        raise ValidationError('No valid embeddings found for books in this collection.')

    # Compute the average embedding
    average_embedding = np.mean(embeddings, axis=0)

    return average_embedding