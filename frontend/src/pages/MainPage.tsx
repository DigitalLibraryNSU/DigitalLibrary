import { Header } from "../components/header.tsx";
import { Layout } from "antd";
import "../styles/MainPageStyles.css";
import BlackCollectionCard from "../components/blackCollectionCard.tsx";
import { ArrowRightOutlined } from '@ant-design/icons';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../Store/StoreContext.tsx";

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

    if (collectionsStore.isLoading) return <div>Loading...</div>;
    if (collectionsStore.error) return <div>Error: {collectionsStore.error}</div>;

    return (
        <Layout>
            <Header />
            <div className="container">
                <div className="texts">
                    <span className="title">DIGITAL LIBRARY</span>
                    <div className="text">Our library can help you to find the book you need. You can use our search by title, author or theme</div>
                    <div className="bottom">
                        <div className="text">You may like these collections</div>
                        <ArrowRightOutlined className="arrow-right" />
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
