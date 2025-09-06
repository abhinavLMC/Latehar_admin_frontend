import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import ViewDetailsModal from '@components/Common/ViewDetailsModal';
import DynamicPageLayout from '@components/DynamicPageLayout';
import { CardWrapper, TableWrapper } from '@components/Wrapper';
import { pageNameArray, EMPTY_PLACEHOLDER } from '@constants/AppConstant';
import { TableProps, Space } from 'antd';
import { startCase } from 'lodash';
import React, { useEffect } from 'react'
import { useGetRequestHandler } from 'src/hook/requestHandler';
import usePermission from 'src/hook/usePermission';
import useSearchHook from 'src/hook/useSearch';

interface DataType {
    "id": string,
    "user_id": string,
    "action_type": string,
    "action_description": string
    "action_time": string,
    "User": {
        "id": string,
        "username": string,
        "email": string
    }
}

const UserLogComponent = () => {
  const { canEdit, canCreate } = usePermission(pageNameArray[7]);

  const { loading, data, fetchData } = useGetRequestHandler();
  const { getColumnSearch } = useSearchHook();

  const getTableData = () => fetchData("/api/user-logs");

  useEffect(() => {
    getTableData();
  }, []);

  const columns: TableProps["columns"] = [
    {
      title: "Username",
      ...(getColumnSearch("username", "User") as () => void),
      render: (_, { User }) => User?.username || EMPTY_PLACEHOLDER,
      width: "20%",
    },
    {
      title: "Email",
      ...(getColumnSearch("email", "User") as () => void),
      render: (_, { User }) => User?.email || EMPTY_PLACEHOLDER,
      width: "25%",
    },
    {
      title: "Action Type",
      dataIndex: "action_type",
      key: "action_type",
      width: "30%",
      ...(getColumnSearch("action_type", "", "Action type") as () => void),
      render: (text) => startCase(text),
    },
    {
      title: "Action Time",
      dataIndex: "action_time",
      key: "action_time",
      ...(getColumnSearch("action_time", "", "Action time") as () => void),
      render: (text) => text,
      width: "15%",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              Username: record?.User?.username || EMPTY_PLACEHOLDER,
              Email: record?.User?.email || EMPTY_PLACEHOLDER,
              "Action Time": record?.action_time || EMPTY_PLACEHOLDER,
              "Action Type": record?.action_type || EMPTY_PLACEHOLDER,
              "Action Description": EMPTY_PLACEHOLDER,
            }}
          />
        </Space>
      ),
    },
  ];

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
              />
            )}
          </>
        }
      />
    </CardWrapper>
  );
};

export default UserLogComponent