import NotFoundPage from '@components/Common/NotFoundPage';
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from '@constants/AppConstant';
import ModifyAdminUser from '@modules/AdminUser/ModifyAdminUser'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const AdminUserEdit = () => {
  const { canModify, loading } = usePermission(pageNameArray[1]);
  return (
    canModify ? <ModifyAdminUser /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} /> 
  )
}

export default AdminUserEdit