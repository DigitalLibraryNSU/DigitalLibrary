import { Header } from "../components/header.tsx";
import { Layout } from "antd";
import "../styles/MainPageStyles.css";
import BlackCollectionCard from "../components/blackCollectionCard.tsx";
import { ArrowRightOutlined } from '@ant-design/icons';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../Store/StoreContext.tsx";
import Loader from "../components/loader.tsx";

interface Collection {
    name: string;
    id: number;
    description: string;
    documentId: string;
}

export const MainPage: React.FC = observer(() => {
    const { collectionsStore } = useStore();
    const [randomCollections, setRandomCollections] = useState<Collection[]>([]);

    useEffect(() => {
        collectionsStore.fetchCollections();
    }, [collectionsStore]);

    useEffect(() => {
        if (!collectionsStore.isLoading && collectionsStore.collections.length > 0) {
            const shuffledCollections = [...collectionsStore.collections].sort(() => 0.5 - Math.random());
            const selectedCollections = shuffledCollections.slice(0, 3);
            setRandomCollections(selectedCollections);
        }
    }, [collectionsStore.isLoading, collectionsStore.collections]);

    if (collectionsStore.isLoading) return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <div className="container">
                <div className="texts">
                    <span className="title">Жили-Были Library</span>
                    <div className="text">Наша онлайн библиотека помогает пользователям легко находить любимые книги и открывать новые литературные произведения.
                        С помощью удобного интерфейса вы можете искать книги по автору, названию, теме или отрывку.
                        Откройте для себя мир книг с нашей библиотекой!</div>
                </div>
                <Loader/>
            </div>
        </Layout>
    );
    if (collectionsStore.error || collectionsStore.collections.length === 0) return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <div className="container">
                <div className="texts">
                    <span className="title">Жили-Были Library</span>
                    <div className="text">Наша онлайн библиотека помогает пользователям легко находить любимые книги и открывать новые литературные произведения.
                        С помощью удобного интерфейса вы можете искать книги по автору, названию, теме или отрывку.
                        Откройте для себя мир книг с нашей библиотекой!</div>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
            <div className="container">
                <div className="texts">
                    <span className="title">Жили-Были Library</span>
                    <div className="text">Наша онлайн библиотека помогает пользователям легко находить любимые книги и открывать новые литературные произведения.
                        С помощью удобного интерфейса вы можете искать книги по автору, названию, теме или отрывку.
                        Откройте для себя мир книг с нашей библиотекой!</div>
                    <div className="bottom">
                        <div className="text-bottom">Возможно вам понравятся эти коллекции <ArrowRightOutlined className="arrow-right" /></div>

                    </div>
                </div>
                <div className="cards">
                    {randomCollections.map((collection: Collection) => (
                            <BlackCollectionCard
                                key={collection.id}
                                title={collection.name}
                                description={collection.description}
                                collectionId={collection.documentId}
                            />
                    ))}
                </div>
            </div>
        </Layout>
    );
});
