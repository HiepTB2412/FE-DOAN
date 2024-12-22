/** @format */

import { useDispatch, useSelector } from "react-redux";
import { addAuth, authSeletor, AuthState } from "../redux/reducers/authReducer";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { useEffect, useState } from "react";
import { localDataNames } from "../constants/appInfos";
import { message, Spin } from "antd";

const Routers = () => {
  const [isLoading, setIsLoading] = useState(true);

  const auth: AuthState = useSelector(authSeletor);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = localStorage.getItem(localDataNames.authData);
      res && dispatch(addAuth(JSON.parse(res)));
    } catch (error: any) {
      message.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Spin />
  ) : !auth.accessToken ? (
    <AuthRouter />
  ) : (
    <MainRouter />
  );
};

export default Routers;
