import axios from "axios";
import getAddress from "./apiAddress.ts"
import apiAddress from "./apiAddress.ts";
import {authStore} from "./tokenStore.ts";

interface IAuthStore {
    username?: string;
    password: string;
    email: string;
}


class AuthStore implements IAuthStore {
    error = null;
    status : number = 0;
    apiAddress : string = getAddress;


    constructor(public password: string, public email: string, public username?: string) {}


    async register() {
        try {
            const response = await axios.post(apiAddress+'/auth/users/', {
                email: this.email,
                username: this.username,
                password: this.password.toString(),
            })
            this.status = response.status;
        } catch (error: any) {
            this.error = error.message;
        }
    }

    async authenticate() {
        try{
            const response = await axios.post(apiAddress+'/auth/token/login/',
                {
                    email: this.email,
                    password: this.password,
                    username: this.username,
                })
            this.status = response.status;
            authStore.login(response.data.auth_token)
        } catch (error: any) {
            this.error = error.message;
        }
    }
}

export default AuthStore;
