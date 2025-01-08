import {
  Button,
  Input,
  message,
  Pagination,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { ColumnProps } from "antd/es/table";
import handleAPI from "../apis/handleAPI";
import ToogleJob from "../modals/ToogleJob";
import { Link } from "react-router-dom";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import ToogleAddFileJob from "../modals/ToogleAddFileJob";

const { Title } = Typography;

const options = [
  { key: "", value: "", label: <span>All</span> },
  { key: "OPEN", value: "OPEN", label: <span>Open</span> },
  { key: "DRAFT", value: "DRAFT", label: <span>Draft</span> },
  { key: "CLOSE", value: "CLOSE", label: <span>Close</span> },
];

const Job = () => {
  const auth: AuthState = useSelector(authSeletor);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [isVisibleModalAddNewFile, setIsVisibleModalAddNewFile] =
    useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const getJob = async (page: number) => {
    let api = `/jobs?page=${page}`;
    if (searchText) {
      api += `&keyword=${searchText}`;
    }
    if (selectedStatus) {
      api += `&status=${selectedStatus}`;
    }
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        const jobsWithKey = res.data.content.map((job: any) => ({
          ...job,
          key: job.id,
        }));
        setJobs(jobsWithKey);
        setTotalElements(res.data.totalElements);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJob(currentPage);
  }, []);

  const columns: ColumnProps<[]>[] = [
    {
      key: "title",
      title: "Job Title",
      dataIndex: "title",
    },
    {
      key: "skills",
      title: "Required Skills",
      dataIndex: "skills",
      render: (skills: string[]) => (
        <div>
          {skills.map((name, index) => (
            <span key={index}>
              {name}
              {index < skills.length - 1 && ", "}{" "}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "startDate",
      title: "Start Date",
      dataIndex: "startDate",
      width: 120,
    },
    {
      key: "endDate",
      title: "End Date",
      dataIndex: "endDate",
      width: 120,
    },
    {
      key: "levels",
      title: "Level",
      dataIndex: "levels",
      render: (levels: string[]) => (
        <div>
          {levels.map((name, index) => (
            <span key={index}>
              {name} {index < levels.length - 1 && ", "}{" "}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
    },
    {
      key: "action",
      title: "Action",
      render: (item: any) => (
        <div>
          <Link to={`/job/${item.id}`}>
            <EyeOutlined
              style={{ marginRight: 8, color: "#1890ff", cursor: "pointer" }}
            />
          </Link>
          <EditOutlined style={{ color: "#52c41a", cursor: "pointer" }} />
        </div>
      ),
    },
  ];

  const handleChangeSearch = (value: string) => {
    setSearchText(value);
  };

  const handleChangeSelect = (value: string) => {
    setSelectedStatus(value);
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page - 1);
    getJob(page - 1); // Lấy dữ liệu trang mới
  };

  return (
    <div>
      <Table
        style={{ width: "90%", margin: "auto" }}
        loading={isLoading}
        dataSource={jobs}
        columns={columns}
        pagination={false}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Job</Title>
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
                  defaultValue="Status"
                  style={{ width: 180 }}
                  onChange={handleChangeSelect}
                  options={options}
                />
                <Tooltip title="search">
                  <Button
                    onClick={() => getJob(currentPage)}
                    shape="circle"
                    icon={<FaSearch />}
                  />
                </Tooltip>
              </Space>
            </div>
            <div className="col text-end">
              <Space>
                {auth.role !== 3 && (
                  <Button
                    type="primary"
                    onClick={() => setIsVisibleModalAddNew(true)}
                  >
                    Add New
                  </Button>
                )}
                {auth.role !== 3 && (
                  <Button
                    type="primary"
                    onClick={() => setIsVisibleModalAddNewFile(true)}
                  >
                    Add From File
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
          style={{ textAlign: "center" }}
          current={currentPage + 1} // Trang hiện tại
          pageSize={10} // Số dòng mỗi trang
          total={totalElements} // Tổng số dòng
          onChange={handlePaginationChange} // Xử lý thay đổi trang
        />
      </div>
      <ToogleJob
        visible={isVisibleModalAddNew}
        onClose={() => {
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => {
          setJobs([...jobs, val]);
        }}
      />

      <ToogleAddFileJob
        visible={isVisibleModalAddNewFile}
        onClose={() => {
          setIsVisibleModalAddNewFile(false);
        }}
        onAddNew={() => {
          getJob(currentPage);
        }}
      />
    </div>
  );
};

export default Job;
