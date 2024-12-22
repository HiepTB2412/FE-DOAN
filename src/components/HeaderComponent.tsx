import { Avatar, Dropdown, MenuProps, Space, Typography } from "antd";
import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../models/UserModel";

const { Text } = Typography;

interface Props {
  user?: UserModel;
}

const HeaderComponent = (props: Props) => {
  const { user } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <div className="bg-white p-2">
      <div className="col text-end">
        <Space>
          <div className="row">
            <Text>{user?.fullName}</Text>
            <Text>Department: {user?.department}</Text>
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
