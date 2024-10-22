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
            const response = await axios.get(`http://localhost:1337/api/collections/${collectionId}?populate=books.image`);
            console.log(`http://localhost:1337/api/collections/${collectionId}?populate=*`);
            console.log("API response:", response);
            this.books = response.data.data.books.map((book: any) => ({
                id: book.id,
                documentId: book.documentId,
                name: book.name,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
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
            console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://localhost:1337/api/books?filters[author][$eq]=${author}&populate=*`);
            console.log("API get:", `http://localhost:1337/api/books?filters[author][$eq]=${author}`);
            console.log("API response:", response);
            this.books = response.data.data.map((book: any) => ({
                id: book.id,//number
                documentId: book.documentId,//string
                name: book.name,//string
                description: book.description.slice(0, 200)+"..." || '',//string
                author: book.author || '',//string
                image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
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
            console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://localhost:1337/api/books?filters[name][$eq]=${title}&populate=*`);
            console.log("API response:", response);
            this.books = response.data.data.map((book: any) => ({
                id: book.id,
                documentId: book.documentId,
                name: book.name,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
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
            console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://localhost:1337/api/books?populate=*`);
            console.log("API response:", response);
            this.books = response.data.data.map((book: any) => ({
                id: book.id,
                documentId: book.documentId,
                name: book.name,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
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
            console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get(`http://localhost:1337/api/books?populate=*`);
            console.log("API response:", response);
            this.books = response.data.data.map((book: any) => ({
                id: book.id,
                documentId: book.documentId,
                name: book.name,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image?.[0]?.url ? `http://localhost:1337${book.image[0].url}` : '',
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
