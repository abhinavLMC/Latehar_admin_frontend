import NotFoundPage from "@components/Common/NotFoundPage";
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from "@constants/AppConstant";
import ModifyCenterManagement from "@modules/CenterManagement/ModifyCenterManagement";
import React from "react";
import usePermission from "src/hook/usePermission";

const CenterManage = () => {
  const { canModify, loading } = usePermission(pageNameArray[2]);

  return canModify ? (
    <ModifyCenterManagement />
  ) : (
    <NotFoundPage
      status={403}
      message={NO_VIEW_PERMISSION_MSG}
      loading={loading}
    />
  );
};

export default CenterManage;
