import { Layout} from "antd";
import {Header} from "../components/header.tsx";
import BookList from "../components/bookList.tsx";
import {useStore} from "../Store/StoreContext.tsx";
import React from "react";
import {observer} from "mobx-react-lite";

const { Content} = Layout;

// const collectionStore = {
//     books: [
//         {
//             id: 1,
//             title: "1984",
//             author: "George Orwell",
//             description: "A dystopian novel set in a totalitarian society under constant surveillance."
//         },
//         {
//             id: 2,
//             title: "To Kill a Mockingbird",
//             author: "Harper Lee",
//             description: "A novel about the serious issues of rape and racial inequality, narrated by a young girl."
//         },
//         {
//             id: 3,
//             title: "Pride and Prejudice",
//             author: "Jane Austen",
//             description: "A romantic novel that critiques the British landed gentry at the end of the 18th century."
//         },
//         {
//             id: 4,
//             title: "The Great Gatsby",
//             author: "F. Scott Fitzgerald",
//             description: "A story of the American dream and the moral decay of society in the 1920s."
//         },
//         {
//             id: 5,
//             title: "Moby-Dick",
//             author: "Herman Melville",
//             description: "An epic tale of obsession and revenge, centered around the pursuit of a giant whale."
//         },
//         {
//             id: 6,
//             title: "War and Peace",
//             author: "Leo Tolstoy",
//             description: "A historical novel that intertwines the lives of several families during the Napoleonic Wars."
//         }
//     ]
// };
//


const BooksPage: React.FC = observer(() => {
    const { booksStore } = useStore();

    if (booksStore.isLoading) {
        return <div>Loading...</div>;
    }

    if (booksStore.error) {
        return <div>Error: {booksStore.error}</div>;
    }

    if (!booksStore.books) {
        return <div>No book found</div>;
    }

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header/>
            <Content style={{ padding: "0 48px", marginTop: "90px" }}>
                <div style={{ minHeight: 280, padding: 24, borderRadius: 10 }}>
                    <BookList books={booksStore.books}/>
                </div>
            </Content>
        </Layout>
    )
}
)

export default BooksPage;
