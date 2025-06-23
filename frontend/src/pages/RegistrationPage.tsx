import {Layout} from "antd";
import {Header} from "../components/header.tsx";
import FormToRegister from "../components/formToRegister.tsx";
import {Content} from "antd/es/layout/layout";


const AuthorizationPage = () => {
    return (
        <Layout style={{minHeight: "100vh", padding: "100px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF9F0"}}>
            <Header/>
            <Content>
                <FormToRegister/>
            </Content>
        </Layout>
    );
};

export default AuthorizationPage;
