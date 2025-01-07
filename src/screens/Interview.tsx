import {
  Button,
  Input,
  message,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import ToogleInterview from "../modals/ToogleInterview";
import handleAPI from "../apis/handleAPI";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";

const { Title } = Typography;

const Interview = () => {
  const auth: AuthState = useSelector(authSeletor);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [updateInterviewSelected, setUpdateInterviewSelected] = useState<any>();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const handleCancel = async (item: any) => {
    const api = `/interviews/cancel/${item.id}`;
    try {
      const res: any = await handleAPI(api, [], "put");
      message.success(res);
      await getInterviews(currentPage);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleResult = async (item: any, result: string) => {
    const api = `/interviews/submit-result/${item.id}`;
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api, { result }, "post");
      message.success(res.message);
      await getInterviews(currentPage);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    { key: "", value: "", label: <span>All</span> },
    { key: "NEW", value: "NEW", label: <span>New</span> },
    { key: "INVITED", value: "INVITED", label: <span>Invited</span> },
    {
      key: "INTERVIEWED",
      value: "INTERVIEWED",
      label: <span>Interviewed</span>,
    },
    {
      key: "CANCELLED",
      value: "CANCELLED",
      label: <span>Cancelled</span>,
    },
  ];

  const columns: ColumnProps[] = [
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
    },
    {
      key: "candidateName",
      title: "Candidate Name",
      dataIndex: "candidateName",
    },
    {
      key: "interviewers",
      title: "Interviewer",
      dataIndex: "interviewers",
      render: (interviewers: string[]) => (
        <div>
          {interviewers.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      ),
    },
    {
      key: "scheduleTime",
      title: "Schedule",
      dataIndex: "scheduleTime",
    },
    {
      key: "result",
      title: "Result",
      dataIndex: "result",
      render: (result: string) => (
        <span
          style={{
            color:
              result === "PASSED"
                ? "#52c41a"
                : result === "FAILED"
                ? "#ff4d4f"
                : "#000",
          }}
        >
          {result}
        </span>
      ),
    },

    {
      key: "status",
      title: "Status",
      dataIndex: "status",
    },
    {
      key: "jobTitle",
      title: "Job",
      dataIndex: "jobTitle",
    },
    {
      key: "action",
      title: "Action",
      render: (item: any) => (
        <div>
          <Tooltip title="Detail">
            <EyeOutlined
              onClick={() => {
                setUpdateInterviewSelected(item);
                setIsVisibleModalAddNew(true);
              }}
              style={{ marginRight: 8, color: "#1890ff", cursor: "pointer" }}
            />
          </Tooltip>
          {item.status === "INVITED" && auth.role !== 4 && (
            <Popconfirm
              title={`You are canceling: ${item.title}`}
              onConfirm={() => handleCancel(item)}
              okText="Ok"
              cancelText="Cancel"
            >
              <Tooltip title="Cancel">
                <DeleteOutlined
                  style={{ color: "#52c41a", cursor: "pointer" }}
                />
              </Tooltip>
            </Popconfirm>
          )}
          {item.status === "INTERVIEWED" && (
            <Popconfirm
              title={
                <div>
                  <p>Please choose the result:</p>
                  <Select
                    placeholder="Select result"
                    onChange={(value) => setSelectedResult(value)}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="PASSED" style={{ color: "#52c41a" }}>
                      PASSED
                    </Select.Option>
                    <Select.Option value="FAILED" style={{ color: "#ff4d4f" }}>
                      FAILED
                    </Select.Option>
                  </Select>
                </div>
              }
              onConfirm={() => {
                if (selectedResult) {
                  handleResult(item, selectedResult);
                } else {
                  console.log("No result selected.");
                }
              }}
              okText="Ok"
              cancelText="Cancel"
              icon={null}
            >
              <Tooltip title="update result">
                <EditOutlined style={{ color: "#faad14", cursor: "pointer" }} />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const getInterviews = async (page: number) => {
    let api = `/interviews?page=${page}`;
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
        const interviewsWithKey = res.data.content.map((interview: any) => ({
          ...interview,
          key: interview.id,
        }));
        setInterviews(interviewsWithKey); // Hiển thị dữ liệu gốc ban đầu
        setTotalElements(res.data.totalElements);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeSearch = (value: string) => {
    setSearchText(value);
  };

  const handleChangeSelect = (value: string) => {
    setSelectedStatus(value);
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page - 1);
    getInterviews(page - 1); // Lấy dữ liệu trang mới
  };

  useEffect(() => {
    getInterviews(currentPage); // Gọi API chỉ một lần khi component mount
  }, []); // Chạy khi component được load lần đầu tiên

  return (
    <div>
      <Table
        dataSource={interviews}
        columns={columns}
        loading={isLoading}
        pagination={false}
        title={() => (
          <div className="row">
            <div className="col-5">
              <Title level={5}>Interview Schedule</Title>
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
                    onClick={() => getInterviews(currentPage)}
                    shape="circle"
                    icon={<FaSearch />}
                  />
                </Tooltip>
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
      <ToogleInterview
        visible={isVisibleModalAddNew}
        onClose={() => {
          setUpdateInterviewSelected(undefined);
          setIsVisibleModalAddNew(false);
        }}
        onUpdate={() => {
          getInterviews(currentPage);
        }}
        interview={updateInterviewSelected}
      />
    </div>
  );
};

export default Interview;
