from django_elasticsearch_dsl import Document, TextField
from django_elasticsearch_dsl.registries import registry

from .collectionEmbeddingUtils import get_collection_embedding_by_book_ids
from .models import Book, Collection
from .book_search import get_chapters, get_book_embedding

@registry.register_document
class BookDocument(Document):
    class Index:
        name = 'books'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    excerpts = TextField()

    def prepare_excerpts(self, instance):
        return get_chapters('media/' + instance.bookFile.name)

    def prepare_embedding(self, instance):
        return get_book_embedding('media/' + instance.bookFile.name)

    class Django:
        model = Book
        fields = [
            'title',
            'author',
            'description',
        ]


@registry.register_document
class CollectionDocument(Document):
    class Index:
        name = 'collections'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    def prepare_embedding(self, instance):
        return get_collection_embedding_by_book_ids(instance.id)

    class Django:
        model = Collection
        fields = [
            'title',
        ]