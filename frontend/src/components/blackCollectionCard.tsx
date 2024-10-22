import { FC } from "react";
import {useNavigate} from "react-router-dom";
import "../styles/blackCollectionCard.css"

type CardProps = {
    title: string;
    description: string;
    collectionId: string
};

const BlackCollectionCard: FC<CardProps> = ({ title, description, collectionId }) => {
    const navigate = useNavigate();
    return (
        <div className="black-card" onClick={() => navigate(`/collections/${collectionId}`)}>
            <span className="black-card__title">{title.toUpperCase()}</span>
            <span className="black-card__description">{description}</span>
        </div>
    );
};

export default BlackCollectionCard;
