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
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import handleAPI from "../apis/handleAPI";
import ToogleCandidate from "../modals/ToogleCandidate";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";

const { Title } = Typography;

const options = [
  { key: "", value: "", label: <span>All</span> },
  { key: "OPEN", value: "OPEN", label: <span>Open</span> },
  { key: "BANNED", value: "BANNED", label: <span>Banned</span> },
  {
    key: "WAITING_INTERVIEW",
    value: "WAITING_INTERVIEW",
    label: <span>Waiting Interview</span>,
  },
  {
    key: "CANCELLED_INTERVIEW",
    value: "CANCELLED_INTERVIEW",
    label: <span>Cancelled Interview</span>,
  },
  {
    key: "PASS_INTERVIEW",
    value: "PASS_INTERVIEW",
    label: <span>Pass Interview</span>,
  },
  {
    key: "FAILED_INTERVIEW",
    value: "FAILED_INTERVIEW",
    label: <span>Failed Interview</span>,
  },
  {
    key: "WAITING_APPROVAL",
    value: "WAITING_APPROVAL",
    label: <span>Waiting Approval</span>,
  },
  {
    key: "APPROVED_OFFER",
    value: "APPROVED_OFFER",
    label: <span>Approved Offer</span>,
  },
  {
    key: "REJECTED_OFFER",
    value: "REJECTED_OFFER",
    label: <span>Rejected Offer</span>,
  },
  {
    key: "WAITING_RESPONSE",
    value: "WAITING_RESPONSE",
    label: <span>Waiting Response</span>,
  },
  {
    key: "ACCEPTED_OFFER",
    value: "ACCEPTED_OFFER",
    label: <span>Accepted Offer</span>,
  },
  {
    key: "DECLINED_OFFER",
    value: "DECLINED_OFFER",
    label: <span>Declined Offer</span>,
  },
  {
    key: "CANCELLED_OFFER",
    value: "CANCELLED_OFFER",
    label: <span>Cancelled Offer</span>,
  },
];

const Candidate = () => {
  const auth: AuthState = useSelector(authSeletor);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [candidates, setCandidates] = useState<any[]>([]);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [updateCandidateSelected, setUpdateCandidateSelected] = useState<any>();

  const columns: ColumnProps<[]>[] = [
    {
      key: "fullName",
      title: "Name",
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
      key: "position",
      title: "Current Position",
      dataIndex: "position",
    },
    {
      key: "recruiterName",
      title: "Owner HR",
      dataIndex: "recruiterName",
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
          <EyeOutlined
            onClick={() => {
              setUpdateCandidateSelected(item);
              setIsVisibleModalAddNew(true);
            }}
            style={{ marginRight: 8, color: "#1890ff", cursor: "pointer" }}
          />
          <EditOutlined style={{ color: "#52c41a", cursor: "pointer" }} />
        </div>
      ),
    },
  ];

  const getCandidates = async () => {
    const api = `/candidates/getAll`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      if (res.data) {
        const candidatesWithKey = res.data.map((candidate: any) => ({
          ...candidate,
          key: candidate.id,
        }));
        setAllCandidates(candidatesWithKey); // Lưu trữ dữ liệu gốc
        setCandidates(candidatesWithKey); // Hiển thị dữ liệu gốc ban đầu
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInterviews = (search?: string, status?: string) => {
    let filteredData = [...allCandidates];

    if (search) {
      filteredData = filteredData.filter((item: any) =>
        item.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter((item: any) => item.status === status);
    }

    setCandidates(filteredData);
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
    getCandidates();
  }, []);
  return (
    <div>
      <Table
        dataSource={candidates}
        columns={columns}
        loading={isLoading}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Candidate</Title>
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
                {auth.role !== 3 && (
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
      <ToogleCandidate
        visible={isVisibleModalAddNew}
        onClose={() => {
          setUpdateCandidateSelected(undefined);
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => {
          setCandidates([...candidates, val]);
        }}
        onUpdate={() => {
          getCandidates();
        }}
        candidate={updateCandidateSelected}
      />
    </div>
  );
};

export default Candidate;
