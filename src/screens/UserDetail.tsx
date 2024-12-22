import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { UserModel } from "../models/UserModel";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import ToogleChangePassword from "../modals/ToogleChangePassword";

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

interface Props {
  user?: UserModel;
}

const UserDetail = (props: Props) => {
  const { user } = props;
  const [form] = Form.useForm();

  const [isVisibleModalChangePasswoord, setIsVisibleModalChangePassword] =
    useState(false);

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

  return (
    <div>
      <Card
        style={{
          width: "60%",
          margin: "auto",
          marginTop: "5%",
        }}
      >
        <Form
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
                  disabled={true}
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
                  disabled={true}
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
                <DatePicker disabled={true} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please enter Address" }]}
              >
                <Input
                  disabled={true}
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
                  disabled={true}
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
                <Select disabled={true} options={optionsGender} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please select Role" }]}
              >
                <Select disabled={true} options={optionsRole} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Department"
                name="department"
                rules={[
                  { required: true, message: "Please select Department" },
                ]}
              >
                <Select disabled={true} options={optionsDepartment} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Note"
                name="note"
                rules={[{ required: true, message: "Please enter Note" }]}
              >
                <Input.TextArea
                  disabled={true}
                  placeholder="Type a note"
                  allowClear
                  style={{ width: "100%", minHeight: "80px" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Status" name="status">
                <Select disabled={true} options={optionsStatus} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div className="text-end mt-5">
          <Button
            type="primary"
            onClick={() => setIsVisibleModalChangePassword(true)}
          >
            Change Password
          </Button>
        </div>
      </Card>

      <ToogleChangePassword
        visible={isVisibleModalChangePasswoord}
        onClose={() => setIsVisibleModalChangePassword(false)}
      />
    </div>
  );
};

export default UserDetail;
