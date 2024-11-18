import { Layout, Menu, MenuProps, Typography } from "antd";
import { Link } from "react-router-dom";
import { colors } from "../constants/colors";
import { FiHome } from "react-icons/fi";
import { PiUsersThree } from "react-icons/pi";
import { IoBagRemoveOutline, IoNewspaperOutline } from "react-icons/io5";
import { RiWechatLine } from "react-icons/ri";
import { LiaUserCogSolid } from "react-icons/lia";
import { appInfo } from "../constants/appInfos";

const { Sider } = Layout;
const { Text } = Typography;
type MenuItem = Required<MenuProps>["items"][number];

const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "/",
      label: <Link to="/">Home</Link>,
      icon: <FiHome size={20} />,
    },
    {
      key: "/candidate",
      label: <Link to="/candidate">Candidate</Link>,
      icon: <PiUsersThree size={20} />,
    },
    {
      key: "/job",
      label: <Link to="/job">Job</Link>,
      icon: <IoBagRemoveOutline size={20} />,
    },
    {
      key: "/interview",
      label: <Link to="/interview">Interview</Link>,
      icon: <RiWechatLine size={20} />,
    },
    {
      key: "/offer",
      label: <Link to="/offer">Offer</Link>,
      icon: <IoNewspaperOutline size={20} />,
    },
    {
      key: "/user",
      label: <Link to="/user">User</Link>,
      icon: <LiaUserCogSolid size={20} />,
    },
  ];

  return (
    <Sider width={280} theme="light" style={{ height: "100vh" }}>
      <div className="p-2 d-flex">
        <img src={appInfo.logo} width={48} />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: colors.primary500,
            margin: 0,
          }}
        >
          {appInfo.title}
        </Text>
      </div>
      <Menu mode="inline" items={items} theme="light" />
    </Sider>
  );
};

export default SiderComponent;
