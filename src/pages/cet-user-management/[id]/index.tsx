import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import ModifyCetUserManagement from '@modules/CetUserManagement/ModifyCetUserManagement'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const CetUserEditManagement = () => {
  const { canModify, loading } = usePermission(pageNameArray[3]);
  return canModify ? (
    <ModifyCetUserManagement />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
}

export default CetUserEditManagement