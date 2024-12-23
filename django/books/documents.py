from django_elasticsearch_dsl import Document, TextField
from django_elasticsearch_dsl.registries import registry
from .models import Book
from .book_search import get_chapters, get_embedding

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
        return get_embedding('media/' + instance.bookFile.name)

    class Django:
        model = Book
        fields = [
            'title',
            'author',
            'description',
        ]