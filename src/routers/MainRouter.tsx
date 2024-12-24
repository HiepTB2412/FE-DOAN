import { Affix, Layout, Spin } from "antd";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SiderComponent from "../components/SiderComponent";
import HeaderComponent from "../components/HeaderComponent";
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
import FooterComponent from "../components/FooterComponent";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";

const { Content } = Layout;

const MainRouter = () => {
  const auth: AuthState = useSelector(authSeletor);
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
        <SiderComponent />
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
              <Route path="/job" element={<Job />} />
              <Route path="/candidate" element={<Candidate />} />
              <Route path="/job/:id" element={<JobDetail />} />

              {/* Restrict access for role 3 */}
              <Route
                path="/interview"
                element={
                  auth.role === 3 ? (
                    <Navigate to="/user/detail" replace />
                  ) : (
                    <Interview />
                  )
                }
              />
              <Route
                path="/offer"
                element={
                  auth.role === 3 ? (
                    <Navigate to="/user/detail" replace />
                  ) : (
                    <Offer />
                  )
                }
              />
              <Route
                path="/user"
                element={
                  auth.role === 3 ? (
                    <Navigate to="/user/detail" replace />
                  ) : (
                    <User onUpdateUserLogin={() => getUser()} />
                  )
                }
              />
              <Route path="/user/detail" element={<UserDetail user={user} />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>

      <FooterComponent />
    </BrowserRouter>
  );
};

export default MainRouter;
