import { Form, Input, Modal } from "antd";
import { useState } from "react";
import handleAPI from "../apis/handleAPI";
import { toast } from "react-toastify";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ToogleChangePassword = (props: Props) => {
  const { visible, onClose } = props;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    setIsLoading(true);

    try {
      const res: any = await handleAPI(
        "/users/change-password",
        values,
        "patch"
      );
      toast.success(res.message);
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleChangePassword}
        disabled={isLoading}
        size="large"
      >
        <Form.Item
          name={"oldPassword"}
          label="Old Password"
          rules={[
            {
              required: true,
              message: "Please enter your Old Password!!!",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your Old Password"
            maxLength={100}
            type="text"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            {
              required: true,
              message: "Please enter your New Password!",
            },
            {
              validator: (_, value) =>
                value && value.length < 6
                  ? Promise.reject(
                      new Error("Password must have at least 6 characters")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your New Password"
            maxLength={100}
            type="text"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm your password"
            maxLength={100}
            type="text"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ToogleChangePassword;
