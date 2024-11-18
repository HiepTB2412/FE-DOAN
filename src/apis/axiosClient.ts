import axios from "axios";
import queryString from "query-string";
import { localDataNames } from "../constants/appInfos";
import { syncLocal } from "../redux/reducers/authReducer";

export const baseURL = `https://imsbackend-production.up.railway.app/api/v1`;

const axiosClient = axios.create({
  baseURL: baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});

const getAccessToken = () => {
  const res = localStorage.getItem(localDataNames.authData);

  if (res) {
    const auth = JSON.parse(res);
    return auth && auth.accessToken ? auth.accessToken : "";
  } else {
    return "";
  }
};

const getrefreshToken = () => {
  const res = localStorage.getItem(localDataNames.authData);

  if (res) {
    const auth = JSON.parse(res);
    return auth && auth.refreshToken ? auth.refreshToken : "";
  } else {
    return "";
  }
};

axiosClient.interceptors.request.use(async (config: any) => {
  const accessToken = getAccessToken();

  config.headers = {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    Accept: "application/json",
    ...config.headers,
  };

  return { ...config, data: config.data ?? null };
});

axiosClient.interceptors.response.use(
  (res) => {
    if (res.data && res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      return Promise.reject(res.data);
    }
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response.status === 401 || error.response.status === 403) {
      try {
        const refreshToken = getrefreshToken();
        const result = await axios.post(
          `https://imsbackend-production.up.railway.app/api/v1/auth/refresh`,
          {
            refreshToken: refreshToken,
          }
        );
        syncLocal(result.data.data);
        originalConfig.headers[
          "Authorization"
        ] = `Bearer ${result.data.data.accessToken}`;

        return axiosClient(originalConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
);

export default axiosClient;
