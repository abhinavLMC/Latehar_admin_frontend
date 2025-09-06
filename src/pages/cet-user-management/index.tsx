import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import CetUserManagement from '@modules/CetUserManagement'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const CetUserManagementPage = () => {
  const { canView, loading } = usePermission(pageNameArray[3]);
  return canView ? (
    <CetUserManagement />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default CetUserManagementPage