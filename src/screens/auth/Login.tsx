import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appInfo } from "../../constants/appInfos";
import handleAPI from "../../apis/handleAPI";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../../redux/reducers/authReducer";

const { Title, Paragraph } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);

    try {
      const res: any = await handleAPI("/auth/login", values, "post");
      toast.success(res.message);
      res.data && dispatch(addAuth(res.data));
      navigate("/user/detail");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        style={{
          width: "60%",
        }}
      >
        <div className="text-center">
          <img
            className="mb-3"
            src={appInfo.logo}
            alt=""
            style={{
              width: 48,
              height: 48,
            }}
          />
          <Title level={2}>Log in to your account</Title>
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
            name={"username"}
            label="Username"
            rules={[
              {
                required: true,
                message: "Please enter your Username!!!",
              },
            ]}
          >
            <Input allowClear maxLength={100} type="text" />
          </Form.Item>
          <Form.Item
            name={"password"}
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!!!",
              },
            ]}
          >
            <Input.Password maxLength={100} type="email" />
          </Form.Item>
        </Form>

        <div className="row">
          <div className="col">
            <Checkbox
              checked={isRemember}
              onChange={(val) => setIsRemember(val.target.checked)}
            >
              Remember for 30 days
            </Checkbox>
          </div>
          <div className="col text-end">
            <Link to={"/forgot-password"}>Forgot password?</Link>
          </div>
        </div>

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
            Login
          </Button>
        </div>
      </Card>
    </>
  );
};

export default Login;
