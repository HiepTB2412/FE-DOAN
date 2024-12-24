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
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { ColumnProps } from "antd/es/table";
import handleAPI from "../apis/handleAPI";
import ToogleOffer from "../modals/ToogleOffer";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";

const { Title } = Typography;

const options = [
  { key: "", value: "", label: <span>All</span> },
  {
    key: "WAITING_APPROVAL",
    value: "WAITING_APPROVAL",
    label: <span>Waiting for Approval</span>,
  },
  { key: "APPROVED", value: "APPROVED", label: <span>Approved</span> },
  { key: "REJECTED", value: "REJECTED", label: <span>Rejected</span> },
  {
    key: "WAITING_RESPONSE",
    value: "WAITING_RESPONSE",
    label: <span>Waiting for Response</span>,
  },
  { key: "ACCEPTED", value: "ACCEPTED", label: <span>Accepted</span> },
  { key: "DECLINED", value: "DECLINED", label: <span>Declined</span> },
  { key: "CANCELLED", value: "CANCELLED", label: <span>Cancelled</span> },
];

const Offer = () => {
  const auth: AuthState = useSelector(authSeletor);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [allOffers, setAllOffers] = useState<any[]>([]);
  const [updateOfferSelected, setUpdateOfferSelected] = useState<any>();
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatusUpdate, setSelectedStatusUpdate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );

  const getOffers = async () => {
    const api = `/offers/getAll`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      if (res.data) {
        const offersWithKey = res.data.map((offer: any) => ({
          ...offer,
          key: offer.id,
        }));
        setAllOffers(offersWithKey); // Lưu trữ dữ liệu gốc
        setOffers(offersWithKey); // Hiển thị dữ liệu gốc ban đầu
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setSelectedStatusUpdate(value);
  };

  const handleResult = async (item: any, offerStatus: string) => {
    const api = `/offers/approve-reject/${item.id}`;
    setIsLoading(true);
    try {
      console.log("offerStatus", offerStatus);

      const res: any = await handleAPI(api, { offerStatus }, "post");
      message.success(res.message);
      await getOffers();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<[]>[] = [
    {
      key: "candidateName",
      title: "Candidate Name",
      dataIndex: "candidateName",
    },
    {
      key: "approver",
      title: "Manager",
      dataIndex: "approver",
    },
    {
      key: "department",
      title: "Department",
      dataIndex: "department",
    },
    {
      key: "note",
      title: "Note",
      dataIndex: "note",
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
          <Tooltip title="Detail">
            <EyeOutlined
              onClick={() => {
                setUpdateOfferSelected(item);
                setIsVisibleModalAddNew(true);
              }}
              style={{ marginRight: 8, color: "#1890ff", cursor: "pointer" }}
            />
          </Tooltip>

          {auth.role !== 4 && auth.role !== 2 && (
            <Popconfirm
              title={
                <div>
                  <p>Please choose the result:</p>
                  <Select
                    placeholder="Select result"
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="APPROVED">APPROVED</Select.Option>
                    <Select.Option value="REJECTED">REJECTED</Select.Option>
                    <Select.Option value="ACCEPTED">ACCEPTED</Select.Option>
                    <Select.Option value="DECLINED">DECLINED</Select.Option>
                  </Select>
                </div>
              }
              onConfirm={() => {
                if (selectedStatusUpdate) {
                  handleResult(item, selectedStatusUpdate);
                } else {
                  console.log("No result selected.");
                }
              }}
              okText="Ok"
              cancelText="Cancel"
              icon={null}
            >
              <Tooltip title="Change status">
                <EditOutlined style={{ color: "#52c41a", cursor: "pointer" }} />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const filterInterviews = (search?: string, status?: string) => {
    let filteredData = [...allOffers];

    if (search) {
      filteredData = filteredData.filter((item: any) =>
        item.candidateName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredData = filteredData.filter((item: any) => item.status === status);
    }

    setOffers(filteredData);
  };

  const handleChangeSearch = (value: string) => {
    setSearchText(value);
    filterInterviews(value, selectedStatus);
  };

  const handleChangeSelect = (value: string) => {
    setSelectedStatus(value);
    filterInterviews(searchText, value);
  };

  useEffect(() => {
    getOffers();
  }, []);
  return (
    <div>
      <Table
        style={{ width: "90%", margin: "auto" }}
        loading={isLoading}
        dataSource={offers}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Offer</Title>
            </div>
            <div className="col">
              <Space>
                <Input
                  placeholder="Search Name..."
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
      <ToogleOffer
        visible={isVisibleModalAddNew}
        onClose={() => {
          setUpdateOfferSelected(undefined);
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => {
          setOffers([...offers, val]);
        }}
        onUpdate={() => {
          getOffers();
        }}
        offer={updateOfferSelected}
      />
    </div>
  );
};

export default Offer;
