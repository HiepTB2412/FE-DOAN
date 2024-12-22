import {
  Button,
  Input,
  message,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { ColumnProps } from "antd/es/table";
import handleAPI from "../apis/handleAPI";
import ToogleJob from "../modals/ToogleJob";
import { Link } from "react-router-dom";

const { Title } = Typography;

const options = [
  { key: "", value: "", label: <span>All</span> },
  { key: "OPEN", value: "OPEN", label: <span>Open</span> },
  { key: "DRAFT", value: "DRAFT", label: <span>Draft</span> },
  { key: "CLOSED", value: "CLOSED", label: <span>Closed</span> },
];

const Job = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );

  const getJob = async () => {
    const api = `/jobs/getAll`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        const jobsWithKey = res.data.map((job: any) => ({
          ...job,
          key: job.id,
        }));
        setAllJobs(jobsWithKey);
        setJobs(jobsWithKey);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJob();
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
    },
    {
      key: "endDate",
      title: "End Date",
      dataIndex: "endDate",
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

  const filterInterviews = (search?: string, status?: string) => {
    let filteredData = [...allJobs];

    if (search) {
      filteredData = filteredData.filter((item: any) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter((item: any) => item.status === status);
    }

    setJobs(filteredData);
  };

  const handleChangeSearch = (value: string) => {
    setSearchText(value);
    filterInterviews(value, selectedStatus); // Lọc dữ liệu sau khi thay đổi tìm kiếm
  };

  const handleChangeSelect = (value: string) => {
    setSelectedStatus(value);
    filterInterviews(searchText, value); // Lọc dữ liệu sau khi thay đổi trạng thái
  };

  return (
    <div>
      <Table
        style={{ width: "90%", margin: "auto" }}
        loading={isLoading}
        dataSource={jobs}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Job</Title>
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
      <ToogleJob
        visible={isVisibleModalAddNew}
        onClose={() => {
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => {
          setJobs([...jobs, val]);
        }}
      />
    </div>
  );
};

export default Job;
