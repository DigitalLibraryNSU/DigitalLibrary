import { FC } from "react";
import {useNavigate} from "react-router-dom";
import "../styles/whiteCollectionCard.css"

type CardProps = {
    title: string;
    description: string;
    collectionId: string
};

const WhiteCollectionCard: FC<CardProps> = ({ title, description, collectionId }) => {
    const navigate = useNavigate();
    return (
        <div className="white-card" onClick={() => navigate(`/collections/${collectionId}`)}>
            <span className="white-card__title">{title.toUpperCase()}</span>
            <span className="white-card__description">{description}</span>
        </div>
    );
};

export default WhiteCollectionCard;
