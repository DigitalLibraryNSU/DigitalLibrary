import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {MainPage} from "./pages/MainPage.tsx";
import CollectionsPage from "./pages/CollectionsPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import BookPage from "./pages/BookPage.tsx";
import AuthorizationPage from "./pages/AuthorizationPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import MyReviewsPage from "./pages/UsersReviews.tsx";
import RecommendationsPage from "./pages/RecommendationsPage.tsx";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<MainPage/>} />
                <Route path="/collections" element={<CollectionsPage/>} />
                <Route path="/smart_search" element={<SearchPage/>} />
                <Route path="/smart_search/books" element={<BooksPage/>} />
                <Route path="/books/:bookId" element={<BookPage/>} />
                <Route path="/collections/:collectionId" element={<CollectionPage/>} />
                <Route path="/authorization" element={<AuthorizationPage/>} />
                <Route path="/registration" element={<RegistrationPage/>} />
                <Route path="/reviews" element={<MyReviewsPage/>} />
                <Route path="/recommendations" element={<RecommendationsPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
