import { EditPencil } from "@components/Common";
import SearchComponent from "@components/Common/SearchComponent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { CENTER_USER_ROUTE, EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from "@constants/AppConstant";
import { TableProps, Space, Table, Button, Switch } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import { useGetRequestHandler, useUpdateHandler } from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";

const CenterUserComp = () => {
const { tableScroll, componentSize } = useDevice();
const { canEdit, canCreate } = usePermission(pageNameArray[3]);

const { loading, data, fetchData } = useGetRequestHandler();
const {updateStatus} = useUpdateHandler("/api/update-center-user-status" )
const { getColumnSearch } = useSearchHook()

const getTableData = () => fetchData("/api/center-user-list");

useEffect(() => {
  getTableData()
}, [])

  // center status update handler
  const updateCenterStatus = (status: boolean, id: string) => {
    updateStatus({ status, id }, getTableData);
  }

  const columns: TableProps["columns"] = [
    {
      title: "Center User ID",
      dataIndex: "user",
      key: "user",
      ...(getColumnSearch(EXTERNAL_ID, "user", "Center User ID") as () => void),
      render: (user) => user[EXTERNAL_ID],
    },
    {
      title: "Center Name",
      ...(getColumnSearch(
        "project_name",
        "center",
        "center name"
      ) as () => void),
      render: (_, { center }) => center?.project_name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Name",
      ...(getColumnSearch("name", "user") as () => void),
      render: (_, { user }) => user?.name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Username",
      ...(getColumnSearch("username", "user") as () => void),
      render: (_, { user }) => user?.username || EMPTY_PLACEHOLDER,
    },
    {
      title: "Phone",
      ...(getColumnSearch("phone", "user") as () => void),
      render: (_, { user }) => user?.phone || EMPTY_PLACEHOLDER,
    },
    {
      title: "Action",
      key: "action",
      render: (_, { center, user, user_id, signature }) => (
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
                Router.push(
                  `${CENTER_USER_ROUTE}/update-center-user-${user.id}`
                )
              }
            />
          )}
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              "Center User ID": user?.external_id || EMPTY_PLACEHOLDER,
              Name: user?.name || EMPTY_PLACEHOLDER,
              Email: user?.email || EMPTY_PLACEHOLDER,
              Username: user?.username || EMPTY_PLACEHOLDER,
              "Center Name": center?.project_name || EMPTY_PLACEHOLDER,
              "Center Address": center?.project_address || EMPTY_PLACEHOLDER,
              "Agency Name": center?.agency_name || EMPTY_PLACEHOLDER,
              "Agency Address": center?.agency_address || EMPTY_PLACEHOLDER,
              "Spoc Name": center?.agency_spoc_name || EMPTY_PLACEHOLDER,
              "Spoc Contact":
                center?.agency_spoc_contact_number || EMPTY_PLACEHOLDER,
              "Spoc Email": center?.agency_spoc_email || EMPTY_PLACEHOLDER,
              Signature: <ViewFileLink fileUrl={signature} />,
            }}
          />
        </Space>
      ),
    },
  ];

  const SearchBox = <SearchComponent />;

  const ButtonComp = (
    canCreate ? <Space>
      <Button
        type="primary"
        size={componentSize}
        onClick={() => Router.push(`${CENTER_USER_ROUTE}/add-center-user`)}
      >
        Add Center User
      </Button>
    </Space> : null
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
        ActionComp={ButtonComp}
      />
    </CardWrapper>
  );
};

export default CenterUserComp;
