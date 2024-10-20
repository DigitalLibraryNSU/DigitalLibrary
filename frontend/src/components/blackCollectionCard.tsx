import styled from "styled-components";
import { FC } from "react";
import {useNavigate} from "react-router-dom";

type CardProps = {
    title: string;
    description: string;
    collectionId: string
};

const BlackCard: FC<CardProps> = ({ title, description, collectionId }) => {
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
        background-color: #232323;
        transition: all 0.2s;
        border-radius: 10px;
        display: flex;
        flex-direction: column; /* Изменяем направление на колонку (вертикально) */
        justify-content: center; /* Центрируем по вертикали */
        align-items: center; /* Центрируем по горизонтали */
        padding: 20px;
    }

    .CardTitle {
        font-family: Newake;
        color: #ededed;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px; /* Добавляем отступ между заголовком и описанием */
    }

    .description {
        color: #dad9d9;
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
            width: 300px;
            height: 200px;
            background-color: #232323FF;
            transition: all 0.2s;
            border-radius: 10px;
            display: flex;
            flex-direction: column; /* Изменяем направление на колонку (вертикально) */
            justify-content: center; /* Центрируем по вертикали */
            align-items: center; /* Центрируем по горизонтали */
            padding: 20px;
        }

        .CardTitle {
            font-family: Newake;
            color: white;
            //font-weight: bold;
            text-align: center;
            margin-bottom: 10px; /* Добавляем отступ между заголовком и описанием */
        }

        .description {
            color: white;
            font-weight: lighter;
            text-align: center;
        }

        .card:hover {
            transform: scale(0.98);
            border-radius: 20px;
        }
    }

`;

export default BlackCard;
