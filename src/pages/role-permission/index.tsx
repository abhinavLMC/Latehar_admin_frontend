import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import UserRolePermissionComp from '@modules/UserRolesPermission'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const RolePermissionPage = () => {
  const { canView, loading } = usePermission(pageNameArray[0]);
  return canView ? (
    <UserRolePermissionComp />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default RolePermissionPage