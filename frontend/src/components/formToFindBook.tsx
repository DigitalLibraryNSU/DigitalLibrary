import {useCallback, useState} from 'react';
import { useStore } from "../Store/StoreContext.tsx";
import { useNavigate } from "react-router-dom";
import "../styles/formToFindBook.css";

const FormToFindBook = () => {
    const [activeField, setActiveField] = useState('');
    const [inputValue, setInputValue] = useState('');
    const { booksStore } = useStore();
    const navigate = useNavigate();

    const handleButtonClick = useCallback((field: string) => () => {
        setActiveField(field);
        setInputValue('');
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    }, []);

    const handleFindClick = useCallback(() => {
        if (!activeField || !inputValue.trim()) return;

        const searchMethods = {
            'Author': () => booksStore.fetchBooksByAuthor(inputValue),
            'Title': () => booksStore.fetchBooksByTitle(inputValue),
            'Topic': () => booksStore.fetchBooksByTopic(inputValue),
            'Content': () => booksStore.fetchBooksByContent(inputValue)
        };

        searchMethods[activeField as keyof typeof searchMethods]();
        navigate("/smart_search/books");
    }, [inputValue, activeField]);

    return (
        <div className="find-container">
            <div className="find-card">
                <div className="find-card__ornament-top"></div>

                <div className="find-card__content">
                    <h2 className="find-card__title">Поиск книг</h2>
                    <p className="find-card__subtitle">Я знаю у книги:</p>

                    <div className="find-card__options">
                        <button
                            className={`find-card__option ${activeField === 'Author' ? 'active' : ''}`}
                            onClick={handleButtonClick('Author')}
                        >
                            Автор
                        </button>
                        <button
                            className={`find-card__option ${activeField === 'Title' ? 'active' : ''}`}
                            onClick={handleButtonClick('Title')}
                        >
                            Название
                        </button>
                        <button
                            className={`find-card__option ${activeField === 'Topic' ? 'active' : ''}`}
                            onClick={handleButtonClick('Topic')}
                        >
                            Тема
                        </button>
                        <button
                            className={`find-card__option ${activeField === 'Content' ? 'active' : ''}`}
                            onClick={handleButtonClick('Content')}
                        >
                            Отрывок текста
                        </button>
                    </div>

                    {activeField && (
                        <div className="find-card__search-area">
                            <textarea
                                placeholder={`Введите ${activeField === 'Author' ? 'имя автора' :
                                    activeField === 'Title' ? 'название книги' :
                                        activeField === 'Topic' ? 'тему' : 'отрывок текста'}`}
                                value={inputValue}
                                onChange={handleInputChange}
                                className="find-card__input"
                                rows={4}
                            />
                            <button
                                className="find-card__submit"
                                onClick={handleFindClick}
                                disabled={!inputValue.trim()}
                            >
                                Найти
                            </button>
                        </div>
                    )}
                </div>

                <div className="find-card__ornament-bottom"></div>
            </div>
        </div>
    );
};

export default FormToFindBook;
