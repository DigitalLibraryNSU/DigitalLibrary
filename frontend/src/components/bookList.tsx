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
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {books.map((book) => (
                <Col span={8}
                     key={book.id}
                     style={{marginTop: "20px", minWidth: "250px"}}>
                    <BookCard name={book.name}
                              description={book.description}
                              author={book.author}
                              bookId={book.documentId}
                              img = {book.image}/>
                </Col>
            ))}
        </Row>
    )
}


export default BookList;
