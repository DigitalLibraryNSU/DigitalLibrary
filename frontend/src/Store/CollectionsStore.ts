import { makeAutoObservable } from "mobx";
import axios from "axios";

class CollectionsStore {
    collections = [];
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Получение данных о категориях
    async fetchCollections() {
        this.isLoading = true;
        this.error = null;

        try {
            console.log("Fetching collections...");  // Лог для проверки начала запроса
            const response = await axios.get("http://127.0.0.1:8000/collections/?format=json");
            console.log("API response:", response);
            this.collections = response.data.map((category: any) => ({
                id: category.id,
                documentId: category.id,
                name: category.title,
                description: category.description || '',

            }));
            console.log("Processed collections:", this.collections);
        } catch (error: any) {
            this.error = error.message;
            console.error("Error fetching collections:", error);
        } finally {
            this.isLoading = false;
        }
    }
}

const collectionsStore = new CollectionsStore();
export default collectionsStore;
