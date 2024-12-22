import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import { UserModel } from "../models/UserModel";
import handleAPI from "../apis/handleAPI";
import dayjs from "dayjs";

const format = "HH:mm:ss";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  candidate: any;
  job: any;
}

const ToogleAddInterview = (props: Props) => {
  const { visible, onAddNew, onClose, candidate, job } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [recruiter, setRecruiter] = useState<UserModel[]>([]);
  const [interviewers, setInterviewers] = useState<UserModel[]>([]);
  const [form] = Form.useForm();

  // console.log("candidate", candidate);
  console.log("jobTitle", job);

  useEffect(() => {
    if (candidate) {
      const formattedData = {
        jobId: job.title, // Chuyển đổi khi bạn có jobId từ API
        candidateId: candidate.fullName, // Chuyển đổi nếu cần candidateId
        location: candidate.location,
        recruiterId: candidate.recruiterName, // Chuyển đổi khi bạn có recruiterId từ API
        meetingId: candidate.meetingId,
        notes: candidate.notes,
        interviewerIds: candidate.interviewers,
      };

      form.setFieldsValue(formattedData);
    } else {
      form.resetFields(); // Reset các trường nếu không có interview
    }
  }, [candidate, form, interviewers]);

  const getUsers = async () => {
    const api = `/users/all`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        const filteredUsersInterviewer = res.data.filter(
          (user: any) => user.role === "ROLE_INTERVIEWER"
        );
        setInterviewers(filteredUsersInterviewer);
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

  const addNewInterview = async (values: any) => {
    setIsLoading(true);
    const api = `/interviews/create`;
    console.log("value", values);

    try {
      const transformedData = {
        title: values.title,
        candidateId: candidate.id,
        interviewerIds: values.interviewerIds,
        scheduleDate: dayjs(values.scheduleDate).format("YYYY-MM-DD"),
        scheduleFrom: dayjs(values.scheduleTime[0]).format("HH:mm"),
        scheduleTo: dayjs(values.scheduleTime[1]).format("HH:mm"),
        jobId: job.id,
        location: values.location,
        recruiterId: values.recruiterId,
        meetingId: values.meetingId,
        notes: values.notes,
      };
      console.log("transformedData", transformedData);
      const res: any = await handleAPI(api, transformedData, "post");
      console.log("res", res.data);
      onAddNew(res.data);
      handleClose();
      message.success(res.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
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
      title={"Add Interview"}
      okText={"Add"}
      cancelText="Cancel"
      width={800}
    >
      <Form
        disabled={isLoading}
        onFinish={addNewInterview}
        layout="horizontal"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row gutter={16} className="mt-3">
          <Col span={12}>
            <Form.Item
              label="Schedule title"
              name="title"
              rules={[
                { required: true, message: "Please enter Schedule title" },
              ]}
            >
              <Input
                placeholder="Type a Schedule title"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Job"
              name="jobId"
              rules={[{ required: true, message: "Please select jobId" }]}
            >
              <Input
                disabled
                placeholder="Type a Schedule title"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Candidate"
              name="candidateId"
              rules={[{ required: true, message: "Please select Candidate" }]}
            >
              <Input
                disabled
                placeholder="Type a candidate"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input
                placeholder="Type a valid location"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Recruiter"
              name="recruiterId"
              rules={[{ required: true, message: "Please select Recruiter" }]}
            >
              <Select
                options={recruiter.map((user: UserModel) => ({
                  value: user.id,
                  label: user.fullName,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Meeting ID"
              name="meetingId"
              rules={[{ required: true, message: "Please select Meeting ID" }]}
            >
              <Input
                placeholder="Type a Meeting ID"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Schedule date"
              name="scheduleDate"
              rules={[
                { required: true, message: "Please select scheduleDate" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Schedule time"
              name="scheduleTime"
              rules={[
                { required: true, message: "Please select schedule time" },
              ]}
            >
              <TimePicker.RangePicker
                style={{ width: "100%" }}
                format={format}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Note"
              name="notes"
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
              label="Interviewer"
              name="interviewerIds"
              rules={[{ required: true, message: "Please select Interviewer" }]}
            >
              <Select
                mode="multiple"
                options={interviewers.map((user: UserModel) => ({
                  value: user.id,
                  label: user.fullName,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ToogleAddInterview;
