import {Layout} from "antd";
import {Header} from "../components/header.tsx";
import BookList from "../components/bookList.tsx";
import {useStore} from "../Store/StoreContext.tsx";
import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import Loader from "../components/loader.tsx";
import collectionsStore from "../Store/CollectionsStore.ts";

const { Content} = Layout;

const RecommendationsPage: React.FC = observer(() => {
    const { booksStore } = useStore();
    const [err, setErr] = useState("");

    useEffect(() => {
        try {
            booksStore.fetchBooksByRecommendations();
            console.log("Collections after fetch:", booksStore.books);
        }
        catch {
            setErr(err);
        }


    }, [booksStore]);

    if (booksStore.isLoading) {
        return (
            <Layout style={{minHeight: "100vh"}}>
                <Header/>
                <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader/>
                </Content>
            </Layout>
        )
    }

    if (booksStore.error || collectionsStore.collections.length == 0) {
        return (
            <Layout style={{minHeight: "100vh", padding: "48px", backgroundColor: "#FFF9F0"}}>
                <Header/>
                    <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", border: "1px solid black", backgroundColor: "white", textAlign: "center" }}>
                        <p>Почему-то мы не смогли найти рекомендации для вас. Возможно, вы ещё не оставили отзывов на книги и мы не знаем
                            что вам нравится, или наша библиотекарша потерялась и не может найти книги. Попробуйте позже, мы верим что всё получится</p>
                    </Content>
            </Layout>
        )
    }


    return (
        <Layout style={{minHeight: "100vh",  backgroundColor: "#FFF9F0"}}>
            <Header/>
                <Content style={{ padding: "0 48px", marginTop: "90px" }}>
                <div style={{ minHeight: 280, padding: 24, borderRadius: 10 }}>
                    <BookList books={booksStore.books}/>
                </div>
            </Content>
        </Layout>
)
})

export default RecommendationsPage
