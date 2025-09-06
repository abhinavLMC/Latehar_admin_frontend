import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import CetManagement from '@modules/CetManagement'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const CetManagementPage = () => {
  const { canView, loading } = usePermission(pageNameArray[2]);
  return canView ? (
    <CetManagement />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default CetManagementPage