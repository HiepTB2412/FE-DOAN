import {
  Button,
  Input,
  Pagination,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import handleAPI from "../apis/handleAPI";
import { UserModel } from "../models/UserModel";
import ToogleUser from "../modals/ToogleUser";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";

const { Title } = Typography;

interface Props {
  onUpdateUserLogin: () => void;
}

const optionsRole = [
  { value: "", label: <span>All</span> },
  { value: "ADMIN", label: <span>Admin</span> },
  { value: "RECRUITER", label: <span>Recruiter</span> },
  { value: "INTERVIEWER", label: <span>Interviewer</span> },
  { value: "MANAGER", label: <span>Manager</span> },
];

const User = (props: Props) => {
  const { onUpdateUserLogin } = props;
  const auth: AuthState = useSelector(authSeletor);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateUserSelected, setUpdateUserSelected] = useState<UserModel>();
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

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

  useEffect(() => {
    getUsers(currentPage);
  }, []);

  const handleChangeSearch = (value: string) => {
    setSearchText(value);
  };

  const handleChangeSelect = (value: string) => {
    setSelectedStatus(value);
  };

  const getUsers = async (page: number) => {
    let api = `/users/all/paginate?page=${page}`;
    if (searchText) {
      api += `&keyword=${searchText}`;
    }
    if (selectedStatus) {
      api += `&role=${selectedStatus}`;
    }
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        // Thêm key cho mỗi phần tử
        const usersWithKey = res.data.data.map((user: UserModel) => ({
          ...user,
          key: user.id, // Giả sử mỗi user có thuộc tính id duy nhất
        }));
        setUsers(usersWithKey);
        setTotalElements(res.data.totalElements);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page - 1);
    getUsers(page - 1); // Lấy dữ liệu trang mới
  };

  return (
    <div>
      <Table
        style={{ width: "90%", margin: "auto" }}
        loading={isLoading}
        dataSource={users}
        columns={columns}
        pagination={false}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Offer</Title>
            </div>
            <div className="col">
              <Space>
                <Input
                  placeholder="Search ..."
                  style={{ borderRadius: 100 }}
                  allowClear
                  size="middle"
                  onChange={(e) => handleChangeSearch(e.target.value)}
                />
                <Select
                  defaultValue="Role"
                  style={{ width: 180 }}
                  onChange={handleChangeSelect}
                  options={optionsRole}
                />
                <Tooltip title="search">
                  <Button
                    onClick={() => getUsers(currentPage)}
                    shape="circle"
                    icon={<FaSearch />}
                  />
                </Tooltip>
              </Space>
            </div>
            <div className="col text-end">
              <Space>
                {auth.role !== 2 && auth.role !== 4 && (
                  <Button
                    type="primary"
                    onClick={() => setIsVisibleModalAddNew(true)}
                  >
                    Add New
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      >
        <Pagination
          style={{ marginTop: "16px", textAlign: "center" }}
          current={currentPage + 1} // Trang hiện tại
          pageSize={10} // Số dòng mỗi trang
          total={totalElements} // Tổng số dòng
          onChange={handlePaginationChange} // Xử lý thay đổi trang
        />
      </div>
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
          getUsers(currentPage);
          onUpdateUserLogin();
        }}
        user={updateUserSelected}
      />
    </div>
  );
};

export default User;
