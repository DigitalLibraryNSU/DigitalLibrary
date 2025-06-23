import React, { useState } from "react";
import BookCard from "./BookCard.tsx";
import { Select } from 'antd';

const { Option } = Select;

interface Book {
    id: string;
    documentId: string;
    name: string;
    description: string;
    author: string;
    image: string;
    documentName: string;
    documentMime: string;
    documentUrl: string;
    average_rating?: number;
    reviews_count?: number;
    score?: number;
}

interface BookListProps {
    books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
    const [sortOption, setSortOption] = useState<string>('default');

    // Функции сортировки
    const sortFunctions = {
        default: (a: Book, b: Book) => 0,
        title_asc: (a: Book, b: Book) => (a.name || '').localeCompare(b.name || ''),
        title_desc: (a: Book, b: Book) => b.name.localeCompare(a.name),
        author_asc: (a: Book, b: Book) => (a.author || '').localeCompare(b.author || ''),
        author_desc: (a: Book, b: Book) => (b.author || '').localeCompare(a.author || ''),
        rating: (a: Book, b: Book) => (b.average_rating || 0) - (a.average_rating || 0),
        popularity: (a: Book, b: Book) => (b.reviews_count || 0) - (a.reviews_count || 0),
        score: (a: Book, b: Book) => (b.score || 0) - (a.score || 0),
    };

    const sortedBooks = [...books].sort(sortFunctions[sortOption as keyof typeof sortFunctions]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '20px',
                alignItems: 'center'
            }}>
                <span style={{ marginRight: '10px', fontFamily: 'PT Sans', color: '#5A3E36' }}>Сортировать по:</span>
                <Select
                    defaultValue="default"
                    style={{ width: 200 }}
                    onChange={(value) => setSortOption(value)}
                    className="book-sorter"
                >
                    <Option value="default">По умолчанию</Option>
                    <Option value="title_asc">Названию (А-Я)</Option>
                    <Option value="title_desc">Названию (Я-А)</Option>
                    <Option value="author_asc">Автору (А-Я)</Option>
                    <Option value="author_desc">Автору (Я-А)</Option>
                    <Option value="rating">Рейтингу</Option>
                    <Option value="popularity">Количеству отзывов</Option>
                    <Option value="score">Популярности</Option>
                </Select>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "25px"
            }}>
                {sortedBooks.map((book) => (
                    <BookCard
                        key={book.id}
                        name={book.name}
                        description={book.description}
                        author={book.author}
                        bookId={book.documentId}
                        img={book.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookList;
