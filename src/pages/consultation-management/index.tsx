import React from "react";
import ConsultationManagement from "@modules/ConsultationManagement"; // Import the module
import usePermission from "src/hook/usePermission";
import { pageNameArray } from "@constants/AppConstant";

const ConsultationManagementPage = () => {
    const { canView, loading } = usePermission(pageNameArray[14]); // Update index as per your `pageNameArray`

  return <ConsultationManagement />;
};

export default ConsultationManagementPage;
