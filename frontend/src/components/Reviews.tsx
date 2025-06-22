import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import bookReviewsStore from "../Store/ReviewsStore.ts";
import { authStore } from "../Store/tokenStore";

const StarIcon = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? '#ff9900' : '#ddd'};
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ff9900;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 5px;
  margin: 10px 0;
`;

const ReviewsContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ReviewItem = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;

  h3 {
    margin: 0 0 5px;
    font-size: 18px;
    color: #333;
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
  }
`;

const ReviewForm = styled.form`
  margin-top: 20px;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 8px;

  h3 {
    margin-top: 0;
    font-family: 'RuslanDisplay', sans-serif;
    font-size: 20px;
  }

  input, textarea {
    width: 100%;
    margin: 10px 0;
    padding: 8px;
    border: 2px solid #323232;
    border-radius: 10px;
    font-family: 'RuslanDisplay', sans-serif;
  }

  textarea {
    min-height: 100px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  button {
    padding: 10px;
    width: 100%;
    font-family: 'Broadleaf', sans-serif;
    font-size: 17px;
    border-radius: 10px;
    background-color: black;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #333;
    }

    &:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
  }
`;

const Reviews: React.FC = observer(() => {
  const { bookId } = useParams<{ bookId: string }>();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (bookId) {
      bookReviewsStore.fetchBookReviews(parseInt(bookId));
    }
    return () => {
      bookReviewsStore.clearReviews();
    };
  }, [bookId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId || rating === 0) return;

    try {
      await bookReviewsStore.createReview(
          parseInt(bookId),
          text,
          rating,
          title
      );
      setTitle("");
      setText("");
      setRating(0);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
    bookReviewsStore.fetchBookReviews(parseInt(bookId));
  };

  if (bookReviewsStore.isLoading) return <div key="loading" className="loading">Загрузка...</div>;
  if (bookReviewsStore.error) return <div key="error" className="error">{bookReviewsStore.error}</div>;

  return (
      <ReviewsContainer key="reviews-container">
        <h2 key="reviews-title">Отзывы</h2>

        {bookReviewsStore.reviews.length === 0 ? (
            <p key="no-reviews-text">Пока на эту книгу отзывов нет, но Вы можете стать первым</p>
        ) : (
            <div key="reviews-list">
              {bookReviewsStore.reviews.map((review) => (
                  <ReviewItem key={review.username}>
                    <h3>{review.title}</h3>
                    <p >{review.body}</p>
                    <div className="review-meta">
                      <span className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span>
                            {i < review.rate ? '★' : '☆'}
                          </span>
                        ))}
                      </span>
                      <span>
                        От {review.username}
                      </span>
                    </div>
                  </ReviewItem>
              ))}
            </div>
        )}

        {authStore.isAuthenticated ? (
            <ReviewForm key="review-form" onSubmit={handleSubmitReview}>
              <h3 key="form-title">Написать отзыв</h3>

              <div key="title-input-group" className="form-group">
                <input
                    key="title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Заголовок отзыва"
                    required
                />
              </div>

              <div key="text-input-group" className="form-group">
            <textarea
                key="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ваш отзыв о книге..."
                required
            />
              </div>

              <div key="rating-input-group" className="form-group">
                <StarRating key="star-rating">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                        <StarIcon
                            key={`star-${i}`}
                            filled={ratingValue <= (hoverRating || rating)}
                            onClick={() => setRating(ratingValue)}
                            onMouseEnter={() => setHoverRating(ratingValue)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                          {ratingValue <= (hoverRating || rating) ? '★' : '☆'}
                        </StarIcon>
                    );
                  })}
                </StarRating>
                <div key="rating-text" style={{ color: '#777', fontSize: '14px' }}>
                  {rating > 0 ? `Вы выбрали: ${rating} ${rating === 1 ? 'звезда' : rating < 5 ? 'звезды' : 'звёзд'}` : 'Выберите оценку'}
                </div>
              </div>

              <button
                  key="submit-button"
                  type="submit"
                  disabled={bookReviewsStore.isLoading || rating === 0}
              >
                {bookReviewsStore.isLoading ? 'Отправка...' : 'Опубликовать отзыв'}
              </button>
            </ReviewForm>
        ) : (
            <p key="login-prompt">
              <a href="/authorization" style={{color: '#323232', textDecoration: 'underline'}}>
                Войдите
              </a>, чтобы оставить отзыв
            </p>
        )}
      </ReviewsContainer>
  );
});

export default Reviews;
