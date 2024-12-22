import { useState } from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Slider,
} from "antd";
import handleAPI from "../apis/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
}

const { RangePicker } = DatePicker;

const optionsSkills = [
  { value: "JAVA", label: <span>Java</span> },
  { value: "NODEJS", label: <span>Nodejs</span> },
  { value: "DOTNET", label: <span>.Net</span> },
  { value: "CPP", label: <span>C++</span> },
  { value: "BUSINESS_ANALYSIS", label: <span>Business analysis</span> },
  { value: "COMMUNICATION", label: <span>Communication</span> },
];

const optionsLevels = [
  { value: "LEADER", label: <span>Leader</span> },
  { value: "FRESHER", label: <span>Fresher</span> },
  { value: "JUNIOR", label: <span>Junior</span> },
  { value: "SENIOR", label: <span>Senior</span> },
  { value: "MANAGER", label: <span>Manager</span> },
  { value: "VICE_HEAD", label: <span>Vice Head</span> },
];

const optionsBenefits = [
  { value: "LUNCH", label: <span>Lunch</span> },
  { value: "HEALTH_INSURANCE", label: <span>Health Insurance</span> },
  { value: "HYBRID_WORKING", label: <span>Hybrid Working</span> },
  { value: "TRAVEL", label: <span>Travel</span> },
  { value: "LEAVE_25_DAYS", label: <span>Leave 25 Days</span> },
];

const ToogleJob = (props: Props) => {
  const { visible, onAddNew, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const addNewJob = async (values: any) => {
    setIsLoading(true);
    const api = `/jobs`;
    const formattedData = {
      title: values.title,
      startDate: values.rangeDate[0]?.$d.toISOString().split("T")[0],
      endDate: values.rangeDate[1]?.$d.toISOString().split("T")[0],
      salaryStartRange: values.rangeSalary[0] * 1000000,
      salaryEndRange: values.rangeSalary[1] * 1000000,
      workingAddress: values.workingAddress,
      skills: values.skills,
      levels: values.levels,
      benefits: values.benefits,
      description: values.description,
    };
    try {
      console.log(formattedData);
      const res: any = await handleAPI(api, formattedData, "post");
      console.log(res);
      message.success(res.message);
      onAddNew(res.data);
      handleClose();
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
      title={"Add Job"}
      okText={"Add Job"}
      cancelText="Cancel"
      width={800}
    >
      <Form
        disabled={isLoading}
        onFinish={addNewJob}
        layout="horizontal"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row gutter={16} className="mt-3">
          <Col span={12}>
            <Form.Item
              label="Job title"
              name="title"
              rules={[{ required: true, message: "Please enter title" }]}
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
              label="Skills"
              name="skills"
              rules={[{ required: true, message: "Please enter skills" }]}
            >
              <Select mode="multiple" options={optionsSkills} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Range date"
              name="rangeDate"
              rules={[{ required: true, message: "Please enter date" }]}
            >
              <RangePicker />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Range salary"
              name="rangeSalary"
              rules={[{ required: true, message: "Please enter salary" }]}
            >
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={[0, 20]}
                min={0}
                max={100}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Benefits"
              name="benefits"
              rules={[{ required: true, message: "Please select benefits" }]}
            >
              <Select mode="multiple" options={optionsBenefits} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Levels"
              name="levels"
              rules={[{ required: true, message: "Please enter levels" }]}
            >
              <Select mode="multiple" options={optionsLevels} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Working"
              name="workingAddress"
              rules={[
                { required: true, message: "Please select working address" },
              ]}
            >
              <Input
                placeholder="Type a working address"
                allowClear
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea
                placeholder="Type a description"
                allowClear
                style={{ width: "100%", minHeight: "80px" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ToogleJob;
