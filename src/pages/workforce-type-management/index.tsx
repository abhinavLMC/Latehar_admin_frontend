import NotFoundPage from '@components/Common/NotFoundPage';
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from '@constants/AppConstant';
import WorkforceTypeManagementComp from '@modules/WorkforceTypeManagement';
import React from 'react'
import usePermission from 'src/hook/usePermission';

const WorkforceTypeManagementPage = () => {
  const { canView, loading } = usePermission(pageNameArray[1]);
  return canView ? (
    <WorkforceTypeManagementComp />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default WorkforceTypeManagementPage