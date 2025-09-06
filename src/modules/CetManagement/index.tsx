import { MenuOutlined } from "@ant-design/icons";
import { EditPencil } from "@components/Common";
import SearchComponent from "@components/Common/SearchComponent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { CET_MANAGEMENT_ROUTE, EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from "@constants/AppConstant";
import { renderAllDetails } from "@utils/commonFunctions";
import { TableProps, Space, Table, Button, Switch, Dropdown } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import {
  useGetRequestHandler,
  useUpdateHandler,
} from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";
import { DataType } from "./types";

const CetManagementComp = () => {
  const { tableScroll } = useDevice();
  const { canEdit, canCreate } = usePermission(pageNameArray[2]);

  const { updateStatus } = useUpdateHandler("/api/update-center-status");
  const { getColumnSearch } = useSearchHook();
  const { loading, data, fetchData } = useGetRequestHandler();

  const getTableData = () => fetchData("/api/cet-list");

  useEffect(() => {
    getTableData();
  }, []);

  // center status update handler
  const updateCenterStatus = (status: boolean, id: string) => {
    updateStatus({ status, id }, getTableData);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "CET ID",
      dataIndex: EXTERNAL_ID,
      key: EXTERNAL_ID,
      ...(getColumnSearch(EXTERNAL_ID, "", "CET ID") as () => void),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...(getColumnSearch("name", "") as () => void),
    },
    {
      title: "Contact No",
      dataIndex: "contactNumber",
      key: "contactNumber",
      ...(getColumnSearch("contactNumber", "", "contact no") as () => void),
    },
    {
      title: "Spoc Name",
      dataIndex: "spocName",
      key: "spocName",
      ...(getColumnSearch("spocName", "", "SPOC name") as () => void),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {canEdit && (
            <Switch
              size="small"
              checked={record.status}
              onChange={(checked) => updateCenterStatus(checked, record.id)}
            />
          )}
          {canEdit && (
            <EditPencil
              onClick={() =>
                Router.push(
                  `${CET_MANAGEMENT_ROUTE}/update-cet-management-${record.id}`
                )
              }
            />
          )}
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              "Center ID": record?.external_id,
              ...renderAllDetails(record, [
                "id",
                "createdBy",
                "project_unique_id",
                "status",
                "short_code",
                "external_id",
                "center_id",
                "uniqueId",
              ]),
              // "Project Signed Agreement File": (
              //   <ViewFileLink fileUrl={record?.project_signed_agreement_file} />
              // ),
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
        size="large"
        onClick={() => Router.push(`/${CET_MANAGEMENT_ROUTE}/add-cet`)}
      >
        Add CET
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
                rowKey={"id"}
              />
            )}
          </>
        }
        ActionComp={canCreate ? ButtonComp : null}
      />
    </CardWrapper>
  );
};

export default CetManagementComp;
