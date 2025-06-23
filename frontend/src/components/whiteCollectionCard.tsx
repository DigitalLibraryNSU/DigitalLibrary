import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/whiteCollectionCard.css";

type CardProps = {
    title: string;
    description: string;
    collectionId: string;
};

const whiteCollectionCard: FC<CardProps> = ({ title, description, collectionId }) => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => {
        navigate(`/collections/${collectionId}`);
    }, [collectionId]);

    return (
        <div className="white-card" onClick={handleClick}>
            <div className="white-card__border"></div>
            <div className="white-card__content">
                <span className="white-card__title">{title.toUpperCase()}</span>
                <span className="white-card__description">{description}</span>
            </div>
        </div>
    );
};

export default whiteCollectionCard;
