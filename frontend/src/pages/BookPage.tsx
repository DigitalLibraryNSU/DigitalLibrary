import React, {useCallback, useEffect} from "react";
import styled from "styled-components";
import {Header} from "../components/header";
import {useParams} from "react-router-dom";
import {useStore} from "../Store/StoreContext";
import {observer} from "mobx-react-lite";
import {Layout} from "antd";
import Loader from "../components/loader.tsx";
import Reviews from "../components/Reviews";
import {Content} from "antd/es/layout/layout";

const BookPage: React.FC = observer(() => {
    const { bookId } = useParams<{ bookId: string }>();
    const { bookStore } = useStore();

    useEffect(() => {if (bookId) {bookStore.fetchBook(bookId);}}, [bookId, bookStore]);

    const downloadFile = useCallback(async () => {
        if (!bookStore.book?.documentUrl) {
            alert("ou, we have problems");
            return;
        }
        try {
            const response = await fetch(bookStore.book.documentUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const fileData = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(fileData);
            link.download = `${bookStore.book.name}.epub`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file.');
        }
    }, [bookStore.book?.documentUrl]);

    // Функция для отображения рейтинга звездочками
    const renderRating = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Полные звезды
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star full-star">★</span>);
        }

        // Половина звезды
        if (hasHalfStar) {
            stars.push(<span key="half" className="star half-star">★</span>);
        }

        // Пустые звезды
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty-star">★</span>);
        }

        return (
            <div className="book-rating">
                {stars}
                <span className="rating-value">{rating.toFixed(1)}</span>
            </div>
        );
    };

    if (bookStore.isLoading) {
        return (
            <Layout style={{minHeight: "100vh", backgroundColor: "#FFF9F0"}}>
                <Header/>
                <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF9F0" }}>
                    <Loader/>
                </Content>
            </Layout>
        );
    }

    if (bookStore.error || !bookStore.book) {
        return(
            <Layout style={{minHeight: "100vh"}}>
                <Header/>
                <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF9F0"  }}>
                    <h1>Книжку съела собака, но вы можете попробовать открыть её ещё раз, может поможет</h1>
                </Content>
            </Layout>);
    }

    return (
        <StyledBookPage>
            <Header/>
            <div className="book-container-all">
                <div className="book-container small">
                    <div className="book-image">
                        <img src={bookStore.book.image} alt={bookStore.book.name}/>
                    </div>
                </div>
                <div className="book-container big">
                    <div className="book-details">
                        <h1 className="book-title">{bookStore.book.name}</h1>
                        <h3 className="book-author">By {bookStore.book.author}</h3>
                        {bookStore.book.average_rating && renderRating(bookStore.book.average_rating)}
                        <p className="book-description">{bookStore.book.description}</p>
                        <button className="book-download" onClick={downloadFile}>
                            Download book
                        </button>
                    </div>
                </div>
            </div>
            <div className="review-container">
                <h1 className="reviews-title">Отзывы</h1>
                <Reviews />
            </div>
        </StyledBookPage>
    );
});

const StyledBookPage = styled.div`
    min-height: 100vh;
    background-color: #FFF9F0;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 40px;

    .book-container-all {
        display: flex;
        gap: 40px;
        margin-top: 80px;

        @media (max-width: 768px) {
            flex-direction: column;
        }
    }

    .book-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        padding: 40px;

        &.small {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &.big {
            flex: 2;
        }
    }

    .book-image {
        width: 100%;
        max-width: 300px;

        img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
    }

    .book-details {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .book-title {
        font-family: 'RuslanDisplay', sans-serif;
        font-size: 42px;
        font-weight: 700;
        color: #3A3226;
        margin-bottom: 12px;
        line-height: 1.2;
    }

    .book-author {
        font-family: 'PT Sans', sans-serif;
        font-size: 18px;
        color: #5A3E36;
        margin-bottom: 24px;
        font-style: italic;
    }

    .book-description {
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #5A3E36;
        margin-bottom: 32px;
    }

    .book-download {
        background: #A52A2A;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        align-self: flex-start;
        margin-top: auto;

        &:hover {
            background: #8B0000;
            transform: translateY(-2px);
        }
    }

    /* Стили для рейтинга */
    .book-rating {
        margin: 10px 0 20px;
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .star {
        font-size: 20px;
        line-height: 1;
    }

    .full-star {
        color: #FFD700; /* Золотой цвет для заполненных звёзд */
    }

    .half-star {
        position: relative;
        color: #E0C9A6; /* Сначала показываем пустую звезду */
    }

    .half-star::before {
        content: '★';
        position: absolute;
        width: 50%;
        overflow: hidden;
        color: #FFD700; /* Закрашиваем левую половину */
    }

    .empty-star {
        color: #E0C9A6; /* Светлый цвет для пустых звёзд */
    }

    .rating-value {
        margin-left: 8px;
        font-family: 'PT Sans', sans-serif;
        font-size: 16px;
        color: #5A3E36;
    }

    .review-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        padding: 40px;
    }

    .reviews-title {
        font-size: 28px;
        color: #3A3226;
        margin-bottom: 24px;
        font-family: 'RuslanDisplay', sans-serif;
    }

    @media (max-width: 768px) {
        padding: 20px;

        .book-container {
            padding: 24px;
        }

        .book-title {
            font-size: 26px;
        }

        .book-author {
            font-size: 16px;
        }

        .book-description {
            font-size: 15px;
        }

        .star {
            font-size: 18px;
        }

        .rating-value {
            font-size: 14px;
        }
    }

    @media (max-width: 480px) {
        .book-container {
            padding: 20px;
        }

        .book-title {
            font-size: 22px;
        }

        .book-download {
            width: 100%;
        }

        .star {
            font-size: 16px;
        }
    }
`;

export default BookPage;
