import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useStore } from "../Store/StoreContext";
import { useParams } from "react-router-dom";

interface Review {
  title: string;
  body: string;
  rate: number;
  username: string;
}

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

  .review-rating {
    margin-top: 10px;
    font-weight: bold;
    color: #ff9900;
  }
`;

const Reviews: React.FC = observer(() => {
  const { bookId } = useParams<{ bookId: string }>();
  const { authStore } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/reviews/${bookId}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const response = await fetch("/reviews/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      const newReview = await response.json();
      setReviews((prev) => [...prev, newReview]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ReviewsContainer>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((review, index) => (
            <ReviewItem key={index}>
              <h3>{review.title}</h3>
              <p>{review.body}</p>
              <p className="review-rating">Rating: {review.rate}</p>
              <p>By: {review.username}</p>
            </ReviewItem>
          ))}
        </ul>
      )}
      {authStore.isAuthenticated ? (
        <form onSubmit={handleSubmitReview}>
          <h3>Leave a Review</h3>
          <input type="text" name="title" placeholder="Title" required />
          <textarea name="body" placeholder="Your review" required />
          <input type="number" name="rate" min="0" max="5" placeholder="Rating (0-5)" required />
          <input type="hidden" name="book" value={bookId} />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>
          Please <a href="/login">log in</a> to leave a review.
        </p>
      )}
    </ReviewsContainer>
  );
});

export default Reviews;