import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { UserModel } from "../models/UserModel";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const optionsStatus = [
  { value: "ACTIVE", label: <span>ACTIVE</span> },
  { value: "INACTIVE", label: <span>INACTIVE</span> },
];

const optionsDepartment = [
  { value: "IT", label: <span>IT</span> },
  { value: "HR", label: <span>HR</span> },
  { value: "FINANCE", label: <span>FINANCE</span> },
  { value: "COMMUNICATION", label: <span>COMMUNICATION</span> },
  { value: "MARKETING", label: <span>MARKETING</span> },
  { value: "ACCOUNTING", label: <span>ACCOUNTING</span> },
];

const optionsPosition = [
  { value: "BACKEND_DEVELOPER", label: "Backend Developer" },
  { value: "FRONTEND_DEVELOPER", label: "Frontend Developer" },
  { value: "BUSINESS_ANALYST", label: "Business Analyst" },
  { value: "TESTER", label: "Tester" },
  { value: "HR", label: "HR" },
  { value: "PROJECT_MANAGER", label: "Project Manager" },
  { value: "NOT_AVAILABLE", label: "Not Available" },
];

const optionsContractType = [
  {
    key: "TRIAL_2_MONTHS",
    value: "TRIAL_2_MONTHS",
    label: <span>Trial 2 months</span>,
  },
  {
    key: "TRAINEE_3_MONTHS",
    value: "TRAINEE_3_MONTHS",
    label: <span>Trainee 3 months</span>,
  },
  { key: "ONE_YEAR", value: "ONE_YEAR", label: <span>1 year</span> },
  {
    key: "THREE_YEARS_AND_UNLIMITED",
    value: "THREE_YEARS_AND_UNLIMITED",
    label: <span>3 years and unlimited</span>,
  },
];

const optionsLevels = [
  { value: "LEADER", label: <span>Leader</span> },
  { value: "FRESHER", label: <span>Fresher</span> },
  { value: "JUNIOR", label: <span>Junior</span> },
  { value: "SENIOR", label: <span>Senior</span> },
  { value: "MANAGER", label: <span>Manager</span> },
  { value: "VICE_HEAD", label: <span>Vice Head</span> },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onAddNew: (val: any) => void;
  offer?: any;
}

const format = "YYYY:MM:DD";

