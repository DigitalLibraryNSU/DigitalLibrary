import React, {useCallback, useEffect} from "react";
import styled from "styled-components";
import { Header } from "../components/header";
import { useParams } from "react-router-dom";
import { useStore } from "../Store/StoreContext";
import { observer } from "mobx-react-lite";

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
            link.download = bookStore.book.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file.');
        }
    }, [bookStore.book?.documentUrl, bookStore.book?.name]);  // Следим за изменениями URL и имени документа

    if (bookStore.isLoading) {
        return <div>Loading...</div>;
    }

    if (bookStore.error) {
        return <div>Error: {bookStore.error}</div>;
    }

    if (!bookStore.book) {
        return <div>No book found</div>;
    }

    return (
        <StyledBookPage>
            <Header />
            <div className="book-container">
                <div className="book-image">
                    <img src={bookStore.book.image} alt={bookStore.book.name} />
                </div>
                <div className="book-details">
                    <h1 className="book-title">{bookStore.book.name}</h1>
                    <h3 className="book-author">By {bookStore.book.author}</h3>
                    <p className="book-description">{bookStore.book.description}</p>
                    <button className="book-download" onClick={downloadFile}>
                        Download book
                    </button>
                </div>
            </div>
        </StyledBookPage>
    );
});


const StyledBookPage = styled.div`
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;

    .book-container {
        margin-top: 90px;
        display: flex;
        flex-direction: row;
        background: white;
        padding: 40px;
        border-radius: 10px;
        border: black solid 1px;
        min-height: 80vh;
        width: 100%;
    }

    .book-image {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
    }

    .book-image img {
        max-width: 100%;
        height: auto;
        //border-radius: 10px;
        //box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    .book-details {
        font-family: Broadleaf;
        flex: 2;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .book-title {
        font-family: Newake;
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
    }

    .book-author {
        font-family: Broadleaf;
        font-size: 20px;
        font-weight: normal;
        margin-bottom: 20px;
        color: #777;
    }

    .book-description {
        font-family: Broadleaf;
        font-size: 16px;
        line-height: 1.6;
        color: #555;
    }

    /* Адаптивность для планшетов */
    @media (max-width: 768px) {
        .book-container {
            flex-direction: column;
            align-items: center;
        }

        .book-image {
            margin-bottom: 20px;
            margin-right: 0;
        }

        .book-title {
            font-size: 28px;
            text-align: center;
        }

        .book-author {
            font-size: 18px;
            text-align: center;
        }

        .book-description {
            font-size: 15px;
            text-align: center;
        }
    }

    .book-download {
        margin-top: 40px;
        color: white;
        background: black;
        height: 40px;
        width: 130px;
        border-radius: 10px;
    }
    
    @media (max-width: 576px) {
        .book-container {
            padding: 15px;
        }

        .book-title {
            font-size: 24px;
        }

        .book-author {
            font-size: 16px;
        }

        .book-description {
            font-size: 14px;
        }
    }
`;

export default BookPage;
