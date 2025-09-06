import NotFoundPage from '@components/Common/NotFoundPage';
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from '@constants/AppConstant';
import ModifyDoctorManagement from '@modules/DoctorManagement/ModifyDoctorManagement';

import React from 'react'
import usePermission from 'src/hook/usePermission';

const DoctorManagementEdit = () => {
  const { canModify, loading } = usePermission(pageNameArray[1]);
  return (
    canModify ? <ModifyDoctorManagement /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} /> 
  )
}

export default DoctorManagementEdit