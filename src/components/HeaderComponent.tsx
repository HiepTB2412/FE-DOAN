import { Avatar, Dropdown, MenuProps, Space, Typography } from "antd";
import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserModel } from "../models/UserModel";
import handleAPI from "../apis/handleAPI";

const { Text } = Typography;

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserModel>();

  const handleLogout = () => {
    dispatch(removeAuth({}));
    localStorage.clear();
    navigate("/");
  };

  const handleUserDetail = () => {
    navigate("/user/detail");
  };

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Log Out",
      onClick: handleLogout,
    },
    {
      key: "userDetail",
      label: "User detail",
      onClick: handleUserDetail,
    },
  ];

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const api = "/users/info";
    try {
      const res: any = await handleAPI(api);
      if (res.data) {
        setUser(res.data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-white p-2">
      <div className="col text-end">
        <Space>
          <div className="row">
            <Text>{user?.fullName}</Text>
            <Text>Department {user?.department}</Text>
          </div>
          <Dropdown menu={{ items }}>
            <Avatar
              src={
                "https://cdn.oneesports.vn/cdn-data/sites/4/2022/02/hinh-nen-Luffy-2K-chat-ngau.jpg"
              }
              size={40}
            />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default HeaderComponent;
