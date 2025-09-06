import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import TestMaster from '@modules/TestMaster'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const CenterUserPage = () => {
  const { canView, loading } = usePermission(pageNameArray[4]);
  return canView ? (
    <TestMaster />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default CenterUserPage