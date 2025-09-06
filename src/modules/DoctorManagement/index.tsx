import { EditPencil } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { DOCTOR_MANAGEMENT_ROUTE, EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from "@constants/AppConstant";
import { TableProps,  Space, Table, Button, Switch } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import { useGetRequestHandler, useUpdateHandler } from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";

interface DataType {
  signature: string;
  registration_number: string;
  User: any;
  external_id: string | number | boolean | undefined;
  status: boolean | undefined;
  username: string;
  qualification: string;
  id: string;
  permission: {
    permission_name: string;
  };
  key: string;
  contact_number: string;
}

const DoctorManagement = () => {
  const { tableScroll, componentSize } = useDevice();
  const { getColumnSearch } = useSearchHook()
  const { canEdit, canCreate} = usePermission(pageNameArray[1]);

  // to get the initial data
  const { loading, data, fetchData } = useGetRequestHandler();

  // for toggle update
  const {updateStatus} = useUpdateHandler("/api/update-doctor-status" )

  // fetch initial table data
  const getTableData = () => {
    return fetchData("/api/doctor-list");
  }

  useEffect(() => {
    getTableData()
  }, [])

    // admin user status update handler
  const updateCenterStatus = (status: boolean, id: string) => {
    updateStatus({ status, id }, () => getTableData());
  }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Doctor ID",
      dataIndex: EXTERNAL_ID,
      key: EXTERNAL_ID,
      ...(getColumnSearch(EXTERNAL_ID, "", "Doctor ID") as () => void),
    },
    {
      title: "Username",
      dataIndex: "User",
      key: "User",
      ...(getColumnSearch("username", "User") as () => void),
      render: (obj) => obj?.username || EMPTY_PLACEHOLDER,
    },
    {
      title: "Phone",
      key: "contact_number",
      dataIndex: "contact_number",
      ...(getColumnSearch("contact_number") as () => void),
    },
    {
      title: "Registration No.",
      dataIndex: "registration_number",
      key: "registration_number",
      ...(getColumnSearch(
        "registration_number",
        "",
        "registration number"
      ) as () => void),
    },
    {
      title: "Qualification",
      dataIndex: "qualification",
      key: "qualification",
      ...(getColumnSearch("qualification") as () => void),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* {canEdit && (
            <Switch
              size="small"
              checked={record.status}
              onChange={(checked) => updateCenterStatus(checked, record.id)}
            />
          )} */}
          {canEdit && (
            <EditPencil
              onClick={() =>
                Router.push(
                  `${DOCTOR_MANAGEMENT_ROUTE}/update-doctor-${record.id}`
                )
              }
            />
          )}
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              "Doctor ID": record?.external_id || EMPTY_PLACEHOLDER,
              "Doctor Name": record?.User?.username || EMPTY_PLACEHOLDER,
              "Registration No":
                record?.registration_number || EMPTY_PLACEHOLDER,
              Qualification: record?.qualification || EMPTY_PLACEHOLDER,
              Phone: record?.contact_number || EMPTY_PLACEHOLDER,
              Signature: <ViewFileLink fileUrl={record.signature} />,
            }}
          />
        </Space>
      ),
    },
  ];


  const ButtonComp = (
    <Space>
      <Button
        type="primary"
        size={componentSize}
        onClick={() => Router.push(`${DOCTOR_MANAGEMENT_ROUTE}/add-doctor`)}
      >
        Add Doctor
      </Button>
    </Space>
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        // hideTitle={true}
        MainComp={
          <>
            {loading ? (
              <TableContentLoaderWithProps
                rowHeight={70}
                columnWidth={[10, "2", 20, "2", 15, "2", 15, "2", 15, "2", 12]}
              />
            ) : (
              <TableWrapper
                className="mt-3"
                columns={columns}
                dataSource={data}
                scroll={tableScroll}
              />
            )}
          </>
        }
        ActionComp={canCreate ? ButtonComp : null}
      />
    </CardWrapper>
  );
};

export default DoctorManagement;
