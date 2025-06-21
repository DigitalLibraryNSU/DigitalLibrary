import collectionsStore from "./CollectionsStore.ts";
import booksStore from "./BooksStore.ts";
import bookStore from "./BookStore.ts";
import {authStore} from "./tokenStore.ts";

class RootStore {
    collectionsStore = collectionsStore;
    booksStore = booksStore;
    bookStore = bookStore;
    authStore = authStore;
}

const rootStore = new RootStore();
export default rootStore;
