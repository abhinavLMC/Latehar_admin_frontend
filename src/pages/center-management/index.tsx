import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import CenterManagement from '@modules/CenterManagement'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const CenterManagePage = () => {
  const { canView, loading } = usePermission(pageNameArray[2]);
  return canView ? (
    <CenterManagement />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default CenterManagePage