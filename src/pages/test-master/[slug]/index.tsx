import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import TestDetailsForm from '@modules/TestMaster/TestDetailsForm'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const UserEdit = () => {
  const { canModify, loading } = usePermission(pageNameArray[4]);
  return canModify ? (
    <TestDetailsForm />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
}

export default UserEdit