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
import dayjs from "dayjs";
import handleAPI from "../apis/handleAPI";
import { UserModel } from "../models/UserModel";

const format = "HH:mm:ss";

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  interview?: any;
}

const ToogleInterview = (props: Props) => {
  const { visible, onClose, onUpdate, interview } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [recruiter, setRecruiter] = useState<UserModel[]>([]);
  const [interviewers, setInterviewers] = useState<UserModel[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [form] = Form.useForm();

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

  const getJob = async () => {
    const api = `/jobs/getAll`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      if (res.data) {
        // Lọc các job có status là "OPEN"
        const openJobs = res.data.filter((job: any) => job.status === "OPEN");
        setJobs(openJobs);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (interview) {
      const formattedData = {
        title: interview.title,
        jobId: interview.jobTitle, // Chuyển đổi khi bạn có jobId từ API
        candidateId: interview.candidateName, // Chuyển đổi nếu cần candidateId
        location: interview.location,
        recruiterId: interview.recruiterName, // Chuyển đổi khi bạn có recruiterId từ API
        meetingId: interview.meetingId,
        scheduleDate: dayjs(interview.scheduleDate),
        scheduleTime: [
          dayjs(interview.scheduleFrom, format),
          dayjs(interview.scheduleTo, format),
        ],
        notes: interview.notes,
        interviewerIds: interview.interviewers,
      };

      form.setFieldsValue(formattedData);
    } else {
      form.resetFields(); // Reset các trường nếu không có interview
    }
  }, [interview, form, interviewers]);

  const updateInterview = async (values: any) => {
    setIsLoading(true);
    const api = `/interviews/edit/${interview.id}`;

    console.log("value", values);

    const processedInterviewerIds = values.interviewerIds.map((item: any) => {
      if (typeof item === "string") {
        const interviewer = interviewers.find(
          (interviewer: any) => interviewer.fullName === item
        );
        return interviewer ? interviewer.id : item;
      }
      return item;
    });

    const processedRecruiterId =
      typeof values.recruiterId === "string"
        ? recruiter.find((r: any) => r.fullName === values.recruiterId)?.id ||
          values.recruiterId
        : values.recruiterId;

    const processedJobId =
      typeof values.jobId === "string"
        ? jobs.find((job: any) => job.title === values.jobId)?.id ||
          values.jobId
        : values.jobId;

    const formattedData = {
      title: values.title,
      jobId: processedJobId, // Chuyển đổi khi bạn có jobId từ API
      location: values.location,
      recruiterId: processedRecruiterId, // Chuyển đổi khi bạn có recruiterId từ API
      notes: values.notes,
      interviewerIds: processedInterviewerIds,
      scheduleDate: dayjs(values.scheduleDate).format("YYYY-MM-DD"),
      scheduleFrom: dayjs(values.scheduleTime[0]).format("HH:mm:ss"),
      scheduleTo: dayjs(values.scheduleTime[1]).format("HH:mm:ss"),
    };
    console.log("values", values);
    console.log("formattedData", formattedData);
    try {
      const res: any = await handleAPI(api, formattedData, "put");
      message.success(res.message);
      onUpdate();
      handleClose();
    } catch (error: any) {
      console.log(error.message);
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
    getJob();
  }, []);

  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      title={"Update"}
      okText={"Update"}
      cancelText="Cancel"
      width={800}
    >
      <Form
        disabled={isLoading}
        onFinish={updateInterview}
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
                placeholder="Type a title"
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
              <Select
                options={jobs.map((job: any) => ({
                  value: job.id,
                  label: job.title,
                }))}
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
                disabled
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

export default ToogleInterview;
