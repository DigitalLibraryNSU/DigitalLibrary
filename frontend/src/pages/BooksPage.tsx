import { Layout} from "antd";
import {Header} from "../components/header.tsx";
import BookList from "../components/bookList.tsx";
import {useStore} from "../Store/StoreContext.tsx";
import React from "react";
import {observer} from "mobx-react-lite";
import Loader from "../components/loader.tsx";

const { Content} = Layout;

const BooksPage: React.FC = observer(() => {
    const { booksStore } = useStore();

    if (booksStore.isLoading) return (
        <Layout style={{minHeight: "100vh"}}>
            <Header/>
            <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader/>
            </Content>
        </Layout>
    );

    if (booksStore.error || booksStore.books.length == 0) return (
        <Layout style={{minHeight: "100vh"}}>
            <Header/>
            <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center"  }}>
                <h1>Упс, мы не нашли книжки, попробуйте ещё раз</h1>
            </Content>
        </Layout>
    );


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
