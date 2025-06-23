import {Layout} from "antd";
import {Header} from "../components/header.tsx";
import {Content} from "antd/es/layout/layout";
import FormToAuthorize from "../components/formToAuthorize.tsx";


const AuthorizationPage = () => {
    return (
        <Layout style={{minHeight: "100vh", padding: "100px", alignItems: "center", justifyContent: "center", display: "flex", backgroundColor: "#FFF9F0"}}>
            <Header/>
            <Content>
                <FormToAuthorize/>
            </Content>
        </Layout>
    );
};

export default AuthorizationPage;
