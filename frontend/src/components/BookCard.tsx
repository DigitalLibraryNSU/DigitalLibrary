import { useNavigate } from "react-router-dom";
import "../styles/bookCard.css"

interface BookCardProps {
    name: string;
    description: string;
    author: string;
    bookId: string;
    img: string;
}

const BookCard: React.FC<BookCardProps> = ({ name, description, author, bookId, img }) => {
    const navigate = useNavigate();
    return (
            <button className="book-card" onClick={() => navigate(`/book/${bookId}`)}>
                <img className="book-card__image" src={img} alt="book cover" />
                <div className="book-card__author"> {author} </div>
                <div className="book-card__title">{name}</div>
                    <div className="book-card__description">
                        <span className="name">{description}</span>
                    </div>

            </button>
    );
};


export default BookCard;
