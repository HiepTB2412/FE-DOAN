import { Button, Input, Select, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import handleAPI from "../apis/handleAPI";
import { UserModel } from "../models/UserModel";
import ToogleUser from "../modals/ToogleUser";

const { Title } = Typography;

interface Props {
  onUpdateUserLogin: () => void;
}

const User = (props: Props) => {
  const { onUpdateUserLogin } = props;
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateUserSelected, setUpdateUserSelected] = useState<UserModel>();

  const columns: ColumnProps<UserModel>[] = [
    {
      key: "fullName",
      title: "FullName",
      dataIndex: "fullName",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "phoneNumber",
      title: "Phone No.",
      dataIndex: "phoneNumber",
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
    },
    {
      key: "action",
      title: "Action",
      render: (item: UserModel) => (
        <div>
          <EyeOutlined
            onClick={() => {
              setUpdateUserSelected(item);
              setIsVisibleModalAddNew(true);
            }}
            style={{ marginRight: 8, color: "#1890ff", cursor: "pointer" }}
          />
          <EditOutlined style={{ color: "#52c41a", cursor: "pointer" }} />
        </div>
      ),
    },
  ];

  const options = [{ key: "HR", value: "HR", label: <span>HR</span> }];

  useEffect(() => {
    getUsers();
  }, []);

  const handleChangeSelect = (value: string) => {
    console.log(`selected ${value}`);
  };

  const getUsers = async () => {
    const api = `/users/all`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        // Thêm key cho mỗi phần tử
        const usersWithKey = res.data.map((user: UserModel) => ({
          ...user,
          key: user.id, // Giả sử mỗi user có thuộc tính id duy nhất
        }));
        setUsers(usersWithKey);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Table
        style={{ width: "90%", margin: "auto" }}
        loading={isLoading}
        dataSource={users}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>User</Title>
            </div>
            <div className="col">
              <Space>
                <Input
                  placeholder="Search..."
                  style={{ borderRadius: 100 }}
                  size="middle"
                />
                <Select
                  defaultValue="Role"
                  style={{ width: 180 }}
                  onChange={handleChangeSelect}
                  options={options}
                />
                <Tooltip title="search">
                  <Button shape="circle" icon={<FaSearch />} />
                </Tooltip>
              </Space>
            </div>
            <div className="col text-end">
              <Space>
                <Button
                  type="primary"
                  onClick={() => setIsVisibleModalAddNew(true)}
                >
                  Add New
                </Button>
              </Space>
            </div>
          </div>
        )}
      />
      <ToogleUser
        visible={isVisibleModalAddNew}
        onClose={() => {
          setUpdateUserSelected(undefined);
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => {
          setUsers([...users, val]);
        }}
        onUpdate={() => {
          getUsers();
          onUpdateUserLogin();
        }}
        user={updateUserSelected}
      />
    </div>
  );
};

export default User;
