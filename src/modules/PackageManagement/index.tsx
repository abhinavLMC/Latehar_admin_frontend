import { EditPencil } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from "@constants/AppConstant";
import { TableProps, Space, Table, Button, Switch } from "antd";
import { lowerCase, upperFirst } from "lodash";
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
  package_type: string;
  external_id: string;
  id: string;
  status: boolean | undefined;
  package_id: string;
  package_name: string;
  package_list: string[];
}

const PackageManagementComponent = () => {
  const { tableScroll, componentSize } = useDevice();
  const { canEdit, canCreate } = usePermission(pageNameArray[5]);

  const { loading, fetchData, data } = useGetRequestHandler();
  const { getColumnSearch } = useSearchHook();
  const { updateStatus } = useUpdateHandler("/api/package-status-update");

  useEffect(() => {
    fetchData("/api/package-list", {});
  }, []);

  // center status update handler
  const updatePackageStatus = (status: boolean, id: string) => {
    updateStatus({ status, id }, () => fetchData("/api/package-list"));
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Package ID",
      dataIndex: EXTERNAL_ID,
      key: EXTERNAL_ID,
      ...(getColumnSearch(EXTERNAL_ID, "", "Package ID") as () => void),
    },
    {
      title: "Package Name",
      dataIndex: "package_name",
      key: "package_name",
      ...(getColumnSearch("package_name", "", "package") as () => void),
      width: '25%'
    },
    {
      title: "Plan Type",
      dataIndex: "package_type",
      key: "package_type",
      ...(getColumnSearch("package_type", "", "package type") as () => void),
      width: '25%'
    },
    {
      title: "Number Of Tests",
      dataIndex: "package_list",
      key: "package_list",
      render: (text) => text?.length,
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
              onChange={(checked) => updatePackageStatus(checked, record.id)}
            />
          )}
          {canEdit && (
            <EditPencil
              onClick={() =>
                Router.push(`/package-management/update-package-${record.id}`)
              }
            />
          )}
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              "Package Name": record?.package_name || EMPTY_PLACEHOLDER,
              "Package ID": record?.external_id || EMPTY_PLACEHOLDER,
              "Plan Type": record?.package_type || EMPTY_PLACEHOLDER,
              "Package List":
                record?.package_list
                  ?.map((item) => upperFirst(lowerCase(item)))
                  ?.join(", ") || EMPTY_PLACEHOLDER,
              "Number Of Tests":
                record?.package_list?.length || EMPTY_PLACEHOLDER,
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
        onClick={() => Router.push("/package-management/add-package")}
      >
        Add Package
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

export default PackageManagementComponent;
