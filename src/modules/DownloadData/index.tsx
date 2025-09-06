import { ExportOutlined } from "@ant-design/icons";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, SelectWrapper, TableWrapper } from "@components/Wrapper";
import { DataType } from "@modules/CetManagement/types";
import { filterByStatus } from "@utils/commonFunctions";
import { Button, DatePicker, Space, TableProps, Modal, Input, Form, message, Select } from "antd"; // Added Modal, Input, Form, Select, and message from Ant Design
import dayjs from "dayjs";
import { snakeCase, startCase } from "lodash";
import React, { useEffect, useState } from "react";
import { useGetRequestHandler } from "src/hook/requestHandler";
import { CSVLink } from "react-csv";
import { DUMMY_TEST_LIST } from "@modules/TestMaster/dummy-tests-list";
import { STATIC_HEADERS } from "./static-header";
import usePermission from "src/hook/usePermission";
import { EMPTY_PLACEHOLDER, pageNameArray } from "@constants/AppConstant";
import { ALL_API_OBJECT, API_COMMON_ADMIN_URL } from "src/constants/ApiConstant";
const { RangePicker } = DatePicker;
import { usePostRequestHandler } from "src/hook/requestHandler";
import { useUpdateHandler } from "src/hook/requestHandler";
import { postRequest } from "@api/preference/RequestService";
interface Cet {
  id: number;
  name: string}

interface csvDataTypes {
  id: any;
  vehicle_no: string;
  selected_test: any;
  CETMANAGEMENT: {
    name: string;
  };
  center: {
    project_name: string;
  };
  user: {
    name: string;
  };
  date_time: string;
  selected_package_name: string[];
  driver: {
    name: string;
    healthCardNumber: string;
    contactNumber: string;
  };
}

interface dataTypes {
  cet_name: string;
  center_name: string;
  center_user_name: string;
  date: string;
  package_name: string;
  workforce_name: string;
  health_card_number: string;
  contact_no: string;
}

