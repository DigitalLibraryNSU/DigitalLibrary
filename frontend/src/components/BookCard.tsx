import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
        <StyledWrapper onClick={() => navigate(`/book/${bookId}`)}>
            <div className="card">
                <img className="image" src={img} alt="book cover" />
                <div className="category"> {author} </div>
                <div className="heading">
                    {name}
                    <div className="author">
                        <span className="name">{description}</span>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: black solid 1px;
        margin-left: 10px;
        margin-right: 10px;
        width: 250px;
        height: 350px;
        background: white;
        padding: .7em;
        border-radius: 6px;
        text-align: center; /* Центрирование текста */
    }

    .image {
        background-color: rgb(236, 236, 236);
        height: 170px;
        //width: 120px; 
        border-radius: 6px;
        margin-bottom: 10px;
        object-fit: cover; /* Для сохранения пропорций изображения */
    }
    
    .category {
        text-transform: uppercase;
        font-size: 0.7em;
        font-weight: 600;
        color: rgb(6, 10, 16);
        padding: 10px 7px 0;
    }

    .heading {
        font-weight: 600;
        color: rgb(2, 1, 1);
        padding: 7px;
    }

    .author {
        color: gray;
        font-weight: 400;
        font-size: 11px;
        padding-top: 20px;
    }

    .name {
        font-weight: 600;
    }
`;

export default BookCard;
