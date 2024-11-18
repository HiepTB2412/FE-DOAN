import { Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appInfo } from "../../constants/appInfos";
import handleAPI from "../../apis/handleAPI";
import { toast } from "react-toastify";

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string }) => {
    setIsLoading(true);
    const api = "/auth/forgot-password";

    try {
      const res: any = await handleAPI(api, values, "post");
      toast.success(res.message);
      navigate("/reset-password");
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
            name={"email"}
            label="Email"
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
              placeholder="Enter your email"
              allowClear
              maxLength={100}
              type="email"
            />
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
            Submit
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ForgotPassword;
