import {Layout} from "antd";
import {Header} from "../components/header.tsx";
import BookList from "../components/bookList.tsx";
import {useParams} from "react-router-dom";
import {useStore} from "../Store/StoreContext.tsx";
import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import Loader from "../components/loader.tsx";
import collectionsStore from "../Store/CollectionsStore.ts";

const { Content} = Layout;

const CollectionPage: React.FC = observer(() => {
    const { collectionId } = useParams<{ collectionId: any }>();
    const { booksStore } = useStore();

    useEffect(() => {
        booksStore.fetchBooksByCollection(collectionId);
        console.log("Collections after fetch:", booksStore.books);
    }, [booksStore]);

    if (booksStore.isLoading) {
        return (
            <Layout style={{minHeight: "100vh", backgroundColor: "#FFF9F0"}}>
                <Header/>
                <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader/>
                </Content>
            </Layout>
        )
    }

    if (booksStore.error || collectionsStore.collections.length == 0) {
        return (
            <Layout style={{minHeight: "100vh", backgroundColor: "#FFF9F0"}}>
                <Header/>
                <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p>Ой, мы не смогли найти книжки, библиотекарша потерялась</p>
                </Content>
            </Layout>
        )
    }


    return (
        <Layout style={{minHeight: "100vh", backgroundColor: "#FFF9F0"}}>
            <Header/>
            <Content style={{ padding: "0 48px", marginTop: "90px" }}>
                <div style={{ minHeight: 280, padding: 24, borderRadius: 10 }}>
                    <BookList books={booksStore.books}/>
                </div>
            </Content>
        </Layout>
    )
})

export default CollectionPage
