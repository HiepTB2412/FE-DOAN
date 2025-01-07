import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Slider,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { ColumnProps } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import ToogleAddInterview from "../modals/ToogleAddInterview";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const optionsSkills = [
  { value: "JAVA", label: <span>Java</span> },
  { value: "NODEJS", label: <span>Nodejs</span> },
  { value: "DOTNET", label: <span>.Net</span> },
  { value: "CPP", label: <span>C++</span> },
  { value: "BUSINESS_ANALYSIS", label: <span>Business analysis</span> },
  { value: "COMMUNICATION", label: <span>Communication</span> },
];

const optionsLevels = [
  { value: "LEADER", label: <span>Leader</span> },
  { value: "FRESHER", label: <span>Fresher</span> },
  { value: "JUNIOR", label: <span>Junior</span> },
  { value: "SENIOR", label: <span>Senior</span> },
  { value: "MANAGER", label: <span>Manager</span> },
  { value: "VICE_HEAD", label: <span>Vice Head</span> },
];

const optionsBenefits = [
  { value: "LUNCH", label: <span>Lunch</span> },
  { value: "HEALTH_INSURANCE", label: <span>Health Insurance</span> },
  { value: "HYBRID_WORKING", label: <span>Hybrid Working</span> },
  { value: "TRAVEL", label: <span>Travel</span> },
  { value: "LEAVE_25_DAYS", label: <span>Leave 25 Days</span> },
];

const options = [
  { key: "", value: "", label: <span>All</span> },
  { key: "OPEN", value: "OPEN", label: <span>Open</span> },
  { key: "DRAFT", value: "DRAFT", label: <span>Draft</span> },
  { key: "CLOSED", value: "CLOSED", label: <span>Closed</span> },
];

