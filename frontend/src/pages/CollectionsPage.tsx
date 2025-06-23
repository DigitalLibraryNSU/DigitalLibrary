import { observer } from "mobx-react-lite";
import { Layout} from "antd";
import { Header } from "../components/header.tsx";
import WhiteCollectionCard from "../components/whiteCollectionCard.tsx";
import BlackCollectionCard from "../components/blackCollectionCard.tsx";
import { useStore } from "../Store/StoreContext.tsx";
import React, { useEffect } from "react";
import Loader from "../components/loader.tsx";
import {Content} from "antd/es/layout/layout";

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

    if (collectionsStore.isLoading) return (
        <Layout style={{minHeight: "100vh", backgroundColor: "#FFF9F0"}}>
            <Header/>
            <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader/>
            </Content>
        </Layout>
    );
    if (collectionsStore.error || collectionsStore.collections.length == 0) return(
        <Layout style={{minHeight: "100vh", backgroundColor: "#FFF9F0"}}>
            <Header/>
            <Content style={{ padding: "0 48px", marginTop: "90px", display: "flex", alignItems: "center", justifyContent: "center"  }}>
                <p>Мы не можем найти коллекции, попробуйте ещё раз</p>
            </Content>
        </Layout>
    );

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "#FFF9F0" }}>
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
                        justifyContent: "space-around",
                    }}
                >
                    {
                        collectionsStore.collections.map((collection: Collection, index: number) =>
                        index % 2 === 0 ? (
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
                    )

                    }
                </div>
        </Layout>
    );
});

export default CollectionsPage;
