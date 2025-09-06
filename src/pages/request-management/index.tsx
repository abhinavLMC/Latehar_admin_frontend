import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import RequestManagement from '@modules/RequestManagement';
import React from 'react';
import usePermission from 'src/hook/usePermission';

const RequestManagementPage = () => {
  const { canView, loading } = usePermission(pageNameArray[13]); // Update index as per your `pageNameArray`
  return (
    <RequestManagement />
  )
};

export default RequestManagementPage;
