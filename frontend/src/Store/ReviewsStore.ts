import { makeAutoObservable } from "mobx";
import axios from "axios";
import getAddress from "./apiAddress.ts";
import { authStore } from "./tokenStore.ts";

interface Review {
    title: string;
    body: string;
    rate: number;
    username: string;
}

class BookReviewsStore {
    reviews: Review[] = [];
    isLoading = false;
    error: string | null = null;
    apiAddress = getAddress;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchBookReviews(bookId: number) {
        this.isLoading = true;
        this.error = null;

        try {
            console.log("Fetching reviews...");
            const config = authStore.token ? {
                headers: {
                    Authorization: `Token ${authStore.token}`
                }
            } : {};

            const response = await axios.get(
                `${this.apiAddress}/reviews/${bookId}/`,
                config
            );

            const reviews = response.data;

            console.log(reviews);

            this.reviews = response.data.map((review: any) => ({
                title: review.title,
                body: review.body,
                rate: review.rate,
                username: review.username,
            }));
        } catch (error: any) {
            this.error = error.response?.data?.message || error.message;
            console.error("Error fetching book reviews:", error);
        } finally {
            this.isLoading = false;
        }
    }

    clearReviews() {
        this.reviews = [];
    }

    async createReview(bookId: number, text: string, rating: number, title: string) {
        this.isLoading = true;
        this.error = null;

        try {
            const response = await axios.post(
                `${this.apiAddress}/reviews/create/`,
                {
                    book: bookId,
                    body: text,
                    rate: rating,
                    title: title
                },
                {
                    headers: {
                        'Authorization': `Token ${authStore.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error: any) {
            this.error = error.response?.data?.message ||
                error.response?.data?.detail ||
                error.message;
            console.error("Error creating review:", error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async fetchUserReviews() {
        if (!authStore.isAuthenticated) return;

        this.isLoading = true;
        this.error = '';

        try {
            const response = await axios.get(
                `${this.apiAddress}/api/reviews/byUser`,
                {
                    headers: {
                        Authorization: `Token ${authStore.token}`,
                    },
                }
            );
            this.reviews = response.data.map((review: any) => ({
                title: review.title,
                body: review.body,
                rate: review.rate,
                username: review.username,
            }));
        } catch (err) {
            this.error = 'Не удалось загрузить отзывы';
            console.error('Error fetching reviews:', err);
        } finally {
            this.isLoading = false;
        }
    }
}

const bookReviewsStore = new BookReviewsStore();
export default bookReviewsStore;
