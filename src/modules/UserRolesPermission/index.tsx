import { EditOutlined, LockOutlined } from "@ant-design/icons";
import { EditPencil } from "@components/Common";
import SearchComponent from "@components/Common/SearchComponent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import { EMPTY_PLACEHOLDER, ROLE_PERMISSION_ROUTE, pageNameArray } from "@constants/AppConstant";
import { TableProps, Tag, Space, Table, Button, Card, Switch } from "antd";
import Router from "next/router";
import React, { useEffect } from "react";
import { useGetRequestHandler } from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from 'src/hook/useSearch';

interface DataType {
  id: string;
  permission_name: string;
  Role: {
    id: string;
    role_title: string;
    slug: string;
  };
}

const UserRolePermissionComp = () => {
  const { tableScroll, componentSize } = useDevice();
  const { canCreate, canEdit } = usePermission(pageNameArray[0]);
  const { getColumnSearch } = useSearchHook()
  const { loading, data, fetchData } = useGetRequestHandler();

  useEffect(() => {
    fetchData("/api/view-permission");
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Permission Name",
      dataIndex: "permission_name",
      key: "permission_name",
      ...getColumnSearch('permission_name', '', 'permission') as () => void,
    },
    {
      title: "Role Type",
      ...getColumnSearch('role_title', 'Role', 'role type') as () => void,
      render: (_, { Role }) => Role?.role_title || EMPTY_PLACEHOLDER,
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        canEdit && <Space size="middle">
          <EditPencil
            onClick={() =>
              Router.push(
                `${ROLE_PERMISSION_ROUTE}/update-permission-${record.id}`
              )
            }
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
          Router.push(`${ROLE_PERMISSION_ROUTE}/add-role-permission`)
        }
      >
        Add User Role
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
        ActionComp={ canCreate ? ButtonComp : null}
      />
    </CardWrapper>
  );
};

export default UserRolePermissionComp;