const ToogleOffer = (props: Props) => {
  const { visible, onAddNew, onClose, onUpdate, offer } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [managers, setManagers] = useState<UserModel[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [recruiter, setRecruiter] = useState<UserModel[]>([]);

  const [form] = Form.useForm();

  const getInterviews = async () => {
    const api = `/interviews/getAll`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      if (res.data) {
        // Lọc chỉ những interviews có result là PASSED
        const passedInterviews = res.data.filter(
          (interview: any) => interview.result === "PASSED"
        );
        setInterviews(passedInterviews);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    const api = `/users/all`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        const filteredUsersManager = res.data.filter(
          (user: any) => user.role === "ROLE_MANAGER"
        );
        setManagers(filteredUsersManager);

        const filteredUsersRecruiter = res.data.filter(
          (user: any) => user.role === "ROLE_RECRUITER"
        );
        setRecruiter(filteredUsersRecruiter);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (offer) {
      const formattedData = {
        interviewId: offer.interviewId,
        contractType: offer.contractType,
        position: offer.position,
        level: offer.level,
        department: offer.department,
        contractPeriod: [
          dayjs(offer.contractPeriodFrom, format).isValid()
            ? dayjs(offer.contractPeriodFrom, format)
            : null,
          dayjs(offer.contractPeriodTo, format).isValid()
            ? dayjs(offer.contractPeriodTo, format)
            : null,
        ],
        dueDate: dayjs(offer.dueDate, format).isValid()
          ? dayjs(offer.dueDate, format)
          : null,
        basicSalary: offer.basicSalary,
        note: offer.note,
        managerId: offer.approver,
        status: offer.status,
        recruiterId: offer.recruiterId,
      };

      form.setFieldsValue(formattedData);
    } else {
      form.resetFields(); // Reset các trường nếu không có offer
    }
  }, [offer, form]);

  const addNewOffer = async (values: any) => {
    const api = `/offers/create`;
    setIsLoading(true);
    try {
      const transformedData = {
        interviewId: values.interviewId,
        position: values.position,
        contractPeriodFrom: values.contractPeriod[0].$d
          .toISOString()
          .split("T")[0],
        contractPeriodTo: values.contractPeriod[1].$d
          .toISOString()
          .split("T")[0],
        contractType: values.contractType,
        level: values.level,
        department: values.department,
        dueDate: values.dueDate.$d.toISOString().split("T")[0],
        basicSalary: parseInt(values.basicSalary),
        note: values.note,
        managerId: values.managerId,
      };
      //   console.log("value", values);
      console.log("transformedData", transformedData);
      const res: any = await handleAPI(api, transformedData, "post");
      message.success(res.message);
      !offer && onAddNew(res.data);
      handleClose();
    } catch (error: any) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOffer = async (values: any) => {
    const api = `/offers/edit/${offer.id}`;
    setIsLoading(true);
    try {
      const approverManager = managers.find(
        (manager) => manager.fullName === values.managerId
      );
      const transformedData = {
        position: values.position,
        approverId: approverManager?.id,
        contractPeriodFrom: values.contractPeriod[0].$d
          .toISOString()
          .split("T")[0],
        contractPeriodTo: values.contractPeriod[1].$d
          .toISOString()
          .split("T")[0],
        basicSalary: parseInt(values.basicSalary),
        notes: values.note,
        dueDate: values.dueDate.$d.toISOString().split("T")[0],
        recruiterId: values.recruiterId,
        level: values.level,
        department: values.department,
        contractType: values.contractType,
      };
      console.log("value", values);
      console.log("transformedData", transformedData);
      const res: any = await handleAPI(api, transformedData, "put");
      message.success(res.message);
      onUpdate();
      handleClose();
    } catch (error: any) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    getInterviews();
    getUsers();
  }, []);
  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      title={offer ? "Update" : "Add Offer"}
      okText={offer ? "Update" : "Add Offer"}
      cancelText="Cancel"
      width={800}
    >
      <Form
        disabled={isLoading}
        onFinish={offer ? updateOffer : addNewOffer}
        layout="horizontal"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row gutter={16} className="mt-3">
          <Col span={12}>
            <Form.Item
              label="Interview"
              name="interviewId"
              rules={[{ required: true, message: "Please enter interview" }]}
            >
              <Select
                disabled={offer}
                options={interviews.map((interview: any) => ({
                  value: interview.id,
                  label: interview.candidateName,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Contract Type"
              name="contractType"
              rules={[{ required: true, message: "Please enter contractType" }]}
            >
              <Select options={optionsContractType} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Position"
              name="position"
              rules={[{ required: true, message: "Please enter position" }]}
            >
              <Select options={optionsPosition} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Level"
              name="level"
              rules={[{ required: true, message: "Please enter level" }]}
            >
              <Select options={optionsLevels} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: "Please enter department" }]}
            >
              <Select options={optionsDepartment} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Contract Period"
              name="contractPeriod"
              rules={[
                { required: true, message: "Please enter contractPeriod" },
              ]}
            >
              <RangePicker />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Due Date"
              name="dueDate"
              rules={[{ required: true, message: "Please select dueDate" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Basic Salary"
              name="basicSalary"
              rules={[
                { required: true, message: "basicSalary is required" },
                {
                  pattern: /^[0-9]+$/,
                  message: "basicSalary should contain only numbers",
                },
              ]}
            >
              <Input
                placeholder="Type a valid basicSalary"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Note"
              name="note"
              rules={[{ required: true, message: "Please enter Note" }]}
            >
              <Input.TextArea
                placeholder="Type a note"
                allowClear
                style={{ width: "100%", minHeight: "80px" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Manager"
              name="managerId"
              rules={[{ required: true, message: "Please enter manager" }]}
            >
              <Select
                options={managers.map((manager: any) => ({
                  value: manager.id,
                  label: manager.fullName,
                }))}
              />
            </Form.Item>
          </Col>

          {offer ? (
            <Col span={12}>
              <Form.Item label="Status" name="status">
                <Select disabled options={optionsStatus} />
              </Form.Item>
            </Col>
          ) : (
            <div></div>
          )}

          {offer ? (
            <Col span={12}>
              <Form.Item
                label="Recruiter"
                name="recruiterId"
                rules={[{ required: true, message: "Please enter Recruiter" }]}
              >
                <Select
                  options={recruiter.map((user: UserModel) => ({
                    value: user.id,
                    label: user.fullName,
                  }))}
                />
              </Form.Item>
            </Col>
          ) : (
            <div></div>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default ToogleOffer;
