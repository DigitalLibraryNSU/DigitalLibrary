import axios from "axios";
import getAddress from "./apiAddress.ts";
import apiAddress from "./apiAddress.ts";
import { authStore } from "./tokenStore.ts";

interface IAuthStore {
    username?: string;
    password: string;
    email: string;
    usernameError: string;
    emailError: string;
    passwordError: string;
    nonFieldError: string;
}

class AuthStore implements IAuthStore {
    error = "Неопознанная ошибка";
    usernameError: string = "";
    emailError: string = "";
    passwordError: string = "";
    nonFieldError: string = "";
    status: number = 0;
    apiAddress: string = getAddress;

    constructor(public password: string, public email: string, public username?: string) {}

    clearErrors() {
        this.usernameError = "";
        this.emailError = "";
        this.passwordError = "";
        this.nonFieldError = "";
        this.error = "Неопознанная ошибка";
    }

    async register() {
        this.clearErrors();
        try {
            const response = await axios.post(this.apiAddress + '/auth/users/', {
                email: this.email,
                username: this.username,
                password: this.password.toString(),
            });
            this.status = response.status;
            return true;
        } catch (error: any) {
            if (error.response) {
                // Ошибки валидации от бэкенда
                const data = error.response.data;

                if (data.username) {
                    this.usernameError = Array.isArray(data.username)
                        ? data.username.join(' ')
                        : data.username;
                }

                if (data.email) {
                    this.emailError = Array.isArray(data.email)
                        ? data.email.join(' ')
                        : data.email;
                }

                if (data.password) {
                    this.passwordError = Array.isArray(data.password)
                        ? data.password.join(' ')
                        : data.password;
                }

                if (data.non_field_errors) {
                    this.nonFieldError = Array.isArray(data.non_field_errors)
                        ? data.non_field_errors.join(' ')
                        : data.non_field_errors;
                }
            } else {
                this.error = error.message;
            }
            console.error("Registration error:", error);
            return false;
        }
    }

    async authenticate() {
        this.clearErrors();
        try {
            const response = await axios.post(apiAddress + '/auth/token/login/', {
                email: this.email,
                password: this.password,
                username: this.username,
            });
            this.status = response.status;
            authStore.login(response.data.auth_token);
            return true;
        } catch (error: any) {
            if (error.response) {
                const data = error.response.data;

                if (data.non_field_errors) {
                    this.nonFieldError = Array.isArray(data.non_field_errors)
                        ? data.non_field_errors.join(' ')
                        : data.non_field_errors;
                } else {
                    this.nonFieldError = "Неверные учетные данные";
                }
            } else {
                this.error = error.message;
            }
            console.error("Authentication error:", error);
            return false;
        }
    }
}

export default AuthStore;
