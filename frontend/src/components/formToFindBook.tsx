import {useCallback, useState} from 'react';
import { useStore } from "../Store/StoreContext.tsx";
import { useNavigate } from "react-router-dom";
import "../styles/formToFindBook.css"


const Form = () => {
    const [activeField, setActiveField] = useState('');
    const [inputValue, setInputValue] = useState('');
    const { booksStore } = useStore();

    // Обработчик нажатия на кнопку
    const handleButtonClick = useCallback((field: string) => () => {
        setActiveField(field);
        setInputValue('');
    }, []);

    const navigate = useNavigate();

    const handleInputChange = useCallback((e: any) => {
        setInputValue(e.target.value);
    }, []);

    const handleFindClick = useCallback(() => {
        if (activeField === 'Author') {
            booksStore.fetchBooksByAuthor(inputValue);
        } else if (activeField === 'Title') {
            booksStore.fetchBooksByTitle(inputValue);
        } else if (activeField === 'Topic') {
            booksStore.fetchBooksByTopic(inputValue);
        } else if (activeField === 'Content') {
            booksStore.fetchBooksByContent(inputValue);
        }
        navigate("/smart_search/books");
    }, [inputValue]);

    return (
        <div className="find-card">
            <div className="find-card__start">
                <h3 className="find-card__header">Find by:</h3>
                <div className="find-card__buttons">
                    <button className="find-card__button"
                            onClick={handleButtonClick('Author')}>Author</button>
                    <button className="find-card__button"
                            onClick={handleButtonClick('Title')}>Title</button>
                    <button className="find-card__button"
                            onClick={handleButtonClick('Topic')}>Topic</button>
                    <button className="find-card__button"
                            onClick={handleButtonClick('Content')}>Content</button>
                </div>
                {activeField && (
                    <div className="find-card__open">
                        <textarea
                            placeholder={`Enter ${activeField}`}
                            value={inputValue}
                            onChange={handleInputChange}
                            className="find-card__input"
                        />
                        <button className="find-card__find-button"
                                onClick={handleFindClick}>
                            FIND
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;
