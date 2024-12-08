import {Col, Row} from "antd";
import BookCard from "./BookCard.tsx";

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
}

interface BookListProps {
    books: Book[];
}

const BookList: React.FC<BookListProps> = ({books}) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }}>
            {books.map((book) => (
                    <BookCard name={book.name}
                              description={book.description}
                              author={book.author}
                              bookId={book.documentId}
                              img = {book.image}/>
            ))}
        </div>
    )
}


export default BookList;
