import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import ModifyCenterWisePackageComp from '@modules/CenterWisePackage/ModifyCenterWisePackage'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const EditCenterWisePackage = () => {
  const { canModify, loading } = usePermission(pageNameArray[6]);
  return canModify ? (
    <ModifyCenterWisePackageComp />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
}

export default EditCenterWisePackage