const JobDetail = () => {
  const auth: AuthState = useSelector(authSeletor);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [jobDetail, setJobDetail] = useState<any>({});
  const [updateCandidateSelected, setUpdateCandidateSelected] = useState<any>();
  const [job, setJob] = useState<any>();

  const [form] = Form.useForm();
  const param = useParams();
  const navigate = useNavigate();

  const columnsInterviews: ColumnProps[] = [
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
  ];

  const columnsCandidates: ColumnProps<[]>[] = [
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
      render: (item: any) =>
        item.status === "OPEN" &&
        jobDetail.status === "OPEN" &&
        auth.role !== 3 ? (
          <div>
            <Tooltip title={"Add Interview"}>
              <EditOutlined
                onClick={() => {
                  setUpdateCandidateSelected(item);
                  setIsVisibleModalAddNew(true);
                  setJob(jobDetail);
                }}
                style={{ color: "#52c41a", cursor: "pointer" }}
              />
            </Tooltip>
          </div>
        ) : null, // Không render gì nếu status không phải OPEN
    },
  ];

  useEffect(() => {
    if (jobDetail) {
      form.setFieldsValue({
        title: jobDetail.title,
        skills: jobDetail.skills,
        rangeDate: [
          jobDetail.startDate ? moment(jobDetail.startDate) : null,
          jobDetail.endDate ? moment(jobDetail.endDate) : null,
        ],
        rangeSalary: [
          jobDetail.salaryStartRange / 1000000,
          jobDetail.salaryEndRange / 1000000,
        ],
        benefits: jobDetail.benefits,
        levels: jobDetail.levels,
        workingAddress: jobDetail.workingAddress,
        description: jobDetail.description,
        status: jobDetail.status,
      });
    }
  }, [jobDetail, form]);

  const updateJob = async (values: any) => {
    setIsLoading(true);
    const api = `/jobs/${param.id}`;
    try {
      const transformedData = {
        title: values.title,
        startDate: values.rangeDate[0]?.format("YYYY-MM-DD") || null,
        endDate: values.rangeDate[1]?.format("YYYY-MM-DD") || null,
        salaryStartRange: values.rangeSalary[0] * 1000000,
        salaryEndRange: values.rangeSalary[1] * 1000000,
        workingAddress: values.workingAddress,
        skills: values.skills,
        levels: values.levels,
        benefits: values.benefits,
        description: values.description,
      };
      console.log("transformedData", transformedData);
      const res: any = await handleAPI(api, transformedData, "put");
      navigate("/job");
      message.success(res.message);
    } catch (error: any) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getJobDetail = async () => {
    const api = `/jobs/${param.id}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        setJobDetail(res.data);
        console.log(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobDetail();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
          loading={isLoading}
          style={{ width: "90%", paddingRight: "110px" }}
        >
          {" "}
          <Form
            disabled={isLoading}
            onFinish={updateJob}
            layout="horizontal"
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Row gutter={16} className="mt-3">
              <Col span={12}>
                <Form.Item
                  label="Job title"
                  name="title"
                  rules={[{ required: true, message: "Please enter title" }]}
                >
                  <Input
                    disabled={auth.role === 3 ? true : false}
                    placeholder="Type a title"
                    allowClear
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Skills"
                  name="skills"
                  rules={[{ required: true, message: "Please enter skills" }]}
                >
                  <Select
                    disabled={auth.role === 3 ? true : false}
                    mode="multiple"
                    options={optionsSkills}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Range date"
                  name="rangeDate"
                  rules={[{ required: true, message: "Please enter date" }]}
                >
                  <RangePicker disabled={auth.role === 3 ? true : false} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Range salary"
                  name="rangeSalary"
                  rules={[{ required: true, message: "Please enter salary" }]}
                >
                  <Slider
                    disabled={auth.role === 3 ? true : false}
                    range={{ draggableTrack: true }}
                    defaultValue={[0, 20]}
                    min={0}
                    max={100}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Benefits"
                  name="benefits"
                  rules={[
                    { required: true, message: "Please select benefits" },
                  ]}
                >
                  <Select
                    disabled={auth.role === 3 ? true : false}
                    mode="multiple"
                    options={optionsBenefits}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Levels"
                  name="levels"
                  rules={[{ required: true, message: "Please enter levels" }]}
                >
                  <Select
                    disabled={auth.role === 3 ? true : false}
                    mode="multiple"
                    options={optionsLevels}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Working"
                  name="workingAddress"
                  rules={[
                    {
                      required: true,
                      message: "Please select working address",
                    },
                  ]}
                >
                  <Input
                    disabled={auth.role === 3 ? true : false}
                    placeholder="Type a working address"
                    allowClear
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: "Please enter description" },
                  ]}
                >
                  <Input.TextArea
                    disabled={auth.role === 3 ? true : false}
                    placeholder="Type a description"
                    allowClear
                    style={{ width: "100%", minHeight: "80px" }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Status" name="status">
                  <Select disabled options={options} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "10px",
            }}
          >
            {auth.role !== 3 && (
              <Button onClick={() => form.submit()} type="primary">
                Update
              </Button>
            )}
          </div>
        </Card>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}
      >
        <Table
          style={{ width: "90%" }}
          dataSource={jobDetail.interviews}
          columns={columnsInterviews}
          loading={isLoading}
          title={() => (
            <div className="row">
              <div className="col-5">
                <Title level={5}>Interviews</Title>
              </div>
            </div>
          )}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Table
          style={{ width: "90%" }}
          dataSource={jobDetail.candidates}
          columns={columnsCandidates}
          loading={isLoading}
          title={() => (
            <div className="row">
              <div className="col-5">
                <Title level={5}>Candidate</Title>
              </div>
            </div>
          )}
        />
      </div>
      <ToogleAddInterview
        visible={isVisibleModalAddNew}
        onClose={() => {
          setUpdateCandidateSelected(undefined);
          setJob("");
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={() => {
          getJobDetail();
        }}
        candidate={updateCandidateSelected}
        job={job}
      />
    </div>
  );
};

export default JobDetail;