const DownloadDataComp = () => {
  const { canEdit, canCreate } = usePermission(pageNameArray[2]);
  const { data: cetData, fetchData: fetchCet } = useGetRequestHandler();
  const { loading, data, fetchData } = useGetRequestHandler();
  const [filterDate, setFilterDate] = useState<string[]>([]);
  const [cetId, setCetId] = useState("all");
  const [csvData, setCsvData] = useState<dataTypes[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<{ label: string; key: string }[]>();

  const { submit, buttonLoading } = usePostRequestHandler();
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state for vehicle
  const [form] = Form.useForm(); // Form instance for vehicle edit
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null); // Store selected test ID

  // Modal states and form instance for CET name edit
  const [isCETModalVisible, setIsCETModalVisible] = useState(false); // Modal state for CET edit
  // const [cetOptions, setCetOptions] = useState([]); // State for CET options from API
  const [selectedCETID, setSelectedCETID] = useState(null); // Selected CET ID
  const [cetForm] = Form.useForm(); // Form instance for CET edit

  const getCetData = () => fetchCet("/api/cet-list");
  const payload = {
    cet: cetId,
    start_date: filterDate?.[0],
    end_date: filterDate?.[1],
  };
  interface SelectOption {
    label: string;
    value: number;
  };

  const { updateStatus } = useUpdateHandler("/api/update-center-status");
  const getTableData = () => fetchData("/api/cet-csv-list", payload);

  // Fetch the CET list
  useEffect(() => {
    getCetData();
  }, []);

  useEffect(() => {
    if (!!filterDate || cetId) {
      getTableData();
    }
  }, [JSON.stringify(filterDate), cetId]);

  const [cetOptions, setCetOptions] = useState<SelectOption[]>([]); // Explicitly typing the state as an array of SelectOption

  useEffect(() => {
    // Fetch CET options for dropdown when component loads
    const fetchCetOptions = async () => {
      try {
        const response = await fetch("/api/cet-list", {
          method: "POST", // Ensure it's a POST request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // If your API requires any specific body data, replace this
        });
  
        const result = await response.json(); // Fetch the result
        console.log("CET List Data:", result); // Log the full response for debugging
  
        if (result.status && Array.isArray(result.data)) { // Access the 'data' field
          const options: SelectOption[] = result.data.map((cet: { name: any; id: any; }) => ({
            label: cet.name, // Use the 'name' property from the response
            value: cet.id, // Use 'id' for the value
          }));
          setCetOptions(options); // Set the options in state
          console.log("Options:", options); // Debug: log the options to check if they are set correctly
        } else {
          console.error("Invalid data format received:", result);
        }
      } catch (error) {
        console.error("Error fetching CET options:", error);
      }
    };
    fetchCetOptions();
  }, []);
  
  
  
  const renderMetaData = (allTest: any) => {
    if (!allTest) return [];
    const { eye_unit, blood_pressure_unit, ...rest } = allTest || {
      eye_unit: {},
      blood_pressure_unit: {},
    };
    !!blood_pressure_unit && delete blood_pressure_unit?.["extraData"];
    const mainData = {
      ...rest,
      ...blood_pressure_unit,
      ...eye_unit,
    };

    const mapper = Object.entries(mainData).map(([key, value]) => {
      if (!!value && Object?.keys(value)?.length > 0) {
        return value;
      }
    });
    return mapper.filter((item) => Boolean(item));
  };

  useEffect(() => {
    if (!!data) {
      const finalHeaders = [
        { label: "CET Name", key: "cet_name" },
        { label: "Center Name", key: "center_name" },
        { label: "Center User Name", key: "center_user_name" },
        { label: "Test Date", key: "date" },
        { label: "Test Package Name", key: "package_name" },
        { label: "Workforce Name", key: "workforce_name" },
        { label: "Health Card Number", key: "health_card_number" },
        { label: "Workforce Mobile No", key: "contact_number" },
        { label: "Vehicle Number", key: "vehicle_no" },
        { label: "Test ID", key: "Test_id" },
        ...STATIC_HEADERS, // Test header with label and unit defined static
      ];

      const finalData = data?.map((obj: csvDataTypes) => {
        const CENTER = obj?.center;
        const USER = obj?.user;
        const testArray = renderMetaData(obj?.selected_test);

        const mainObj = testArray?.reduce(
          (acc: Record<string, any>, curr: any) => {
            const key = typeof curr?.key === "string" ? curr.key.replace("unit","value") : "default_key";
            acc[key] = curr?.value;
            acc[curr.key] = curr?.units || "N/A";
            return acc;
          },
          {}
        );

        return {
          cet_name: obj?.CETMANAGEMENT?.name,
          center_name: CENTER?.project_name,
          center_user_name: USER?.name,
          date: dayjs(obj?.date_time).format("DD-MM-YYYY"),
          package_name:
            !!obj?.selected_package_name &&
            obj?.selected_package_name
              ?.flat()
              ?.map((item: string | undefined) => startCase(item))
              ?.join(", "),
          workforce_name: obj?.driver?.name,
          health_card_number: obj?.driver?.healthCardNumber,
          contact_number: obj?.driver?.contactNumber,
          vehicle_no: obj?.vehicle_no || "N/A",
          Test_id: obj?.id,
          ...mainObj,
        };
      });

      setCsvData(finalData);
      setCsvHeaders(finalHeaders);
    }
  }, [data]);

  // Filter table data based on the selected date range
  const filterHandler = (_: any, dateArray: string[]) => {
    setFilterDate(dateArray);
  };

  const arr = filterByStatus(cetData);
  const cetOptionsForFilter = [{ name: "All", id: "all" }]
    ?.concat(arr)
    ?.map((obj) => ({ label: obj?.name, value: obj?.id }));

  // Table Columns
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "CET Name",
      dataIndex: "CETMANAGEMENT",
      key: "CETMANAGEMENT",
      render: (CETMANAGEMENT, record) => (
        <>
          {CETMANAGEMENT?.name || EMPTY_PLACEHOLDER}
          <Button
            type="link"
            onClick={() => {
              setSelectedTestId(record?.id); // Store selected test ID
              setIsCETModalVisible(true); // Open CET modal
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
    {
      title: "Center Name",
      dataIndex: "center",
      key: "center",
      render: (record) => record?.project_name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Center Username",
      dataIndex: "user",
      key: "user",
      render: (obj) => obj?.name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Test Date",
      dataIndex: "date_time",
      key: "date_time",
      render: (date) =>
        date ? dayjs(date).format("DD-MM-YYYY") : EMPTY_PLACEHOLDER,
    },
    {
      title: "Test Package Name",
      dataIndex: "selected_package_name",
      key: "selected_package_name",
      render: (arr) =>
        !!arr
          ? arr
              ?.flat()
              ?.map((item: string | undefined) => startCase(item))
              ?.join(", ")
          : EMPTY_PLACEHOLDER,
    },
    {
      title: "Workforce Name",
      dataIndex: "driver",
      key: "driver",
      render: (obj) => obj?.name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicle_no",
      key: "vehicle_no",
      render: (vehicle_no, record) => (
        <>
          {vehicle_no || EMPTY_PLACEHOLDER}
          <Button
            type="link"
            onClick={() => {
              setSelectedTestId(record?.id);
              setIsModalVisible(true); // Open vehicle edit modal
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
    {
      title: "Test ID",
      dataIndex: "id",
      key: "id",
      render: (obj) => obj,
    },
  ];

  // Handle submit for vehicle number edit
  const handleSubmit = async (values: { new_vehicleNumber: string }) => {
    try {
      const payload = {
        test_id: selectedTestId,
        new_vehicleNumber: values.new_vehicleNumber,
      };

      const response = await submit("/api/editVehicleNumber", payload);

      if (response?.status) {
        message.success("Vehicle number updated successfully");
        setIsModalVisible(false);
        getTableData(); // Refresh table
      } else {
        message.error(response?.message || "Failed to update vehicle number");
      }
    } catch (error) {
      console.error(error);
      message.error("Internal server error");
    }
  };

  // Handle submit for CET name edit
  const handleCETEditSubmit = async () => {
    try {
      const payload = {
        test_id: selectedTestId,
        newTranspoterID: selectedCETID, // Use the selected CET ID
      };

      const response = await submit("/api/editCET", payload);
      if (response?.status) {
        message.success("CET updated successfully");
        setIsCETModalVisible(false); // Close modal
        getTableData(); // Refresh table data
      } else {
        message.error(response?.message || "Failed to update CET");
      }
    } catch (error) {
      console.error(error);
      message.error("Internal server error");
    }
  };

  const FILTER_COMPONENT = (
    <Space size={16}>
      <Space>
        CET:
        <SelectWrapper
          defaultValue="all"
          onChange={(val) => setCetId(val)}
          style={{ width: "170px" }}
          options={cetOptionsForFilter}
        />
      </Space>

      <Space>
        Filter:
        <RangePicker
          style={{ width: "250px", fontSize: "14px" }}
          onChange={filterHandler}
        />
      </Space>
      <CSVLink
        data={csvData}
        headers={csvHeaders}
        enclosingCharacter={` `}
        filename={`File-cet-${Date.now()?.toString()}.csv`}
      >
        <Button type="primary" icon={<ExportOutlined />}>
          Export
        </Button>
      </CSVLink>
    </Space>
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        MainComp={
          loading ? (
            <TableContentLoaderWithProps
              rowHeight={70}
              columnWidth={[10, "2", 20, "2", 15, "2", 15, "2", 15, "2", 12]}
            />
          ) : (
            <TableWrapper
              rowKey="id"
              className="mt-3"
              columns={columns}
              dataSource={data}
              scroll={{ x: 'max-content' }} // Enable horizontal scrolling
            />
          )
        }
        ActionComp={FILTER_COMPONENT}
      />

      {/* Modal for editing vehicle number */}
      <Modal
        title="Edit Vehicle Number"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSubmit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="New Vehicle Number"
            name="new_vehicleNumber"
            rules={[
              {
                required: true,
                message: "Please enter the new vehicle number",
              },
              {
                pattern: /^[A-Z]{2}.*\d{4}$/,
                message: "Invalid vehicle number format",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for editing CET name */}
      <Modal
        title="Edit CET Name"
        visible={isCETModalVisible}
        onCancel={() => setIsCETModalVisible(false)}
        onOk={() => {
          cetForm
            .validateFields()
            .then(() => {
              handleCETEditSubmit();
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form form={cetForm} layout="vertical">
          <Form.Item
            label="Select New CET"
            name="new_cet"
            rules={[
              {
                required: true,
                message: "Please select a CET",
              },
            ]}
          >
            <Select options={cetOptions} onChange={(value) => setSelectedCETID(value)} />
          </Form.Item>
        </Form>
      </Modal>
    </CardWrapper>
  );
};

export default DownloadDataComp;
