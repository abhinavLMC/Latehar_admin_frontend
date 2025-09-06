import NotFoundPage from "@components/Common/NotFoundPage";
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from "@constants/AppConstant";
import ModifyPackage from "@modules/PackageManagement/ModifyPackage"
import React from 'react'
import usePermission from "src/hook/usePermission";

const PackageManagementEdit = () => {
  const { canModify, loading } = usePermission(pageNameArray[5]);
  return canModify ? (
    <ModifyPackage />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
}

export default PackageManagementEdit