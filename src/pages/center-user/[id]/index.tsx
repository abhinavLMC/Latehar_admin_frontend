import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import ModifyCenterUser from '@modules/CenterUser/ModifyCenterUser'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const UserEdit = () => {
  const { canModify, loading } = usePermission(pageNameArray[3]);
  return canModify ? (
    <ModifyCenterUser />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
}

export default UserEdit