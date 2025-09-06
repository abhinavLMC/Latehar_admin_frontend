import { EditPencil } from "@components/Common";
import SearchComponent from "@components/Common/SearchComponent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from "@constants/AppConstant";
import { renderAllDetails } from "@utils/commonFunctions";
import { TableProps, Space, Table, Button, Switch } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import {
  useGetRequestHandler,
  useUpdateHandler,
} from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";

interface DataType {
  project_signed_agreement_file: string;
  external_id: string;
  agency_spoc_email: string;
  agency_spoc_contact_number: string;
  agency_address: string;
  project_address: string;
  status: boolean | undefined;
  id: string;
  project_unique_id: string;
  project_name: string;
  agency_name: string;
  agency_spoc_name: string;
}

const CenterManagement = () => {
  const { tableScroll } = useDevice();
  const { canEdit, canCreate } = usePermission(pageNameArray[2]);

  const { updateStatus } = useUpdateHandler("/api/update-center-status");
  const { getColumnSearch } = useSearchHook();
  const { loading, data, fetchData } = useGetRequestHandler();

  const getTableData = () => fetchData("/api/center-manage-view");

  useEffect(() => {
    getTableData();
  }, []);

  // center status update handler
  const updateCenterStatus = (status: boolean, id: string) => {
    updateStatus({ status, id }, getTableData);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Center ID",
      dataIndex: EXTERNAL_ID,
      key: EXTERNAL_ID,
      ...(getColumnSearch(EXTERNAL_ID, "", "Center ID") as () => void),
    },
    {
      title: "Center Name",
      dataIndex: "project_name",
      key: "project_name",
      ...(getColumnSearch("project_name", "", "center name") as () => void),
      render: (text) => text || EMPTY_PLACEHOLDER,
    },
    {
      title: "Agency Name",
      dataIndex: "agency_name",
      key: "agency_name",
      ...(getColumnSearch("agency_name", "", "agency name") as () => void),
    },
    {
      title: "Spoc Name",
      dataIndex: "agency_spoc_name",
      key: "agency_spoc_name",
      ...(getColumnSearch("agency_spoc_name", "", "spoc name") as () => void),
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
                Router.push(`/center-management/update-center-${record.id}`)
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
                "project_signed_agreement_file",
              ]),
              "Project Signed Agreement File": (
                <ViewFileLink fileUrl={record?.project_signed_agreement_file} />
              ),
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
        onClick={() => Router.push("/center-management/add-center")}
      >
        Add Center
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

export default CenterManagement;
