import React, {useCallback, useEffect} from "react";
import styled from "styled-components";
import {Header} from "../components/header";
import {useParams} from "react-router-dom";
import {useStore} from "../Store/StoreContext";
import {observer} from "mobx-react-lite";
import {Layout} from "antd";
import Loader from "../components/loader.tsx";
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


    if (bookStore.isLoading) {
        return (
            <Layout style={{minHeight: "100vh"}}>
                <Header/>
                <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader/>
                </Content>
            </Layout>
        );
    }

    if (bookStore.error || !bookStore.book) {
        return(
        <Layout style={{minHeight: "100vh"}}>
            <Header/>
            <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center"  }}>
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
                        <p className="book-description">{bookStore.book.description}</p>
                        <button className="book-download" onClick={downloadFile}>
                        Download book
                        </button>
                    </div>
                </div>
            </div>
            <div className="review-container">
                <h1 className="book-title">Reviews</h1>
                <div style={{width: "350px", height: "200px", backgroundColor: "yellow"}}></div>
                <div style={{width: "350px", height: "200px", backgroundColor: "yellow"}}></div>
                <div style={{width: "350px", height: "200px", backgroundColor: "yellow"}}></div>
                <div style={{width: "350px", height: "200px", backgroundColor: "yellow"}}></div>
                <div style={{width: "350px", height: "200px", backgroundColor: "yellow"}}></div>
                <div style={{width: "350px", height: "200px", backgroundColor: "yellow"}}></div>
            </div>
        </StyledBookPage>
    );
});


const StyledBookPage = styled.div`
    font-family: Broadleaf;
    padding: 20px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
    gap: 30px;

    .book-container-all {
        display: flex;
        flex-direction: row;
        gap: 30px
    }

    .small {
        flex: 1;
    }

    .big {
        flex: 3;
    }
    .review-container {
        display: flex;
        flex-direction: column;
        background: white;
        padding: 40px;
        border-radius: 10px;
        border: black solid 1px;
        min-height: 70vh;
        width: 100%;
    }

    .book-container {
        margin-top: 80px;
        display: flex;
        flex-direction: row;
        background: white;
        padding: 50px;
        border-radius: 10px;
        border: black solid 1px;
        min-height: 70vh;
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
        align-self: center;
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







