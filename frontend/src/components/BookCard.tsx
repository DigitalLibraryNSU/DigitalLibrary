import styled from "styled-components";
import {useNavigate} from "react-router-dom";

interface BookCardProps {
    name: string,
    description: string,
    author: string,
    bookId: string
}

const BookCard: React.FC<BookCardProps> = ({name, description, author, bookId}) => {
    const navigate = useNavigate();
    return (
        <StyledWrapper onClick={() => navigate(`/book/${bookId}`)}>
            <div className="card">
                <div className="card-image" />
                <div className="category"> {author} </div>
                <div className="heading">
                    {" "}
                    {name}
                    <div className="author">
                        {" "}
                        <span className="name">{description}</span>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .card {
        border: black solid 1px;
        margin-left: 10px;
        margin-right: 10px;
        width: 250px;
        height: 350px;
        background: white;
        padding: .7em;
        border-radius: 6px;
    }

    .card-image {
        background-color: rgb(236, 236, 236);
        width: 100%;
        height: 170px;
        border-radius: 6px 6px 0 0;
    }

    .card-image:hover {
        transform: scale(0.98);
    }

    .category {
        text-transform: uppercase;
        font-size: 0.7em;
        font-weight: 600;
        color: rgb(6, 10, 16);
        padding: 10px 7px 0;
    }

    .category:hover {
        cursor: pointer;
    }

    .heading {
        font-weight: 600;
        color: rgb(2, 1, 1);
        padding: 7px;

    }

    .heading:hover {
        cursor: pointer;
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

    .name:hover {
        cursor: pointer;
    }
`;

export default BookCard;
