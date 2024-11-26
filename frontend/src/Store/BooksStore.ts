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


class BooksStore {
    books: Book[] = [];
    isLoading = false;
    error = null;


    constructor() {
        makeAutoObservable(this);
    }

    async fetchBooksByCollection(collectionId: string ) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://127.0.0.1:8000/collections/${collectionId}/?format=json`);
            // console.log(`http://localhost:1337/api/collections/${collectionId}?populate=*`);
            console.log("API response:", response);
            this.books = response.data.books.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? `http://127.0.0.1:8000/${book.image}` : '',
            }));
            console.log("Processed books:", this.books);
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching books:", error);
        } finally {
            this.isLoading = false;
        }
    }


    async fetchBooksByAuthor(author: string ) {
        this.isLoading = true;
        this.error = null;

        try {
            // console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://127.0.0.1:8000/bookByAuthor/${author}/`);
            // console.log("API get:", `http://localhost:1337/api/books?filters[author][$eq]=${author}`);
            console.log("API response:", response);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? `http://127.0.0.1:8000/${book.image}` : '',
            }));
            console.log("Processed books:", this.books);
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching books:", error);
        } finally {
            this.isLoading = false;
        }
    }


    async fetchBooksByTitle(title: string ) {
        this.isLoading = true;
        this.error = null;

        try {
            // console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://127.0.0.1:8000/bookByTitle/${title}/?format=json`);
            console.log("API response:", response);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? `http://127.0.0.1:8000/${book.image}` : '',
            }));
            console.log("Processed books:", this.books);
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching books:", error);
        } finally {
            this.isLoading = false;
        }
    }
    
    async fetchBooksByContent(content: string ) {
        this.isLoading = true;
        this.error = null;

        try {
            // console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://127.0.0.1:8000/bookByExcerpt/${content}/?format=json`);
            console.log("API response:", response);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? `http://127.0.0.1:8000/${book.image}` : '',
            }));
            console.log("Processed books:", this.books);
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching books:", error);
        } finally {
            this.isLoading = false;
        }
    }


    async fetchBooksByTopic(topic: string ) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await axios.get(`http://127.0.0.1:8000/bookByTheme/${topic}/?format=json`);
            console.log("API response:", response);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? `http://127.0.0.1:8000/${book.image}` : '',
            }));
            console.log("Processed books:", this.books);
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching books:", error);
        } finally {
            this.isLoading = false;
        }
    }
}

const booksStore = new BooksStore();
export default booksStore;



