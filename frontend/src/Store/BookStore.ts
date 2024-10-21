import { makeAutoObservable } from "mobx";
import axios from "axios";


interface Book {
    id: string;
    documentId: string;
    name: string;
    description: string;
    author: string;
    image: string;
}

class BookStore {
    book: Book | null = null;
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchBook(bookId: string) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log(`http://localhost:1337/api/books/${bookId}?populate=*`);  // Лог для проверки начала запроса
            const response = await axios.get(`http://localhost:1337/api/books/${bookId}?populate=*`);
            console.log("API response:", response);

            const book = response.data.data;

            this.book = {
                id: book.id,
                documentId: book.documentId,
                name: book.name,
                description: book.description || '',
                author: book.author || '',
                image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
            };

            console.log(`http://localhost:1337/api/books/${bookId}`)
            console.log(book.image)
            console.log("Processed book:", this.book);
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
