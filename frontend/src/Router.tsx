import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {MainPage} from "./pages/MainPage.tsx";
import CollectionsPage from "./pages/CollectionsPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import BookPage from "./pages/BookPage.tsx";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<MainPage/>} />
                <Route path="/collections" element={<CollectionsPage/>} />
                <Route path="/smart_search" element={<SearchPage/>} />
                <Route path="/smart_search/books" element={<BooksPage/>} />
                <Route path="/book/:bookId" element={<BookPage/>} />
                <Route path="/collections/:collectionId" element={<CollectionPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
