import { makeAutoObservable } from "mobx";
import axios from "axios";


interface Book {
    id: string;
    documentId: string;
    name: string;
    description: string;
    author: string;
    image: string;
    documentName: string;
    documentMime: string;
    documentUrl: string;
}

class BookStore {
    book: Book | null = null;
    isLoading = false;
    error = null;
    apiAddress = "https://digital-library.hopto.org/api";

    constructor() {
        makeAutoObservable(this);
    }

    async fetchBook(bookId: string) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await axios.get(this.apiAddress+`/books/${bookId}/`);
            const book = response.data;
            this.book = {
                id: book.id,
                documentId: book.documentId,
                name: book.title,
                description: book.description || '',
                author: book.author || '',
                image: book.image ? this.apiAddress+`${book.image}` : '',
                documentName: book.title ? this.apiAddress+`${book.title}` : '',
                documentMime: book.book?.mime ? this.apiAddress+`${book.book.mime}` : '',
                documentUrl: book.bookFile ? this.apiAddress+`${book.bookFile}` : ''
            };
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching book:", error);
        } finally {
            this.isLoading = false;
        }
    }
}

const bookStore = new BookStore();
export default bookStore;
