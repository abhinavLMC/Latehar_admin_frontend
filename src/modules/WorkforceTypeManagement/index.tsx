import { EditPencil } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { DOCTOR_MANAGEMENT_ROUTE, EMPTY_PLACEHOLDER, EXTERNAL_ID, WORKFORCE_TYPE_MANAGEMENT_ROUTE, pageNameArray } from "@constants/AppConstant";
import { TableProps,  Space, Table, Button, Switch } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import { useGetRequestHandler, useUpdateHandler } from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";

interface DataType {
  id: string;
  full_name: string;
  short_name: string;
  isActive: boolean;
}

const WorkforceTypeManagementComp = () => {
  const { tableScroll, componentSize } = useDevice();
  const { getColumnSearch } = useSearchHook()
  const { canEdit, canCreate} = usePermission(pageNameArray[1]);

  // to get the initial data
  const { loading, data, fetchData } = useGetRequestHandler();

  // for toggle update
  const { updateStatus } = useUpdateHandler("/api/workforce-type-status");

  // fetch initial table data
  const getTableData = () => {
    return fetchData("/api/workforce-type-list");
  }

  useEffect(() => {
    getTableData()
  }, [])

    // admin user status update handler
  const updateCenterStatus = (isActive: boolean, id: string) => {
    updateStatus({ isActive, id }, () => getTableData());
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Workforce Type",
      dataIndex: "full_name",
      key: "full_name",
      ...(getColumnSearch("full_name", "", "Type") as () => void),
    },
    {
      title: "Workforce Short Code",
      dataIndex: "short_name",
      key: "short_name",
      ...(getColumnSearch("short_name", "", "Short Code") as () => void),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {canEdit && (
            <Switch
              size="small"
              checked={record.isActive}
              onChange={(checked) => updateCenterStatus(checked, record.id)}
            />
          )}
          {canEdit && (
            <EditPencil
              onClick={() =>
                Router.push(
                  `${WORKFORCE_TYPE_MANAGEMENT_ROUTE}/update-workforce-type-${record.id}`
                )
              }
            />
          )}
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              "Workforce Type": record?.full_name || EMPTY_PLACEHOLDER,
              "Workforce Short Code": record?.short_name || EMPTY_PLACEHOLDER,
              Status: record?.isActive.toString() || EMPTY_PLACEHOLDER,
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
        onClick={() =>
          Router.push(`${WORKFORCE_TYPE_MANAGEMENT_ROUTE}/add-workforce-type`)
        }
      >
        Add Type
      </Button>
    </Space>
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        customTitle="Workforce Type"
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

export default WorkforceTypeManagementComp;
