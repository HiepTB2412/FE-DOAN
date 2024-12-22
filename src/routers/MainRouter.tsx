import { Affix, Layout, Spin } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiderComponent from "../components/SiderComponent";
import HeaderComponent from "../components/HeaderComponent";
import HomeScreen from "../screens/HomeScreen";
import User from "../screens/User";
import UserDetail from "../screens/UserDetail";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { UserModel } from "../models/UserModel";
import Interview from "../screens/Interview";
import Job from "../screens/Job";
import JobDetail from "../screens/JobDetail";
import Candidate from "../screens/Candidate";
import Offer from "../screens/Offer";

const { Content, Footer } = Layout;

const MainRouter = () => {
  const [user, setUser] = useState<UserModel>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const api = "/users/info";
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api);
      if (res.data) {
        setUser(res.data);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading === true) {
    return <Spin />;
  }

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
            <HeaderComponent user={user} />
          </Affix>
          <Content className="pt-3 container-fluid">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/job" element={<Job />} />
              <Route path="/candidate" element={<Candidate />} />
              <Route path="/offer" element={<Offer />} />
              <Route
                path="/user"
                element={<User onUpdateUserLogin={() => getUser()} />}
              />
              <Route path="/user/detail" element={<UserDetail user={user} />} />
              <Route path="/job/:id" element={<JobDetail />} />
            </Routes>
          </Content>
          <Footer className="bg-white" />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
