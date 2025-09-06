import NotFoundPage from "@components/Common/NotFoundPage";
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from "@constants/AppConstant";
import ModifyCetManagement from "@modules/CetManagement/ModifyCetManagement";
import React from "react";
import usePermission from "src/hook/usePermission";

const CetModifyManagementPage = () => {
  const { canModify, loading } = usePermission(pageNameArray[2]);

  return canModify ? (
    <ModifyCetManagement />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
};

export default CetModifyManagementPage;
