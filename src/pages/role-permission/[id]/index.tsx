import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import ModifyRolePermission from '@modules/UserRolesPermission/ModifyRolePermission'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const EditRolePermission = () => {
  const { canModify, loading } = usePermission(pageNameArray[0]);
  return canModify ? (
    <ModifyRolePermission />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
}

export default EditRolePermission