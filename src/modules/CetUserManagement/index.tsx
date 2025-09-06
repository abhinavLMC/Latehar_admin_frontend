import { EditPencil } from "@components/Common";
import SearchComponent from "@components/Common/SearchComponent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { CET_USER_ROUTE, EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from "@constants/AppConstant";
import { TableProps, Space, Table, Button, Switch } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import { useGetRequestHandler, useUpdateHandler } from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";

const CenterMangement = () => {
const { tableScroll, componentSize } = useDevice();
const { canEdit, canCreate } = usePermission(pageNameArray[3]);

const { loading, data, fetchData } = useGetRequestHandler();

const { updateStatus } = useUpdateHandler("/api/cet-user-status-update");
const { getColumnSearch } = useSearchHook()

const getTableData = () => fetchData("/api/cet-user-list");


useEffect(() => {
  getTableData()
}, [])

  // center status update handler
  const updateCenterStatus = (status: boolean, id: string) => {
    updateStatus({ status, id }, getTableData);
  }

  const columns: TableProps["columns"] = [
    {
      title: "Cet ID",
      dataIndex: "cetManagement",
      ...(getColumnSearch("external_id", "cetManagement", "") as () => void),
      render: (cet) => cet?.external_id || EMPTY_PLACEHOLDER,
    },
    {
      title: "Name",
      dataIndex: "user",
      ...(getColumnSearch("name", "user", "name") as () => void),
      render: (user) => user?.name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Center Name",
      dataIndex: "cetManagement",
      ...(getColumnSearch(
        "name",
        "cetManagement",
        "center name"
      ) as () => void),
      render: (cet) => cet?.name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Email",
      dataIndex: "user",
      ...(getColumnSearch("email", "user", "email") as () => void),
      render: (user) => user?.email || EMPTY_PLACEHOLDER,
    },

    {
      title: "Phone",
      dataIndex: "user",
      ...(getColumnSearch("phone", "user", "phone") as () => void),
      render: (user) => user?.phone || EMPTY_PLACEHOLDER,
    },
    {
      title: "Action",
      key: "action",
      render: (_, { cetManagement, user, user_id, signature }) => (
        <Space size="middle">
          {canEdit && (
            <Switch
              size="small"
              checked={user.status}
              onChange={(checked) => updateCenterStatus(checked, user_id)}
            />
          )}
          {canEdit && (
            <EditPencil
              onClick={() =>
                Router.push(`${CET_USER_ROUTE}/update-cet-user-${user_id}`)
              }
            />
          )}
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              Name: user?.name || EMPTY_PLACEHOLDER,
              Email: user?.email || EMPTY_PLACEHOLDER,
              Username: user?.username || EMPTY_PLACEHOLDER,
              Phone: user?.phone || EMPTY_PLACEHOLDER,
              "Cet ID": cetManagement?.external_id || EMPTY_PLACEHOLDER,
              "Cet Name": cetManagement?.name || EMPTY_PLACEHOLDER,
              "Cet Address":
                cetManagement?.registeredAddress || EMPTY_PLACEHOLDER,
              "Cet Correspondence Address":
                cetManagement?.correspondenceAddress || EMPTY_PLACEHOLDER,
              "Cet Contact": cetManagement?.contactNumber || EMPTY_PLACEHOLDER,
              "Cet Spoc Name": cetManagement?.spocName || EMPTY_PLACEHOLDER,
              "Cet Spoc Email": cetManagement?.spocEmail || EMPTY_PLACEHOLDER,
              "Cet Spoc Whatsapp":
                cetManagement?.spocWhatsappNumber || EMPTY_PLACEHOLDER,
            }}
          />
        </Space>
      ),
    },
  ];

  const SearchBox = <SearchComponent />;

  const ButtonComp = canCreate ? (
    <Space>
      <Button
        type="primary"
        size={componentSize}
        onClick={() => Router.push(`${CET_USER_ROUTE}/add-cet-user`)}
      >
        Add CET User
      </Button>
    </Space>
  ) : null;

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
        ActionComp={ButtonComp}
      />
    </CardWrapper>
  );
};

export default CenterMangement;
