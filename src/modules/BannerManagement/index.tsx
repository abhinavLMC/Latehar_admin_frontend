import React, { useEffect, useState } from "react";
import { Table, Space, Button, message, Segmented } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import DynamicPageLayout from "@components/DynamicPageLayout";
import BannerForm from "./BannerForm";
import { ALL_API_OBJECT } from "@constants/ApiConstant";

const placeholderOptions = [
  "home_page_1",
  "home_page_2",
  "consultation_page_1",
  "reports_page_1",
  "support_page_1",
];

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState<string | null>(null);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(ALL_API_OBJECT["get-banners"], {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to fetch banners: ${response.status}`);

      const result = await response.json();
      setBanners(result);
    } catch (error) {
      console.error("Error fetching banners:", error);
      message.error("Failed to fetch banners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle delete banner
  const handleDelete = async (bannerId: string) => {
    try {
      const response = await fetch(`${ALL_API_OBJECT["delete-banner"]}/${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete banner");

      message.success("Banner deleted successfully!");
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      message.error("Failed to delete banner.");
    }
  };

  // Open edit modal
  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setModalVisible(true);
  };

  // **Filter Banners Based on Selected Placeholder**
  const filteredBanners = selectedPlaceholder
    ? banners.filter((banner) => banner.place_holder_in_app === selectedPlaceholder)
    : banners;

  const columns = [
    {
      title: "Banner ID",
      dataIndex: "banner_id",
      key: "banner_id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Disease",
      dataIndex: "disease",
      key: "disease",
    },
    {
      title: "Image",
      dataIndex: "image_link",
      key: "image_link",
      render: (image_link: string) =>
        image_link ? <img src={image_link} alt="Banner" style={{ width: 100, height: 50 }} /> : "No Image",
    },
    {
      title: "Video",
      dataIndex: "video_link",
      key: "video_link",
      render: (video_link: string) =>
        video_link ? <a href={video_link} target="_blank" rel="noopener noreferrer">View Video</a> : "No Video",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.banner_id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <CardWrapper>
      <DynamicPageLayout
        MainComp={
          <>
            {/* ✅ Centered Toggle Bar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <Segmented
                options={placeholderOptions}
                value={selectedPlaceholder}
                onChange={(value) => setSelectedPlaceholder(value as string)}
                style={{
                  background: "#f0f2f5", 
                  padding: "5px",
                }}
                block
              />
            </div>

            {/* ✅ Table Display */}
            <TableWrapper
              rowKey="banner_id"
              columns={columns}
              dataSource={filteredBanners}
              loading={loading}
              scroll={{ x: "max-content" }}
            />

            {/* ✅ Add Banner Button Centered Below Table */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                style={{ background: "#1890ff", borderColor: "#1890ff" }}
              >
                Add Banner
              </Button>
            </div>
          </>
        }
      />

      {/* ✅ Banner Form Modal */}
      <BannerForm
              visible={modalVisible}
              setVisible={setModalVisible}
              fetchBanners={fetchBanners}
              editingBanner={editingBanner}
              setEditingBanner={setEditingBanner} 
              selectedPlaceholder={selectedPlaceholder}      />
    </CardWrapper>
  );
};

export default BannerManagement;
