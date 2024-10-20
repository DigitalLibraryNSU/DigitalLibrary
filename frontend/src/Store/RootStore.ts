import collectionsStore from "./CollectionsStore.ts";
import booksStore from "./BooksStore.ts";
import bookStore from "./BookStore.ts";

class RootStore {
    collectionsStore = collectionsStore;
    booksStore = booksStore;
    bookStore = bookStore;
}

const rootStore = new RootStore();
export default rootStore;
