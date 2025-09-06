import { EditPencil } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from "@constants/AppConstant";
import { TableProps,  Space, Table, Button, Switch } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import { useGetRequestHandler, useUpdateHandler } from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";

interface DataType {
  status: boolean | undefined;
  email: string;
  name: string;
  id: string;
  role: {
    role_title: string;
    slug: string;
  };
  permission: {
    permission_name: string
  }
  key: string;
  username: string;
  phone: string;
}

const AdminUser = () => {
  const { tableScroll, componentSize } = useDevice();
  const { getColumnSearch } = useSearchHook()
  const { canEdit, canCreate} = usePermission(pageNameArray[1]);

  // to get the initial data
  const { loading, data, fetchData } = useGetRequestHandler();

  // for toggle update
  const {updateStatus} = useUpdateHandler("/api/update-admin-user-status" )

  // fetch initial table data
  const getTableData = () => {
    return fetchData("/api/user-list");
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
      title: "Admin User",
      dataIndex: EXTERNAL_ID,
      key: EXTERNAL_ID,
      ...(getColumnSearch(EXTERNAL_ID, "", "Admin User") as () => void),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...(getColumnSearch("name") as () => void),
      render: (_, { name, permission }) => (
        <Space className="">
          <div className="name-container">
            <p>{name || EMPTY_PLACEHOLDER}</p>
            <p className="fs-7">
              {permission?.permission_name || EMPTY_PLACEHOLDER}
            </p>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...(getColumnSearch("email") as () => void),
      render: (_, { email }) => email || EMPTY_PLACEHOLDER,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ...(getColumnSearch("username") as () => void),
      render: (_, { username }) => username || EMPTY_PLACEHOLDER,
    },
    {
      title: "Phone",
      key: "phone",
      dataIndex: "phone",
      ...(getColumnSearch("phone") as () => void),
      render: (_, { phone }) => phone || EMPTY_PLACEHOLDER,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {canEdit && <Switch
            size="small"
            checked={record.status}
            onChange={(checked) => updateCenterStatus(checked, record.id)}
          />
          }
          {canEdit && <EditPencil
            onClick={() => Router.push(`/admin-user/update-user-${record.id}`)}
          />
          }
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              ID: record?.id,
              Name: record?.name || EMPTY_PLACEHOLDER,
              Email: record?.email || EMPTY_PLACEHOLDER,
              Phone: record?.phone || EMPTY_PLACEHOLDER,
              Username: record?.username || EMPTY_PLACEHOLDER,
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
        onClick={() => Router.push("/admin-user/add-admin-user")}
      >
        Add Admin User
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

export default AdminUser;
