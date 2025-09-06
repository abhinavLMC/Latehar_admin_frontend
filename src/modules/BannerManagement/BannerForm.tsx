import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ALL_API_OBJECT } from "@constants/ApiConstant";

const { Option } = Select;

const languages = ["English", "Hindi"];
const states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi"];

const workforceTypes = ["driver", "blue_collar"];
const placeholderOptions = [
  "home_page_1",
  "home_page_2",
  "consultation_page_1",
  "reports_page_1",
  "support_page_1",
];

interface BannerFormProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  fetchBanners: () => void;
  editingBanner?: any;
  setEditingBanner: (banner: any | null) => void;
  selectedPlaceholder?: string | null; // Get the selected tab value
}

const BannerForm: React.FC<BannerFormProps> = ({
  visible,
  setVisible,
  fetchBanners,
  editingBanner,
  setEditingBanner,
  selectedPlaceholder,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (editingBanner) {
      form.setFieldsValue(editingBanner);
    } else {
      form.resetFields();
    }
  }, [editingBanner, form]);

// 🔹 Upload Image to S3 and Return URL
const uploadImageToS3 = async (file: File): Promise<string | null> => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file); // `file` should match the backend field name

  try {
    const response = await fetch(ALL_API_OBJECT["upload-banner-file"], {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image");

    const result = await response.json();
    return result.imageUrl; // ✅ This is the S3 URL returned from the backend
  } catch (error) {
    message.error("Image upload failed.");
    return null;
  }
};

// 🔹 Handle Form Submission (Create or Update)
const handleSubmit = async (values: any) => {
  setLoading(true);
  let imageUrl = values.image_link; // Default to existing image if editing

  // Step 1: Upload Image to S3 first
  if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
          const uploadResponse = await fetch(ALL_API_OBJECT["upload-banner-file"], {
              method: "POST",
              body: formData,
          });

          if (!uploadResponse.ok) throw new Error("Image upload failed");

          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl; // ✅ Get the S3 link
      } catch (error) {
          message.error("Image upload failed. Please try again.");
          setLoading(false);
          return;
      }
  }

  // Step 2: Send the create/update request with the correct payload
  const payload = {
      ...values,
      image_link: imageUrl, // ✅ Ensure image is passed
      place_holder_in_app: selectedPlaceholder, // ✅ Set the placeholder correctly
  };

  const apiUrl = editingBanner
      ? `${ALL_API_OBJECT["update-banner"]}/${editingBanner.banner_id}`
      : ALL_API_OBJECT["create-banner"];

  try {
      const response = await fetch(apiUrl, {
          method: editingBanner ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save banner");

      message.success(`Banner ${editingBanner ? "updated" : "created"} successfully!`);
      fetchBanners(); // Refresh the banner list
      setVisible(false);
      setEditingBanner(null);
  } catch (error) {
      message.error("Failed to save banner. Please try again.");
  } finally {
      setLoading(false);
  }
};


  return (
    <Modal
      title={editingBanner ? "Edit Banner" : "Add Banner"}
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setEditingBanner(null);
      }}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="language" label="Language" rules={[{ required: true }]}>
          <Select>
            {languages.map((lang) => (
              <Option key={lang} value={lang}>
                {lang}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="state" label="State">
          <Select allowClear>
            {states.map((state) => (
              <Option key={state} value={state}>
                {state}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="workforce_type" label="Workforce Type" rules={[{ required: true }]}>
          <Select>
            {workforceTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="video_link" label="YouTube Video Link">
          <Input placeholder="Paste YouTube link here" />
        </Form.Item>

        {/* File Upload for Image */}
        <Form.Item label="Upload Image">
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false; // Prevent automatic upload
          }}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Select Image</Button>
        </Upload>
        </Form.Item>


        <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
          {editingBanner ? "Update Banner" : "Create Banner"}
        </Button>
      </Form>
    </Modal>
  );
};

export default BannerForm;
