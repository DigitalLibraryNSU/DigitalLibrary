import { useState } from 'react';
import { useStore } from "../Store/StoreContext.tsx";
import { useNavigate } from "react-router-dom";

const Form = () => {
    // Состояние для хранения выбранной кнопки и введенного текста
    const [activeField, setActiveField] = useState('');
    const [inputValue, setInputValue] = useState('');
    const { booksStore } = useStore();

    const titleStyle = {
        fontSize: "25px",
        fontWeight: 'bold',
        marginBottom: "20px",
        fontFamily: "Newake"
    };

    const buttonStyle = {
        fontFamily: "Broadleaf",
        borderRadius: "10px",
        border: "2px solid #323232",
        padding: "10px",
        width: "200px",
        fontSize: "17px",
        marginBottom: "10px",
    };

    const findButtonStyle = {
        fontFamily: "Broadleaf",
        borderRadius: "10px",
        border: "2px solid white",
        backgroundColor: "black",
        padding: "10px",
        width: "200px",
        fontSize: "17px",
        marginBottom: "10px",
        color: "white",
    };

    const buttonsStyle = {
        display: "flex",
        flexFlow: "column wrap",
        justifyContent: 'center',
        alignItems: 'center',
    };

    // Обработчик нажатия на кнопку
    const handleButtonClick = (field: string) => {
        setActiveField(field);
        setInputValue(''); // Очистить поле ввода при смене кнопки
    };

    const navigate = useNavigate();

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleFindClick = () => {
        console.log(`Searching for ${activeField}: ${inputValue}`);

        // Вызов соответствующего метода в зависимости от выбранного поля
        if (activeField === 'Author') {
            booksStore.fetchBooksByAuthor(inputValue);
        } else if (activeField === 'Title') {
            booksStore.fetchBooksByTitle(inputValue);
        } else if (activeField === 'Topic') {
            booksStore.fetchBooksByTopic(inputValue);
        } else if (activeField === 'Content') {
            booksStore.fetchBooksByContent(inputValue);
        }

        // Навигация после поиска
        navigate("/smart_search/books");
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid #323232',
        }}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', textAlign: 'center' }}>
                <h3 style={titleStyle}>Find by:</h3>
                <div style={buttonsStyle}>
                    <button style={buttonStyle}
                            onClick={() => handleButtonClick('Author')}>Author</button>
                    <button style={buttonStyle}
                            onClick={() => handleButtonClick('Title')}>Title</button>
                    <button style={buttonStyle}
                            onClick={() => handleButtonClick('Topic')}>Topic</button>
                    <button style={buttonStyle}
                            onClick={() => handleButtonClick('Content')}>Content</button>
                </div>

                {/* Поле для ввода текста и кнопка FIND */}
                {activeField && (
                    <div style={{ marginTop: '20px', display: "flex", flexFlow: "column wrap", alignItems: "center" }}>
                        <textarea
                            placeholder={`Enter ${activeField}`}
                            value={inputValue}
                            onChange={handleInputChange}
                            style={{ width: '200px', height: '80px', marginBottom: '20px' }}
                        />
                        <button style={findButtonStyle} onClick={handleFindClick}>
                            FIND
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;
