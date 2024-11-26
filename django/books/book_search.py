from transformers import pipeline
import numpy as np
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
from datetime import datetime
from elasticsearch import Elasticsearch



# Загрузка модели для создания эмбеддингов
embedding_model = pipeline('feature-extraction', model='sentence-transformers/all-MiniLM-L6-v2')


# Функция для генерации эмбеддинга, обрезая текст на части по 512 токенов
def generate_embedding(text, max_tokens=512):
    # Разбиваем текст на части по 512 токенов
    chunks = [text[i:i + max_tokens] for i in range(0, len(text), max_tokens)]
    embeddings = [embedding_model(chunk)[0][0] for chunk in chunks]
    return np.mean(embeddings, axis=0)  # Возвращаем усредненный эмбеддинг по всем частям


# Функция для извлечения эмбеддингов глав
def get_chapter_embeddings(book_path):
    book = epub.read_epub(book_path)
    chapter_embeddings = []

    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = BeautifulSoup(item.get_content(), features="xml")
            chapter_text = " ".join(child.get_text() for child in soup.contents if child.get_text())

            # Проверка на пустой текст главы
            if chapter_text.strip():
                embedding = generate_embedding(chapter_text)
                chapter_embeddings.append(embedding)

    return chapter_embeddings


def get_chapters(book_path):
    book = epub.read_epub(book_path)
    chapters = []

    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = BeautifulSoup(item.get_content(), features="xml")
            chapter_text = " ".join(child.get_text() for child in soup.contents if child.get_text())
            if chapter_text.strip():
                chapters.append(chapter_text)

    return chapters


# Вычисление среднего эмбеддинга книги
def calculate_average_embedding(chapter_embeddings):
    return np.mean(chapter_embeddings, axis=0)


# Индексация книги в Elasticsearch
# def index_book(book_id, title, author, avg_embedding):
#     doc = {
#         "title": title,
#         "author": author,
#         "embedding": avg_embedding.tolist(),
#         "timestamp": datetime.now(),
#     }
#     resp = client.index(index="books-index", id=book_id, document=doc)
#     print(f"Book {title} indexed: {resp['result']}")


# Обработка книги: извлечение эмбеддингов, расчёт среднего эмбеддинга и индексация
# def process_and_index_book(book_path, book_id):
#     book = epub.read_epub(book_path)
#     title = book.get_metadata('DC', 'title')[0][0] if book.get_metadata('DC', 'title') else "Unknown Title"
#     author = book.get_metadata('DC', 'creator')[0][0] if book.get_metadata('DC', 'creator') else "Unknown Author"
#
#     chapter_embeddings = get_chapter_embeddings(book_path)
#     avg_embedding = calculate_average_embedding(chapter_embeddings)
#
#     index_book(book_id, title, author, avg_embedding)


def get_embedding(book_path):
    chapter_embeddings = get_chapter_embeddings(book_path)
    avg_embedding = calculate_average_embedding(chapter_embeddings)
    return avg_embedding

# Выполнение семантического поиска по запросу
def search_best_matching_book(query_text):
    client = Elasticsearch(
        "http://localhost:9200/"
    )
    query_embedding = generate_embedding(query_text)  # Генерация эмбеддинга для запроса

    # Поиск по индексу в Elasticsearch
    resp = client.search(index="books", query={
        "script_score": {
            "query": {
                "match_all": {}
            },
            "script": {
                "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                "params": {
                    "query_vector": query_embedding
                }
            }
        }
    })

    return resp
    # Проверка на наличие совпадений
    # if resp['hits']['total']['value'] > 0:
    #     best_match = resp['hits']['hits'][0]
    #     print("Best matching book found:")
    #     print(f"Title: {best_match['_source']['title']}")
    #     print(f"Author: {best_match['_source']['author']}")
    #     print(f"Score: {best_match['_score']}")
    # else:
    #     print("No suitable matches found.")


# Индексация двух книг
# process_and_index_book('Hamlet.epub', book_id=1)
#process_and_index_book('Divine Comedy Hell.epub', book_id=2)

# Запрос на получение всех документов из индекса
# resp = client.search(index="books-index", query={"match_all": {}}, size=1000)  # 'size=1000' указывает лимит на количество документов

# Вывод информации о книгах
# for doc in resp['hits']['hits']:
#     source = doc['_source']
#     print(f"Book ID: {doc['_id']}")
#     print(f"Title: {source.get('title', 'No title')}")
#     print(f"Author: {source.get('author', 'No author')}")
#     print(f"Timestamp: {source.get('timestamp', 'No timestamp')}")
#     print("-----------")
# # Семантический поиск
# search_term = input("Enter the search term for semantic search: ")
# search_best_matching_book(search_term)
