import { EditOutlined } from '@ant-design/icons';
import { postRequest } from '@api/preference/RequestService';
import { EditPencil } from '@components/Common';
import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import ViewDetailsModal from '@components/Common/ViewDetailsModal';
import DynamicPageLayout from '@components/DynamicPageLayout';
import { CardWrapper, TableWrapper } from '@components/Wrapper';
import { API_COMMON_ADMIN_URL } from '@constants/ApiConstant';
import { CENTER_WISE_PACKAGE_ROUTE, EMPTY_PLACEHOLDER, EXTERNAL_ID, pageNameArray } from '@constants/AppConstant';
import { TableProps, Tag, Space, Table, Button, Card, Switch } from 'antd';
import { upperFirst, lowerCase } from 'lodash';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useGetRequestHandler, useUpdateHandler } from 'src/hook/requestHandler';
import useDevice from 'src/hook/useDevice';
import usePermission from 'src/hook/usePermission';
import useSearchHook from 'src/hook/useSearch';
interface DataType {
  external_id: string;
  agency_name: string;
  agency_address: string;
  agency_spoc_name: string;
  agency_spoc_contact_number: string;
  agency_spoc_email: string;
  id: string
  package_price: string;
  package_frequency: string;
  package_id: string;
  center: {
    agency_address: string;
    agency_spoc_name: string;
    agency_spoc_contact_number: string;
    agency_spoc_email: string;
    agency_name: string;
    project_address: string;
    project_name: string;
  };
  package: {
    package_list: string[];
    package_price: string;
    package_name: string;
  };
  status: boolean
}

const CenterWisePackageComp = () => {
  const { tableScroll } = useDevice();
  const { getColumnSearch } = useSearchHook();
  const { canEdit, canCreate } = usePermission(pageNameArray[6]);
  
  const { loading, data, fetchData } = useGetRequestHandler();
  const { updateStatus } = useUpdateHandler(
    "/api/center-package-status-update"
  );

  useEffect(() => {
    fetchData("/api/center-package-view");
  }, []);

  // center status update handler
  const updateCenterPackageStatus = (status: boolean, id: string) => {
    updateStatus({ status, id }, () => fetchData("/api/center-package-view"));
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Center Package ID",
      dataIndex: EXTERNAL_ID,
      key: EXTERNAL_ID,
      ...(getColumnSearch(EXTERNAL_ID, "", "Center Package ID") as () => void),
    },
    {
      title: "Center Name",
      dataIndex: "center_name",
      key: "center_name",
      ...(getColumnSearch(
        "project_name",
        "center",
        "center name"
      ) as () => void),
      render: (_, { center }) => center?.project_name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Package Name",
      dataIndex: "package_name",
      key: "package_name",
      ...(getColumnSearch(
        "package_name",
        "package",
        "package name"
      ) as () => void),
      render: (_, record) => record?.package?.package_name || EMPTY_PLACEHOLDER,
    },
    {
      title: "Price",
      dataIndex: "package_price",
      ...(getColumnSearch("package_price", "", "package price") as () => void),
      key: "package_price",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {canEdit && <Switch
            size="small"
            checked={record.status}
            onChange={(checked) =>
              updateCenterPackageStatus(checked, record.id)
            }
          />}
          {canEdit && <EditPencil
            onClick={() =>
              Router.push(
                `${CENTER_WISE_PACKAGE_ROUTE}/update-cwp-${record.id}`
              )
            }
          />
          }
          <ViewDetailsModal
            // title="Admin User"
            viewData={{
              "Center Package ID": record?.external_id || EMPTY_PLACEHOLDER,
              "Package Name":
                record?.package?.package_name || EMPTY_PLACEHOLDER,
              "Package Price": record?.package_price || EMPTY_PLACEHOLDER,
              "Package Frequency":
                record?.package_frequency || EMPTY_PLACEHOLDER,
              "Package List":
                record?.package?.package_list
                  ?.map((item: string) => upperFirst(lowerCase(item)))
                  ?.join(", ") || EMPTY_PLACEHOLDER,
              "Center Name": record?.center?.project_name || EMPTY_PLACEHOLDER,
              "Center Address":
                record?.center?.project_address || EMPTY_PLACEHOLDER,
              "Agency Name": record?.center?.agency_name || EMPTY_PLACEHOLDER,
              "Agency Address": record?.center?.agency_address || EMPTY_PLACEHOLDER,
              "Spoc Name": record?.center?.agency_spoc_name || EMPTY_PLACEHOLDER,
              "Spoc Contact":
                record?.center?.agency_spoc_contact_number || EMPTY_PLACEHOLDER,
              "Spoc Email": record?.center?.agency_spoc_email || EMPTY_PLACEHOLDER,
            }}
          />
        </Space>
      ),
    },
  ];

  const ButtonComp = (
    <Button
      type="primary"
      size="large"
      onClick={() =>
        Router.push(`${CENTER_WISE_PACKAGE_ROUTE}/add-center-wise-package`)
      }
    >
      Add CWP
    </Button>
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        // hideTitle={true}
        MainComp={
          loading ? (
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
          )
        }
        ActionComp={canCreate ? ButtonComp : null}
      />
    </CardWrapper>
  );
}

export default CenterWisePackageComp