import React, { useEffect, useState } from "react";
import { Table, Select, message, Space, Button } from "antd";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { pageNameArray, EMPTY_PLACEHOLDER, REQUEST_MANAGEMENT_ROUTE } from "@constants/AppConstant";
import usePermission from "src/hook/usePermission";
import moment from "moment";
import { ALL_API_OBJECT } from "src/constants/ApiConstant";
import { useRouter } from "next/router"; // Import Next.js router for navigation

const { Option } = Select;

const RequestManagement: React.FC = () => {
  const { canView } = usePermission(pageNameArray[4]); // Permissions for the page
  const [data, setData] = useState<any[]>([]); // State to store request data
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [filterStatus, setFilterStatus] = useState<"pending" | "booked" | "rejected">("pending"); // Filter state
  const router = useRouter(); // Initialize router for navigation

  // Fetch requests
  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `${ALL_API_OBJECT["consultation-list"]}?status=${filterStatus}`; // ✅ Fetch consultations by status
      console.log("🚀 API CALL - Fetching from URL:", url);
  
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch consultations: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("📊 API RESPONSE - Raw data received:", result);
      result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setData(result);
      console.log("📊 API RESPONSE - Data set in state:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch consultations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData(); // Use the API constant for fetching data
  }, [filterStatus]);

  // Filter requests based on status and centerID
  const filteredRequests = data?.filter((request: any) => {
    // First filter by centerID = 51
    if (request.centerID !== 51) {
      return false;
    }
    
    // Then filter by status
    if (filterStatus === "rejected") {
      return request.deletedAt !== null; // ✅ Only show rejected requests
    }
    return filterStatus === "pending" ? !request.status : request.status;
  });

  // Console log the filtered data for debugging
  console.log("🔍 REQUEST MANAGEMENT DEBUG - Original data:", data);
  console.log("🔍 REQUEST MANAGEMENT DEBUG - Filtered data (centerID = 51):", filteredRequests);
  console.log("🔍 REQUEST MANAGEMENT DEBUG - Filter status:", filterStatus);
  console.log("🔍 REQUEST MANAGEMENT DEBUG - Data length:", data?.length || 0);
  console.log("🔍 REQUEST MANAGEMENT DEBUG - Filtered length:", filteredRequests?.length || 0);

  // Handle action button (book/reject)
  const ACTION_TYPES = ["book", "reject","ban","restore"] as const;
  type ActionType = (typeof ACTION_TYPES)[number];

  const handleAction = async (requestId: string, driver_id: number, action: "book" | "reject" | "restore" | "ban", centerID?: number) => {
    try {
      let apiUrl = "";
      let successMessage = "";
  
      if (action === "book") {
        // Include centerID in the URL if available
        const bookingUrl = centerID 
          ? `${REQUEST_MANAGEMENT_ROUTE}/consultation-booking?requestId=${requestId}&driver_id=${driver_id}&centerID=${centerID}`
          : `${REQUEST_MANAGEMENT_ROUTE}/consultation-booking?requestId=${requestId}&driver_id=${driver_id}`;
        router.push(bookingUrl);
        return;
      } else if (action === "reject") {
        apiUrl = `${ALL_API_OBJECT["get-requests"]}/${requestId}/reject`;
        successMessage = "Request rejected successfully.";
      } else if (action === "restore") {
        apiUrl = `${ALL_API_OBJECT["get-requests"]}/${requestId}/restore`;
        successMessage = "Request restored successfully.";
      } else if (action === "ban") {
        apiUrl = `${ALL_API_OBJECT["ban-driver"]}/${driver_id}`;
        successMessage = "Driver banned successfully.";
      }
  
      const response = await fetch(apiUrl, {
        method: "PUT", // Use PUT for restore and ban actions
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${action} the request`);
      }
  
      message.success(successMessage);
      fetchData(); // Refresh the table after the action
    } catch (error) {
      console.error("Error handling action:", error);
      message.error(`Failed to ${action} the request. Please try again later.`);
    }
  };
  

  // Table columns
  const columns = [
    {
      title: "Driver Name",
      dataIndex: "driver_name",
      key: "driver_name",
    },
    {
      title: "Driver Phone",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Request Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => moment(createdAt).format("YYYY-MM-DD HH:mm") || EMPTY_PLACEHOLDER,
    },
    {
      title: "Preferred Time",
      dataIndex: "preferred_time",
      key: "preferred_time",
      render: (preferred_time: string) =>
        moment(preferred_time).format("YYYY-MM-DD HH:mm") || EMPTY_PLACEHOLDER,
    },
    // {
    //   title: "Symptoms",
    //   dataIndex: "symptoms",
    //   key: "symptoms",
    //   render: (symptoms: string) => symptoms || EMPTY_PLACEHOLDER,
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: any) =>
        record.deletedAt ? "Rejected" : status ? "Booked" : "Pending",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          {/* ✅ Show "Book" & "Reject" buttons only for pending requests */}
          {!record.deletedAt && !record.status && filterStatus === "pending" && (
            <>
              <Button type="link" onClick={() => handleAction(record.request_id, record.driver_id, "book", record.centerID)}>
                Book
              </Button>
              <Button type="link" danger onClick={() => handleAction(record.request_id, record.driver_id, "reject")}>
                Reject
              </Button>
            </>
          )}
    
          {/* ✅ Show "Restore" & "Ban Driver" buttons only for rejected requests */}
          {record.deletedAt && filterStatus === "rejected" && (
            <>
              <Button type="link" onClick={() => handleAction(record.request_id, record.driver_id, "restore")}>
                Restore
              </Button>
              <Button type="link" danger onClick={() => handleAction(record.request_id, record.driver_id, "ban")}>
                Ban Driver
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Filter component
  const FILTER_COMPONENT = (
    <Space size={16}>
      <Select
        value={filterStatus}
        onChange={(value: "pending" | "booked" | "rejected") => setFilterStatus(value)}
        style={{ width: 200 }}
      >
        <Option value="pending">Pending</Option>
        <Option value="booked">Booked</Option>
        <Option value="rejected">Rejected</Option> 
      </Select>
    </Space>
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        MainComp={
          loading ? (
            <div>Loading...</div> // Placeholder while loading data
          ) : (
            <TableWrapper
              rowKey="request_id"
              columns={columns}
              dataSource={filteredRequests}
              scroll={{ x: "max-content" }}
            />
          )
        }
        ActionComp={FILTER_COMPONENT}
      />
    </CardWrapper>
  );
};

export default RequestManagement;
