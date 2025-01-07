import { message, Modal } from "antd";
import { ChangeEvent, useState } from "react";
import handleAPI from "../apis/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: () => void;
}

const ToogleAddFileJob = (props: Props) => {
  const { visible, onAddNew, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [fileJob, setFileJob] = useState<File | null>(null);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const changeFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      message.warning("No file selected");
      return;
    }

    // Kiểm tra định dạng file (nếu cần)
    if (
      ![
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ].includes(file.type)
    ) {
      message.error("Invalid file format. Please upload a CSV or Excel file.");
      return;
    }

    setFileJob(file);
    message.success("File selected: " + file.name);
  };

  const handleUpload = async () => {
    if (!fileJob) {
      message.error("Please select a file before uploading.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", fileJob);

    try {
      const api = `/jobs/import`;
      const res: any = await handleAPI(api, formData, "post");
      message.success(res.message);
      onAddNew();
      setFileJob(null);
      onClose();
    } catch (error: any) {
      message.error(
        error?.message || "An error occurred while uploading the file."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onCancel={handleClose}
      onOk={handleUpload}
      okButtonProps={{ loading: isLoading, disabled: !fileJob }}
      title="Add Interview"
      okText="Add"
      cancelText="Cancel"
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <label
          htmlFor="file-upload"
          style={{
            cursor: "pointer",
            padding: "10px 20px",
            backgroundColor: "#1890ff",
            color: "white",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={changeFileHandler}
          style={{ display: "none" }}
        />
        {fileJob && <span style={{ marginLeft: 10 }}>{fileJob.name}</span>}
      </div>
    </Modal>
  );
};

export default ToogleAddFileJob;
