import { useNavigate } from "react-router-dom";
import "../styles/bookCard.css";
import { useCallback } from "react";

interface BookCardProps {
    name: string;
    description: string;
    author: string;
    bookId: string;
    img: string;
}

const BookCard: React.FC<BookCardProps> = ({ name, description, author, bookId, img }) => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => { navigate(`/books/${bookId}`) }, [bookId]);

    return (
        <div className="book-card" onClick={handleClick}>
            <div className="book-card__cover-wrapper">
                <img className="book-card__cover" src={img} alt="Обложка книги" />
                <div className="book-card__corner"></div>
            </div>
            <div className="book-card__details">
                <h3 className="book-card__title">{name}</h3>
                <p className="book-card__author">{author}</p>
            </div>
        </div>
    );
};

export default BookCard;
