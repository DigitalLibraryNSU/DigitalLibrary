import { makeAutoObservable } from "mobx";

class TokenStore {
    isAuthenticated = false;
    token: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.loadFromStorage();
    }

    login(token: string) {
        this.token = token;
        this.isAuthenticated = true;
        localStorage.setItem("token", token);
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem("token");
    }

    loadFromStorage() {
        const token = localStorage.getItem("token");
        if (token) {
            this.token = token;
            this.isAuthenticated = true;
        }
    }
}

export const authStore = new TokenStore();
