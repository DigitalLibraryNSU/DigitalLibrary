import styled from "styled-components";
import { FC } from "react";
import {useNavigate} from "react-router-dom";

type CardProps = {
    title: string;
    description: string;
    collectionId: string
};

const WhiteCard: FC<CardProps> = ({ title, description, collectionId }) => {
    const navigate = useNavigate();
    return (
        <StyledWrapper>
            <div className="card" onClick={() => navigate(`/collections/${collectionId}`)}>
                <span className="CardTitle">{title.toUpperCase()}</span>
                <span className="description">{description}</span>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`

    .card {
        width: 400px;
        height: 220px;
        background-color: white;
        border: black solid 1px;
        transition: all 0.2s;
        display: flex;
        border-radius: 10px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    .CardTitle {
        font-family: Newake;
        color: #000000;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px; /* Добавляем отступ между заголовком и описанием */
    }

    .description {
        color: #1a1a1a;
        font-weight: lighter;
        text-align: center;
        font-family: Broadleaf;
        font-size: 15px;
    }

    .card:hover {
        transform: scale(0.98);
        border-radius: 20px;
    }

    @media (max-width: 576px) {

        .card {
            width: 350px;
            height: 200px;
            background-color: white;
            border: black solid 1px;
            transition: all 0.2s;
            display: flex;
            border-radius: 10px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .CardTitle {
            font-family: Newake;
            font-size: 30px;
            color: black;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }

        .description {
            color: black;
            font-weight: lighter;
            text-align: center;
        }

        .card:hover {
            transform: scale(0.98);
            border-radius: 20px;
        }
    }

`;

export default WhiteCard;
