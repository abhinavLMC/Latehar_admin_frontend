import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import PackageManagementComponent from '@modules/PackageManagement'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const PackageManagePage = () => {
  const { canView, loading } = usePermission(pageNameArray[5]);
  return canView ? (
    <PackageManagementComponent />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default PackageManagePage