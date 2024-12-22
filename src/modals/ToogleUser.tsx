import { DatePicker, Form, Input, Modal, Row, Col, Select } from "antd";
import { useEffect, useState } from "react";
import { UserModel } from "../models/UserModel";
import dayjs from "dayjs";
import handleAPI from "../apis/handleAPI";
import { toast } from "react-toastify";

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onAddNew: (val: UserModel) => void;
  user?: UserModel;
}

const optionsGender = [
  { value: "Male", label: <span>Male</span> },
  { value: "Female", label: <span>Female</span> },
];

const optionsRole = [
  { value: "ADMIN", label: <span>Admin</span> },
  { value: "RECRUITER", label: <span>Recruiter</span> },
  { value: "INTERVIEWER", label: <span>Interviewer</span> },
  { value: "MANAGER", label: <span>Manager</span> },
];

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

const ToogleUser = (props: Props) => {
  const { visible, onAddNew, onClose, onUpdate, user } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const formatDobToString = (dob: any) => {
    return dob ? dayjs(dob).format("YYYY-MM-DD") : "";
  };

  const formatStringToDayjs = (dobString: any) => {
    return dayjs(dobString, "YYYY-MM-DD");
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dob: user.dob ? formatStringToDayjs(user.dob) : null,
      });
    }
  }, [user]);

  const addNewUser = async (values: any) => {
    setIsLoading(true);
    const data: any = {};
    const api = `${user ? `/users/${user.id}` : "/users/create"}`;

    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.dob = formatDobToString(data.dob);

    try {
      const res: any = await handleAPI(api, data, user ? "patch" : "post");
      toast.success(res.message);
      !user && onAddNew(res.data);
      handleClose();
      user && onUpdate();
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

  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      title={user ? "Update" : "Add User"}
      okText={user ? "Update" : "Add User"}
      cancelText="Cancel"
      width={800}
    >
      <Form
        disabled={isLoading}
        onFinish={addNewUser}
        layout="horizontal"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row gutter={16} className="mt-3">
          <Col span={12}>
            <Form.Item
              label="Full name"
              name="fullName"
              rules={[{ required: true, message: "Please enter Fullname" }]}
            >
              <Input
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
              rules={[{ required: true, message: "Please enter Email" }]}
            >
              <Input
                placeholder="Type an email"
                allowClear
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
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter Address" }]}
            >
              <Input
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
              <Select options={optionsGender} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select Role" }]}
            >
              <Select disabled={user ? true : false} options={optionsRole} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: "Please select Department" }]}
            >
              <Select
                disabled={user ? true : false}
                options={optionsDepartment}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Note"
              name="note"
            >
              <Input.TextArea
                placeholder="Type a note"
                allowClear
                style={{ width: "100%", minHeight: "80px" }}
              />
            </Form.Item>
          </Col>

          {user ? (
            <Col span={12}>
              <Form.Item label="Status" name="status">
                <Select options={optionsStatus} />
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

export default ToogleUser;
