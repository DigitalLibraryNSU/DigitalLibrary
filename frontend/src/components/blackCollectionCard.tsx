import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/blackCollectionCard.css";

type CardProps = {
    title: string;
    description: string;
    collectionId: string;
};

const blackCollectionCard: FC<CardProps> = ({ title, description, collectionId }) => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => {
        navigate(`/collections/${collectionId}`);
    }, [collectionId]);

    return (
        <div className="black-card" onClick={handleClick}>
            <div className="black-card__border"></div>
            <div className="black-card__content">
                <span className="black-card__title">{title.toUpperCase()}</span>
                <span className="black-card__description">{description}</span>
            </div>
        </div>
    );
};

export default blackCollectionCard;
