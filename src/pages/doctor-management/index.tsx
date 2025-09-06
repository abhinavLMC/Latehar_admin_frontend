import NotFoundPage from '@components/Common/NotFoundPage';
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from '@constants/AppConstant';
import DoctorManagement from '@modules/DoctorManagement';
import React from 'react'
import usePermission from 'src/hook/usePermission';

const AdminUserPage = () => {
  const { canView, loading } = usePermission(pageNameArray[1]);
  return canView ? (
    <DoctorManagement />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default AdminUserPage