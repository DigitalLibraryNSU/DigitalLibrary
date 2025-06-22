import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userReviewsStore from "../Store/ReviewsStore.ts";
import { Header } from "../components/header.tsx";
import { authStore } from "../Store/tokenStore.ts";
import styled from "styled-components";

// Стилизованные компоненты
const ReviewsContainer = styled.div`
    margin-top: 20px;
    padding: 100px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    .big-container {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
    }
`;

const ReviewItem = styled.div`
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid black;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border: 2px solid #ff9900;
    }

    h3 {
        margin: 0 0 5px;
        font-size: 18px;
        color: #333;
        font-family: 'RuslanDisplay', sans-serif;
    }

    p {
        margin: 0;
        font-size: 14px;
        color: #555;
    }

    .review-meta {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 13px;
        color: #777;
    }

    .review-rating {
        font-weight: bold;
        color: #ff9900;
        font-size: 16px;
    }
`;

const Title = styled.h1`
  font-family: 'RuslanDisplay', sans-serif;
  font-size: 40px;
  margin-bottom: 20px;
  text-align: center;
`;

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

    const handleReviewClick = (bookId: string) => {
        navigate(`/books/${bookId}`);
    };

    return (
        <ReviewsContainer>
            <Header />
            <div className="big-container">
                <Title>Мои отзывы</Title>

                {userReviewsStore.isLoading ? (
                    <div style={{ textAlign: 'center' }}>Загрузка...</div>
                ) : userReviewsStore.error ? (
                    <div style={{ color: 'red', textAlign: 'center' }}>{userReviewsStore.error}</div>
                ) : userReviewsStore.reviews.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>У вас пока нет отзывов</div>
                ) : (
                    <div className="reviews-container">
                        {userReviewsStore.reviews.map((review) => (
                            <ReviewItem
                                key={review.username}
                                onClick={() => handleReviewClick(review.book)}
                            >
                                <h3>{review.title}</h3>
                                <p>{review.body}</p>
                                <div className="review-meta">
                                    <span className="review-rating">
                                        {'★'.repeat(review.rate)}{'☆'.repeat(5 - review.rate)}
                                    </span>
                                </div>
                            </ReviewItem>
                        ))}
                    </div>
                )}
            </div>
        </ReviewsContainer>
    );
});

export default MyReviewsPage;
