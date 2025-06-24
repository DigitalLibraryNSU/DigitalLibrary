import { useNavigate } from "react-router-dom";
import "../styles/bookCard.css";
import { useCallback } from "react";

interface BookCardProps {
    name: string;
    description: string;
    author: string;
    bookId: string;
    img: string;
    avg_score?: number; // Добавляем необязательное поле для рейтинга
}

const BookCard: React.FC<BookCardProps> = ({ name, description, author, bookId, img, avg_score }) => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => { navigate(`/books/${bookId}`) }, [bookId]);

    // Функция для отображения рейтинга в звёздах
    const renderRatingStars = (rating?: number) => {
        if (!rating) return null;

        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="book-rating">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="star full-star">★</span>
                ))}
                {hasHalfStar && <span className="star half-star">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="star empty-star">☆</span>
                ))}
                <span className="rating-value">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className="book-card" onClick={handleClick}>
            <div className="book-card__cover-wrapper">
                <img className="book-card__cover" src={img} alt="Обложка книги" />
                <div className="book-card__corner"></div>
            </div>
            <div className="book-card__details">
                {renderRatingStars(avg_score)}
                <h3 className="book-card__title">{name}</h3>
                <p className="book-card__author">{author}</p>
            </div>
        </div>
    );
};

export default BookCard;
