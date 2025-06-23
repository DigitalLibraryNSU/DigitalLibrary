import { makeAutoObservable } from "mobx";
import axios from "axios";
import getAddress from "./apiAddress.ts"
import {authStore} from "./tokenStore.ts";

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
    average_rating: number;
    reviews_count: number;
    score: number;
}


class BooksStore {
    books: Book[] = [];
    isLoading = false;
    error = null;
    apiAddress = getAddress;


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
                image: book.image ? this.apiAddress +`${book.image}` : '',
                average_rating: book.average_rating,
                reviews_count: book.reviews_count,
                score: book.score,
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
                image: book.image ? this.apiAddress+`${book.image}` : '',
                average_rating: book.average_rating,
                reviews_count: book.reviews_count,
                score: book.score,
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
                image: book.image ? this.apiAddress+`${book.image}` : '',
                average_rating: book.average_rating,
                reviews_count: book.reviews_count,
                score: book.score,
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
                image: book.image ? this.apiAddress+`${book.image}` : '',
                average_rating: book.average_rating,
                reviews_count: book.reviews_count,
                score: book.score,
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
                image: book.image ? this.apiAddress+`${book.image}` : '',
                average_rating: book.average_rating,
                reviews_count: book.reviews_count,
                score: book.score,
            }));
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching books:", error);
        } finally {
            this.isLoading = false;
        }
    }


    async fetchBooksByRecommendations() {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await axios.get(
                `${this.apiAddress}/books/recommendations/?format=json`,
                {
                    headers: {
                        'Authorization': `Token ${authStore.token}`,
                        'Content-Type': 'application/json'
                    }
                }
                );
            this.books = response.data.map((book: any) => ({
                id: book.id,
                documentId: book.id,
                name: book.title,
                description: book.description.slice(0, 200)+"..." || '',
                author: book.author || '',
                image: book.image ? this.apiAddress+`${book.image}` : '',
                average_rating: book.average_rating,
                reviews_count: book.reviews_count,
                score: book.score,
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



