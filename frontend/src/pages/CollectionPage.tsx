import {Layout} from "antd";
import {Header} from "../components/header.tsx";
import BookList from "../components/bookList.tsx";
import {useParams} from "react-router-dom";
import {useStore} from "../Store/StoreContext.tsx";
import {useEffect} from "react";
import {observer} from "mobx-react-lite";

const { Content} = Layout;

const CollectionPage: React.FC = observer(() => {
    const { collectionId } = useParams<{ collectionId: any }>();
    const { booksStore } = useStore();

    useEffect(() => {
        booksStore.fetchBooksByCollection(collectionId);
        console.log("Collections after fetch:", booksStore.books);
    }, [booksStore]);

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
})

export default CollectionPage
