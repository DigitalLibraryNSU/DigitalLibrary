import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userReviewsStore from "../Store/ReviewsStore.ts";
import { Header } from "../components/header.tsx";
import { authStore } from "../Store/tokenStore.ts";
import styled from "styled-components";

// Стилизованные компоненты
const PageContainer = styled.div`
    background: #FFF9F0;
    min-height: 100vh;
    padding: 20px;
    margin-top: 80px;
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
`;

const ReviewsTitle = styled.h1`
    font-family: 'RuslanDisplay', sans-serif;
    font-size: 42px;
    color: #A52A2A;
    text-align: center;
    margin-bottom: 40px;
    position: relative;
    padding-bottom: 15px;


`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #D4AF37;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(139, 69, 19, 0.2);
    border-left-color: #A52A2A;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background: #A52A2A;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    opacity: 0.1;
  }
`;

const ReviewTitle = styled.h3`
    font-family: 'RuslanDisplay', sans-serif;
  font-size: 20px;
  color: #3A3226;
  margin-bottom: 15px;
  font-weight: 700;
`;

const ReviewText = styled.p`
    font-family: Broadleaf;
  color: #5A3E36;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #E0C9A6;
    p {
        font-family: 'Broadleaf', sans-serif;
    }
`;

const Stars = styled.div`
  color: #D4AF37;
  font-size: 18px;
  letter-spacing: 2px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.1);
  max-width: 600px;
  margin: 0 auto;

  p {
      font-family: Broadleaf;
    color: #5A3E36;
    font-size: 18px;
    margin-bottom: 30px;
  }

  button {
    background: #A52A2A;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 6px;
    font-family: 'RuslanDisplay', sans-serif;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #8B0000;
      transform: translateY(-2px);
    }
  }
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

    const handleFindBooksClick = () => {
        navigate('/books');
    };

    return (
        <PageContainer>
            <Header />
            <ContentContainer>
                <ReviewsTitle>Мои отзывы</ReviewsTitle>

                {userReviewsStore.isLoading ? (
                    <div style={{ textAlign: 'center' }}>Загрузка...</div>
                ) : userReviewsStore.error ? (
                    <div style={{ color: '#A52A2A', textAlign: 'center', fontFamily: "Broadleaf" }}>
                        {userReviewsStore.error}
                    </div>
                ) : userReviewsStore.reviews.length === 0 ? (
                    <EmptyState>
                        <p>Вы еще не оставили ни одного отзыва</p>
                        <button onClick={handleFindBooksClick}>Найти книги</button>
                    </EmptyState>
                ) : (
                    <ReviewsGrid>
                        {userReviewsStore.reviews.map((review) => (
                            <ReviewCard
                                key={review.username}
                                onClick={() => handleReviewClick(review.book)}
                            >
                                <ReviewTitle>{review.title}</ReviewTitle>
                                <ReviewText>{review.body}</ReviewText>
                                <RatingContainer>
                                    <Stars>
                                        {'★'.repeat(review.rate)}{'☆'.repeat(5 - review.rate)}
                                    </Stars>
                                    <p>{review.book_title}</p>
                                </RatingContainer>
                            </ReviewCard>
                        ))}
                    </ReviewsGrid>
                )}
            </ContentContainer>
        </PageContainer>
    );
});

export default MyReviewsPage;
