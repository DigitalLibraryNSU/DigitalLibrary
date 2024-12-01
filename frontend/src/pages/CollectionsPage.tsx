import { observer } from "mobx-react-lite";
import { Layout} from "antd";
import { Header } from "../components/header.tsx";
import WhiteCollectionCard from "../components/whiteCollectionCard.tsx";
import BlackCollectionCard from "../components/blackCollectionCard.tsx";
import { useStore } from "../Store/StoreContext.tsx";
import { useEffect } from "react";

interface Collection {
    name: string;
    id: number;
    description: string;
    documentId: string;
}

const CollectionsPage: React.FC = observer(() => {
    const { collectionsStore } = useStore();

    useEffect(() => {
        collectionsStore.fetchCollections();
    }, [collectionsStore]);

    if (collectionsStore.isLoading) return <div>Loading...</div>;
    if (collectionsStore.error) return <div>Error: {collectionsStore.error}</div>;

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header />
                <div
                    style={{
                        minHeight: 280,
                        marginRight: "40px",
                        marginLeft: "40px",
                        marginTop: "90px",
                        borderRadius: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {collectionsStore.collections.map((collection: Collection) =>
                        (collection.id / 2) % 2 === 0 ? (
                            <BlackCollectionCard
                                key={collection.documentId}
                                title={collection.name}
                                description={collection.description}
                                collectionId={collection.documentId}
                            />
                        ) : (
                            <WhiteCollectionCard
                                key={collection.documentId}
                                title={collection.name}
                                description={collection.description}
                                collectionId={collection.documentId}
                            />
                        )
                    )}
                </div>
        </Layout>
    );
});

export default CollectionsPage;
