import {
  Button,
  Input,
  message,
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

const { Title } = Typography;

const Interview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [updateInterviewSelected, setUpdateInterviewSelected] = useState<any>();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [allInterviews, setAllInterviews] = useState<any[]>([]); // Dữ liệu gốc
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const handleCancel = async (item: any) => {
    const api = `/interviews/cancel/${item.id}`;
    try {
      const res: any = await handleAPI(api, [], "put");
      message.success(res);
      await getInterviews();
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
      await getInterviews();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(true);
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
          {item.status === "INVITED" && (
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

  const getInterviews = async () => {
    const api = `/interviews/getAll`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      if (res.data) {
        const interviewsWithKey = res.data.map((interview: any) => ({
          ...interview,
          key: interview.id,
        }));
        setAllInterviews(interviewsWithKey); // Lưu trữ dữ liệu gốc
        setInterviews(interviewsWithKey); // Hiển thị dữ liệu gốc ban đầu
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInterviews = (search?: string, status?: string) => {
    let filteredData = [...allInterviews];

    if (search) {
      filteredData = filteredData.filter((item: any) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter((item: any) => item.status === status);
    }

    setInterviews(filteredData);
  };

  const handleChangeSearch = (value: string) => {
    setSearchText(value);
    filterInterviews(value, selectedStatus); // Lọc dữ liệu sau khi thay đổi tìm kiếm
  };

  const handleChangeSelect = (value: string) => {
    setSelectedStatus(value);
    filterInterviews(searchText, value); // Lọc dữ liệu sau khi thay đổi trạng thái
  };

  useEffect(() => {
    getInterviews(); // Gọi API chỉ một lần khi component mount
  }, []); // Chạy khi component được load lần đầu tiên

  return (
    <div>
      <Table
        dataSource={interviews}
        columns={columns}
        loading={isLoading}
        title={() => (
          <div className="row">
            <div className="col-5">
              <Title level={5}>Interview Schedule</Title>
            </div>
            <div className="col">
              <Space>
                <Input
                  placeholder="Search title..."
                  style={{ borderRadius: 100 }}
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
                  <Button shape="circle" icon={<FaSearch />} />
                </Tooltip>
              </Space>
            </div>
          </div>
        )}
      />
      <ToogleInterview
        visible={isVisibleModalAddNew}
        onClose={() => {
          setUpdateInterviewSelected(undefined);
          setIsVisibleModalAddNew(false);
        }}
        onUpdate={() => {
          getInterviews();
        }}
        interview={updateInterviewSelected}
      />
    </div>
  );
};

export default Interview;
