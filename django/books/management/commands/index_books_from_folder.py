import os
import tempfile
from django.core.management.base import BaseCommand
from django.core.files import File
from books.models import Book
from books.book_search import get_epub_metadata, get_book_embedding, get_chapters, index_book, get_epub_cover


class Command(BaseCommand):
    help = 'Index all books in the specified folder'

    def add_arguments(self, parser):
        parser.add_argument('folder_path', type=str, help='Path to the folder containing EPUB files')

    def handle(self, *args, **options):
        folder_path = options['folder_path']
        if not os.path.exists(folder_path):
            self.stdout.write(self.style.ERROR(f'Folder does not exist: {folder_path}'))
            return

        for filename in os.listdir(folder_path):
            if filename.endswith('.epub'):
                file_path = os.path.join(folder_path, filename)
                temp_file_path = None
                try:
                    # Create a temporary file for processing (similar to BookForm)
                    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                        with open(file_path, 'rb') as epub_file:
                            temp_file.write(epub_file.read())
                        temp_file_path = temp_file.name

                    # Extract metadata from the EPUB file
                    metadata = get_epub_metadata(temp_file_path)
                    print(metadata)  # Debug output like in BookForm

                    if "error" in metadata:
                        self.stdout.write(self.style.ERROR(f'Error processing {filename}: {metadata["error"]}'))
                        continue

                    # Create a new Book instance
                    book = Book()

                    # Set title (improved logic from BookForm)
                    if metadata.get('title'):
                        book.title = metadata.get('title', '')
                    else:
                        book.title = ""

                    # Set description (improved logic from BookForm)
                    if metadata.get('description', ''):
                        book.description = metadata.get('description', '')
                    else:
                        book.description = ""

                    # Set author (improved logic from BookForm)
                    if metadata.get('author', []) != [None]:
                        book.author = ', '.join(metadata.get('author', []))
                    else:
                        book.author = ""

                    # Set publisher (fixed logic - was buggy in original BookForm)
                    if metadata.get('publisher', ''):
                        book.publisher = metadata.get('publisher', '')
                    else:
                        book.publisher = ""

                    # Set published date (improved logic from BookForm)
                    published_date_str = metadata.get('date', '')
                    year_str = published_date_str[:4] if published_date_str else ''
                    book.publishedAt = int(year_str) if year_str.isdigit() else None

                    # Attach the EPUB file to the Book instance
                    with open(file_path, 'rb') as f:
                        book.bookFile.save(filename, File(f), save=False)

                    # Extract and save cover image (new functionality from BookForm)
                    print(f"Processing cover for: {temp_file_path}")  # Debug output
                    cover_file = get_epub_cover(temp_file_path)
                    print(f"Cover file result: {cover_file}")  # Debug output

                    if cover_file:
                        file_name = f"{book.title}_cover.jpg"
                        book.image.save(file_name, cover_file, save=False)

                    # Save the book to the database
                    book.save()

                    # Generate embedding and index in Elasticsearch
                    embedding = get_book_embedding(temp_file_path)
                    excerpts = get_chapters(temp_file_path)
                    index_book(
                        book_id=book.id,
                        title=book.title,
                        author=book.author,
                        description=book.description,
                        excerpts=excerpts,
                        embedding=embedding
                    )

                    self.stdout.write(self.style.SUCCESS(f'Successfully indexed {filename}'))

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error indexing {filename}: {e}'))
                finally:
                    # Clean up temporary file
                    if temp_file_path and os.path.exists(temp_file_path):
                        os.remove(temp_file_path)
