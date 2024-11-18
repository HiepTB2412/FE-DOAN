import { Affix, Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiderComponent from "../components/SiderComponent";
import HeaderComponent from "../components/HeaderComponent";
import HomeScreen from "../screens/HomeScreen";
import User from "../screens/User";
import UserDetail from "../screens/UserDetail";

const { Content, Footer } = Layout;

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout
          style={{
            backgroundColor: "white !important",
          }}
        >
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className="pt-3 container-fluid">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/user" element={<User />} />
              <Route path="/user/detail" element={<UserDetail />} />
            </Routes>
          </Content>
          <Footer className="bg-white" />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
