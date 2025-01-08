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
import { ChangeEvent, useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { UserModel } from "../models/UserModel";
import axios from "axios";
import dayjs from "dayjs";
import { authSeletor, AuthState } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onAddNew: (val: any) => void;
  candidate?: any;
}

// const formatPhoneNumber = (phoneNumber: any) => {
//   if (phoneNumber.startsWith("+84")) {
//     return "0" + phoneNumber.slice(3);
//   }
//   return phoneNumber;
// };

const optionsGender = [
  { value: "Male", label: <span>Male</span> },
  { value: "Female", label: <span>Female</span> },
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

const optionsSkills = [
  { value: "JAVA", label: <span>Java</span> },
  { value: "NODEJS", label: <span>Nodejs</span> },
  { value: "DOTNET", label: <span>.Net</span> },
  { value: "CPP", label: <span>C++</span> },
  { value: "BUSINESS_ANALYSIS", label: <span>Business analysis</span> },
  { value: "COMMUNICATION", label: <span>Communication</span> },
];

const optionsHighestLevel = [
  { value: "HIGH_SCHOOL", label: "High School" },
  { value: "BACHELOR", label: "Bachelor" },
  { value: "MASTER", label: "Master" },
];

const formatPhoneNumber = (phoneNumber: any) => {
  if (phoneNumber.startsWith("+84")) {
    return "0" + phoneNumber.slice(3);
  }
  return phoneNumber;
};

const ToogleCandidate = (props: Props) => {
  const auth: AuthState = useSelector(authSeletor);
  const { visible, onAddNew, onClose, onUpdate, candidate } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [recruiter, setRecruiter] = useState<UserModel[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [cv, setCv] = useState<File>();
  const [form] = Form.useForm();

  const getUsers = async () => {
    const api = `/users/all`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      if (res.data) {
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
        const openJobs = res.data.filter((job: any) => job.status === "OPEN");
        setJobs(openJobs);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    const reader: FileReader = new FileReader();
    setIsLoading(true);

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          setCv(file);
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            "https://api.affinda.com/v2/resumes",
            formData,
            {
              headers: {
                Authorization:
                  "Bearer aff_51ea55c1004d3d51f70f6c2e29cdf5f08d900b8a",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const formattedData = {
            fullName: response.data.data.name?.raw || "",
            email: response.data.data.emails?.[0] || "",
            phoneNumber: formatPhoneNumber(
              response.data.data.phoneNumbers?.[0]
            ),
            address: response.data.data.location?.formatted || "",
          };

          // Lọc danh sách kỹ năng từ API
          const detectedSkills = response.data.data.skills?.map((skill: any) =>
            skill.name?.toUpperCase()
          );

          // Lọc kỹ năng có trong optionsSkills
          const selectedSkills = optionsSkills
            .filter((option) =>
              detectedSkills?.some((detectedSkill: string) =>
                detectedSkill.includes(option.value)
              )
            )
            .map((option) => option.value); // Chỉ lấy giá trị của kỹ năng

          // Cập nhật form với các kỹ năng đã lọc
          form.setFieldsValue({
            ...formattedData,
            skills: selectedSkills, // Tự động tích chọn các kỹ năng
          });
        } catch (error) {
          console.error("Error uploading CV:", error);
        }
      };
    }

    setIsLoading(false);
  };

  const addCandidate = async (values: any) => {
    const api = `/candidates/create`;
    setIsLoading(true);

    console.log("values", values);

    try {
      const candidate = {
        fullName: values.fullName,
        dob: values.dob.toISOString().split("T")[0],
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        gender: values.gender.toUpperCase(),
        position: values.position,
        skills: values.skills,
        note: values.note,
        yearOfExperience: parseInt(values.yearOfExperience, 10),
        highestLevel: values.highestLevel,
        recruiter: { id: values.recruiter },
        job: [values.job],
      };

      // const candidateUpdate = {
      //   fullName: values.fullName,
      //   dob: values.dob.toISOString().split("T")[0],
      //   email: values.email,
      //   phoneNumber: values.phoneNumber,
      //   address: values.address,
      //   gender: values.gender.toUpperCase(),
      //   position: values.position,
      //   skills: values.skills,
      //   note: values.note,
      //   yearOfExperience: parseInt(values.yearOfExperience, 10),
      //   highestLevel: values.highestLevel,
      //   recruiter: { id: values.recruiter },
      // };
      // console.log("candidateUpdate", candidateUpdate);
      console.log("candidate", candidate);
      console.log("Cv", values.cv);

      const formData = new FormData();
      formData.append("candidate", JSON.stringify(candidate));

      if (cv) {
        formData.append("cv", cv);
      }

      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }

      const res: any = await handleAPI(api, formData, "post");
      console.log("res", res);
      message.success(res.message);
      onAddNew(res.data);
      handleClose();
    } catch (error: any) {
      if (error.response) {
        message.error(
          error.response.data.message ||
            "An error occurred while adding the candidate."
        );
      } else {
        message.error("Failed to add candidate. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateCandidate = async (values: any) => {
    const api = `/candidates/${candidate.id}`;
    setIsLoading(true);

    console.log("values", values);

    try {
      const candidateUpdate = {
        fullName: values.fullName,
        dob: values.dob.toISOString().split("T")[0],
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        gender: values.gender.toUpperCase(),
        position: values.position,
        skills: values.skills,
        note: values.note,
        yearOfExperience: parseInt(values.yearOfExperience, 10),
        highestLevel: values.highestLevel,
        recruiter: { id: values.recruiter },
      };
      console.log("candidateUpdate", candidateUpdate);

      const res: any = await handleAPI(api, candidateUpdate, "put");
      console.log("res", res);
      message.success(res.message);
      onUpdate();
      handleClose();
    } catch (error: any) {
      if (error.response) {
        message.error(
          error.response.data.message ||
            "An error occurred while adding the candidate."
        );
      } else {
        message.error("Failed to add candidate. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setCv(undefined);
    onClose();
  };

  useEffect(() => {
    if (candidate) {
      const formattedData = {
        fullName: candidate.fullName,
        dob: dayjs(candidate.dob),
        email: candidate.email,
        phoneNumber: candidate.phoneNumber,
        address: candidate.address,
        gender: candidate.gender.toUpperCase(),
        position: candidate.position,
        skills: candidate.skills,
        note: candidate.note,
        yearOfExperience: parseInt(candidate.yearOfExperience, 10),
        highestLevel: candidate.highestLevel,
        recruiter: candidate.recruiterId,
      };

      form.setFieldsValue(formattedData);
    } else {
      form.resetFields(); // Reset các trường nếu không có interview
    }
  }, [candidate, form]);

  useEffect(() => {
    getUsers();
    getJob();
  }, []);

  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{
        loading: isLoading,
        disabled: auth.role === 3 || (candidate && candidate.status !== "OPEN"), // Disable button if auth.role === 3
      }}
      title={candidate ? "Update Candidate" : "Add Candidate"}
      okText={candidate ? "Update" : "Add Candidate"}
      cancelText="Cancel"
      width={800}
    >
      <Form
        disabled={isLoading}
        onFinish={(values) => {
          candidate ? updateCandidate(values) : addCandidate(values);
        }}
        layout="horizontal"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        {/* Nội dung form */}
        <Row gutter={16} className="mt-3">
          {candidate ? (
            <div></div>
          ) : (
            <Col span={12}>
              <Form.Item
                label="CV"
                name="cv"
                rules={[{ required: true, message: "Please upload a CV" }]}
              >
                <input type="file" onChange={changeImageHandler} />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item
              label="Full name"
              name="fullName"
              rules={[{ required: true, message: "Please enter Fullname" }]}
            >
              <Input
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                placeholder="Type a name"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email address!",
                },
              ]}
            >
              <Input
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                placeholder="Type an email"
                allowClear
                type="email"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="D.O.B"
              name="dob"
              rules={[{ required: true, message: "Please enter Dob" }]}
            >
              <DatePicker
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter Address" }]}
            >
              <Input
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                placeholder="Type an address"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Phone number is required" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Phone number should contain only numbers",
                },
                {
                  min: 10,
                  message: "Phone number must be at least 10 digits",
                },
              ]}
            >
              <Input
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                placeholder="Type a valid phone number"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select Gender" }]}
            >
              <Select
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                options={optionsGender}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Position"
              name="position"
              rules={[{ required: true, message: "Please select position" }]}
            >
              <Select
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                options={optionsPosition}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Experience"
              name="yearOfExperience"
              rules={[
                { required: true, message: "Please enter yearOfExperience" },
              ]}
            >
              <Input
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                placeholder="Type a yearOfExperience"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Recruiter"
              name="recruiter"
              rules={[{ required: true, message: "Please select recruiter" }]}
            >
              <Select
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                options={recruiter.map((user: UserModel) => ({
                  value: user.id,
                  label: user.fullName,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Highest Level"
              name="highestLevel"
              rules={[
                { required: true, message: "Please select highestLevel" },
              ]}
            >
              <Select
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                options={optionsHighestLevel}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Skills"
              name="skills"
              rules={[{ required: true, message: "Please select skills" }]}
            >
              <Select
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select skills"
                options={optionsSkills}
              />
            </Form.Item>
          </Col>

          {candidate ? (
            <div></div>
          ) : (
            <Col span={12}>
              <Form.Item
                label="Job"
                name="job"
                rules={[{ required: true, message: "Please select job" }]}
              >
                <Select
                  disabled={
                    !(cv || candidate) ||
                    (candidate && candidate.status !== "OPEN")
                  }
                  options={jobs.map((job: any) => ({
                    value: job.title,
                    label: job.title,
                  }))}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item label="Note" name="note">
              <Input
                disabled={
                  !(cv || candidate) ||
                  (candidate && candidate.status !== "OPEN")
                }
                placeholder="Type a note"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ToogleCandidate;
