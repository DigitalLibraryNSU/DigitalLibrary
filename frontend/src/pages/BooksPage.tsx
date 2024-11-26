import { Layout} from "antd";
import {Header} from "../components/header.tsx";
import BookList from "../components/bookList.tsx";
import {useStore} from "../Store/StoreContext.tsx";
import React from "react";
import {observer} from "mobx-react-lite";

const { Content} = Layout;

const BooksPage: React.FC = observer(() => {
    const { booksStore } = useStore();

    if (booksStore.isLoading) return <div>Loading...</div>;

    if (booksStore.error) return <div>Error: {booksStore.error}</div>;

    if (!booksStore.books) return <div>No book found</div>;

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
