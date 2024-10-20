import { useState } from "react";
import styled from "styled-components";

const Form = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [searchType, setSearchType] = useState("");

    const handleFlip = (type: string) => {
        setSearchType(type);
        setIsFlipped(!isFlipped);
    };

    const findBook = (type: string, toFind: string) => {
        if (toFind === "") {
            setIsFlipped(true);
        }
    }

    return (
        <StyledWrapper>
            <div className="flip-card">
                <div className={`flip-card__inner ${isFlipped ? 'flipped' : ''}`}>
                    <div className="flip-card__front">
                        <div className="title">FIND BOOK BY</div>
                        <div className="buttons">
                            <button className="button" onClick={() => handleFlip("Author")}>Author</button>
                            <button className="button" onClick={() => handleFlip("Title")}>Title</button>
                            <button className="button" onClick={() => handleFlip("Content")}>Content</button>
                            <button className="button" onClick={() => handleFlip("Topic")}>Topic</button>
                        </div>
                    </div>
                    <div className="flip-card__back">
                        <div className="title">FIND BOOK BY {searchType}</div>
                        <form className="flip-card__form" action="">
                            {searchType === "Author" || searchType === "Title" ? (
                                <input
                                    className="flip-card__input"
                                    placeholder={`Enter ${searchType}`}
                                    type="text"
                                />
                            ) : (
                                <textarea
                                    className="flip-card__input"
                                    placeholder={`Enter ${searchType}`}
                                    rows={4}
                                />
                            )}
                            <button className="flip-card__btn">Let's go!</button>
                            <button onClick={() => handleFlip("", "")} className="flip-card__btn">Choose other</button>
                        </form>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    height: 100vh;
    
    .button {
        font-family: Broadleaf;
        border-radius: 10px;
        border: 2px solid #323232;
        padding: 10px;
        width: 200px;
        font-size: 17px;
    }

    .flip-card {
        width: 300px;
        height: 350px;
        perspective: 1000px;
    }

    .flip-card__inner {
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 0.8s;
        transform-style: preserve-3d;
    }

    .flipped {
        transform: rotateY(180deg);
    }

    .flip-card__front, .flip-card__back {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backface-visibility: hidden;
        background-color: white;
        border-radius: 5px;
        border: 2px solid #323232;
        box-shadow: 4px 4px #323232;
        padding: 20px;
    }

    .flip-card__back {
        transform: rotateY(180deg);
    }

    .buttons {
        display: flex;
        flex-flow: column wrap;
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    .flip-card__form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .flip-card__input {
        width: 250px;
        height: 60px;
        border-radius: 5px;
        border: 2px solid #323232;
        padding: 5px 10px;
        font-size: 15px;
    }

    .flip-card__btn {
        width: 120px;
        height: 40px;
        border-radius: 5px;
        border: 2px solid #323232;
        cursor: pointer;
    }

    .title {
        font-size: 25px;
        font-weight: bold;
        margin-bottom: 20px;
    }
`;

export default Form;
