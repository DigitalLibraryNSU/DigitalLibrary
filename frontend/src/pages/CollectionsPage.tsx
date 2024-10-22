import { observer } from "mobx-react-lite";
import { Col, Layout, Row } from "antd";
import { Header } from "../components/header.tsx";
import WhiteCollectionCard from "../components/whiteCollectionCard.tsx";
import BlackCollectionCard from "../components/blackCollectionCard.tsx";
import { useStore } from "../Store/StoreContext.tsx";
import { useEffect } from "react";

const { Content } = Layout;

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
            <Content style={{ padding: "0 48px", marginTop: "90px" }}>
                <div style={{ minHeight: 280, padding: 24, borderRadius: 10 }}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        {collectionsStore.collections.map((collection: Collection) => (
                            <Col
                                xs={24}
                                sm={24}
                                md={12}
                                lg={8}
                                key={collection.id}
                                style={{ marginTop: "20px", marginBottom: "10px" }}
                            >
                                {(collection.id / 2) % 2 === 0 ? (
                                    <BlackCollectionCard title={collection.name} description={collection.description} collectionId={collection.documentId} />
                                ) : (
                                    <WhiteCollectionCard title={collection.name} description={collection.description} collectionId={collection.documentId} />
                                )}
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>
        </Layout>
    );
});

export default CollectionsPage;
