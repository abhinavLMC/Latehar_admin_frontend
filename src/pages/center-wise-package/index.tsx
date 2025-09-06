import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import CenterWisePackageComp from '@modules/CenterWisePackage';
import React from 'react'
import usePermission from 'src/hook/usePermission';

const CenterWisePackage = () => {
  const { canView, loading } = usePermission(pageNameArray[6]);
  return canView ? (
    <CenterWisePackageComp />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default CenterWisePackage