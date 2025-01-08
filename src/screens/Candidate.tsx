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
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import handleAPI from "../apis/handleAPI";
import ToogleCandidate from "../modals/ToogleCandidate";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import { PiNewspaperClippingThin } from "react-icons/pi";

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
  const [updateCandidateSelected, setUpdateCandidateSelected] = useState<any>();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const columns: ColumnProps<[]>[] = [
    {
      key: "CV",
      title: "CV",
      dataIndex: "CV",
    },
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
          {auth.role !== 3 && (
            <EyeOutlined
              title="View detail information"
              onClick={() => {
                setUpdateCandidateSelected(item);
                setIsVisibleModalAddNew(true);
              }}
              style={{ marginRight: 8, color: "#1890ff", cursor: "pointer" }}
            />
          )}
          <Tooltip title="View CV">
            <PiNewspaperClippingThin
              onClick={async () => {
                setIsLoading(true);
                try {
                  // Gọi API để lấy link
                  let api = item.cvUrl;
                  const data: any = await handleAPI(api);

                  console.log(data.link);
                  // Kiểm tra nếu có link
                  if (data.link) {
                    // Mở link trong tab mới
                    window.open(data.link, "_blank");
                  } else {
                    // Xử lý nếu không có link
                    console.error("No link found in API response");
                  }
                } catch (error) {
                  console.error("Failed to fetch CV link", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              style={{ color: "#faad14", cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const getCandidates = async (page: number) => {
    let api = `/candidates/all?page=${page}`;
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
        const candidatesWithKey = res.data.data.map((candidate: any) => ({
          ...candidate,
          key: candidate.id,
        }));
        // console.log("candidate", res.data);

        setCandidates(candidatesWithKey); // Hiển thị dữ liệu gốc ban đầu
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
    getCandidates(page - 1); // Lấy dữ liệu trang mới
  };

  useEffect(() => {
    getCandidates(currentPage);
  }, []);
  return (
    <div>
      <Table
        dataSource={candidates}
        columns={columns}
        pagination={false}
        loading={isLoading}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Candidate</Title>
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
                    onClick={() => getCandidates(currentPage)}
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
          getCandidates(currentPage);
        }}
        candidate={updateCandidateSelected}
      />
    </div>
  );
};

export default Candidate;
