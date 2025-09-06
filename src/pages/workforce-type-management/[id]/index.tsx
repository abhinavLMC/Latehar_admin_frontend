import NotFoundPage from '@components/Common/NotFoundPage';
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from '@constants/AppConstant';
import ModifyWorkforceManagementComp from '@modules/WorkforceTypeManagement/ModifyWorkforceTypeManagement';

import React from 'react'
import usePermission from 'src/hook/usePermission';

const DoctorManagementEdit = () => {
  const { canModify, loading } = usePermission(pageNameArray[1]);
  return (
    <ModifyWorkforceManagementComp />
    // canModify ? <ModifyWorkforceManagementComp /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default DoctorManagementEdit