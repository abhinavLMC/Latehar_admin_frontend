import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import UserLogComponent from '@modules/UserLogHistory';
import React from 'react'
import usePermission from 'src/hook/usePermission';

const UserLogHistory = () => {
  const { canView, loading } = usePermission(pageNameArray[7]);
  return canView ? (
    <UserLogComponent />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default UserLogHistory