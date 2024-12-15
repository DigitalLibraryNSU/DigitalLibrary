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
    apiAddress = "http://84.237.53.139:8000";


    constructor() {
        makeAutoObservable(this);
    }

    async fetchBooksByCollection(collectionId: string ) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(this.apiAddress+`/collections/${collectionId}/?format=json`);
            console.log("API response:", response);
            this.books = response.data.books.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? this.apiAddress+`/${book.image}` : '',
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
            const response = await axios.get(this.apiAddress+`/bookByAuthor/${author}/`);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? this.apiAddress+`/${book.image}` : '',
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
            const response = await axios.get(this.apiAddress+`/bookByTitle/${title}/?format=json`);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? this.apiAddress+`/${book.image}` : '',
            }));
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
            const response = await axios.get(this.apiAddress+`/bookByExcerpt/${content}/?format=json`);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? this.apiAddress+`/${book.image}` : '',
            }));
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
            const response = await axios.get(this.apiAddress+`/bookByTheme/${topic}/?format=json`);
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? this.apiAddress+`/${book.image}` : '',
            }));
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



