import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userReviewsStore from "../Store/ReviewsStore.ts";
import { Header } from "../components/header.tsx";
import "../styles/reviewsPage.css";
import {authStore} from "../Store/tokenStore.ts";

const MyReviewsPage = observer(() => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            navigate('/authorization');
            return;
        }

        userReviewsStore.fetchUserReviews();

        return () => {
            userReviewsStore.clearReviews();
        };
    }, [navigate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <div className="reviews-container">
            <Header />
            <h1 className="reviews-title">Мои отзывы</h1>

            {userReviewsStore.isLoading ? (
                <div className="loading">Загрузка...</div>
            ) : userReviewsStore.error ? (
                <div className="error-message">{userReviewsStore.error}</div>
            ) : userReviewsStore.reviews.length === 0 ? (
                <div className="no-reviews">У вас пока нет отзывов</div>
            ) : (
                <>
                    <div className="reviews-list">
                        {userReviewsStore.reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <h3 className="book-title">
                                        {review.book_title}
                                    </h3>
                                    <div className="review-meta">
                                        <span className="review-date">{formatDate(review.created_at)}</span>
                                        <div className="review-rating">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                </div>
                                <p className="review-text">{review.text}</p>
                                <div className="review-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => navigate(`/edit-review/${review.id}`)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => userReviewsStore.deleteReview(review.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {userReviewsStore.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                disabled={userReviewsStore.currentPage === 1}
                                onClick={() => userReviewsStore.setPage(userReviewsStore.currentPage - 1)}
                            >
                                Назад
                            </button>
                            <span>
                                Страница {userReviewsStore.currentPage} из {userReviewsStore.totalPages}
                            </span>
                            <button
                                disabled={userReviewsStore.currentPage === userReviewsStore.totalPages}
                                onClick={() => userReviewsStore.setPage(userReviewsStore.currentPage + 1)}
                            >
                                Вперед
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

export default MyReviewsPage;
