import { Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { appInfo } from "../../constants/appInfos";
import handleAPI from "../../apis/handleAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values: { newPassword: string; otp: string }) => {
    setIsLoading(true);
    const api = "/auth/reset-password";
    try {
      console.log(values);
      const res: any = await handleAPI(api, values, "put");
      toast.success(res.message);
      navigate("/");
      form.resetFields();
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card style={{ width: "50%" }}>
        <div className="text-center">
          <img
            className="mb-3"
            alt=""
            src={appInfo.logo}
            style={{
              width: 70,
              height: 70,
            }}
          />
          <Title level={2}>Forgot password</Title>
          <Paragraph type="secondary">
            Welcome back! please enter your details
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name="newPassword"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
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
              placeholder="Enter your password"
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

          <Form.Item
            name={"otp"}
            label="OTP"
            rules={[
              {
                required: true,
                message: "Please enter your Otp!!!",
              },
            ]}
          >
            <Input.OTP length={6} />
          </Form.Item>
        </Form>

        <div className="mt-4 mb-3">
          <Button
            loading={isLoading}
            onClick={() => form.submit()}
            type="primary"
            style={{
              width: "100%",
            }}
            size="large"
          >
            Reset Password
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ResetPassword;
