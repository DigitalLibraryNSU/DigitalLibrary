import {Layout} from "antd";
import {Header} from "../components/header.tsx";
import {Content} from "antd/es/layout/layout";
import Form from "../components/formToFindBook.tsx";
import * as React from "react";

const SearchPage: React.FC = () => {
    return (
        <Layout style={{height: "100vh", padding: "100px", alignItems: "center", backgroundColor: "#FFF9F0"}}>
        <Header/>
            <Content>
                <Form/>
            </Content>
    </Layout>
    )
}

export default SearchPage
