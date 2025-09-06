import env from "@configs/EnvironmentConfig";

export const API_BASE_URL = env.API_BASE_URL;
export const API_VERSION = env.API_BASE_VERSION;
export const MOBILE_API_BASE_URL = env.MOBILE_API_BASE_URL;


export const API_COMMON_CENTER_URL = `${API_BASE_URL}/${API_VERSION}/center`
export const API_COMMON_ADMIN_URL = `${API_BASE_URL}/${API_VERSION}/admin`;

export const ALL_API_OBJECT: { [key: string]: string} = {
  login: `${API_COMMON_ADMIN_URL}/login`,

  // for Role
  "role-view": `${API_COMMON_ADMIN_URL}/view/role`,

  // for Permission
  "view-permission": `${API_COMMON_ADMIN_URL}/view-permission`,
  "permission-details": `${API_COMMON_ADMIN_URL}/permission-details`,
  "permission-update": `${API_COMMON_ADMIN_URL}/permission-update`,
  "create-permission": `${API_COMMON_ADMIN_URL}/create/user-permission`,

  // for admin user
  "user-list": `${API_COMMON_ADMIN_URL}/user/list`,
  "user-details": `${API_COMMON_ADMIN_URL}/user/details`,
  "admin-user-create": `${API_COMMON_ADMIN_URL}/create`,
  "admin-user-update": `${API_COMMON_ADMIN_URL}/user/update`,
  "update-admin-user-status": `${API_COMMON_ADMIN_URL}/user/status/update`,

  // for management center
  "center-manage-view": `${API_COMMON_ADMIN_URL}/view/center`,
  "center-manage-create": `${API_COMMON_ADMIN_URL}/create/center`,
  "center-manage-update": `${API_COMMON_ADMIN_URL}/update/center`,
  "center-user-edit": `${API_COMMON_ADMIN_URL}/edit/center`,
  "update-center-status": `${API_COMMON_ADMIN_URL}/update/center/status`,

  // for cet management
  "cet-create": `${API_COMMON_ADMIN_URL}/create/CET`,
  "cet-list": `${API_COMMON_ADMIN_URL}/view/CET`,
  "cet-details": `${API_COMMON_ADMIN_URL}/CET/details`,
  "cet-update": `${API_COMMON_ADMIN_URL}/CET/updateCET`,
  "cet-status-update": `${API_COMMON_ADMIN_URL}/CET/status/update`,

  // for center user
  "center-user-list": `${API_COMMON_ADMIN_URL}/center/user/view`,
  "add-center-user": `${API_COMMON_ADMIN_URL}/create-center-user`,
  "center-user-details": `${API_COMMON_ADMIN_URL}/center/user/details`,
  "center-user-update": `${API_COMMON_ADMIN_URL}/center/user/update`,
  "update-center-user-status": `${API_COMMON_ADMIN_URL}/update/center/user/status`,

  // for cet management
  "cet-user-create": `${API_COMMON_ADMIN_URL}/create-cet-user`,
  "cet-user-list": `${API_COMMON_ADMIN_URL}/cet/user/view`,
  "cet-user-details": `${API_COMMON_ADMIN_URL}/cet/user/details`,
  "cet-user-update": `${API_COMMON_ADMIN_URL}/cet/user/update`,
  "cet-user-status-update": `${API_COMMON_ADMIN_URL}/update/cet/user/status`,

  // Test master view
  "temperature-view": `${API_COMMON_ADMIN_URL}/view/temperature`,
  "spo2-view": `${API_COMMON_ADMIN_URL}/view/spo2`,
  "random-blood-sugar-view": `${API_COMMON_ADMIN_URL}/view/random-blood-sugar`,
  "pulse-view": `${API_COMMON_ADMIN_URL}/view/pulse`,
  "pft-view": `${API_COMMON_ADMIN_URL}/view/pft`,
  "hearing-view": `${API_COMMON_ADMIN_URL}/view/hearing`,
  "haemoglobin-view": `${API_COMMON_ADMIN_URL}/view/haemoglobin`,
  "cretenine-view": `${API_COMMON_ADMIN_URL}/view/cretenine`,
  "cholesterol-view": `${API_COMMON_ADMIN_URL}/view/cholesterol`,
  "bmi-view": `${API_COMMON_ADMIN_URL}/view/bmi`,
  "blood-pressure-view": `${API_COMMON_ADMIN_URL}/view/blood-pressure`,
  "alchol-view": `${API_COMMON_ADMIN_URL}/view/alchol`,
  "hiv-view": `${API_COMMON_ADMIN_URL}/view/hiv`,
  "eye-view": `${API_COMMON_ADMIN_URL}/view/eye`,
  "ecg-view": `${API_COMMON_ADMIN_URL}/view/ecg`,
  "blood-group-view": `${API_COMMON_ADMIN_URL}/view/blood-group`,
  "romberg-view": `${API_COMMON_ADMIN_URL}/view/romberg`,
  "vision-view": `${API_COMMON_ADMIN_URL}/view/vision`,

  // Test master update
  "temperature-update": `${API_COMMON_ADMIN_URL}/update/temperature`,
  "spo2-update": `${API_COMMON_ADMIN_URL}/update/spo2`,
  "random-blood-sugar-update": `${API_COMMON_ADMIN_URL}/update/random-blood-sugar`,
  "pulse-update": `${API_COMMON_ADMIN_URL}/update/pulse`,
  "pft-update": `${API_COMMON_ADMIN_URL}/update/pft`,
  "hearing-update": `${API_COMMON_ADMIN_URL}/update/hearing`,
  "haemoglobin-update": `${API_COMMON_ADMIN_URL}/update/haemoglobin`,
  "cretenine-update": `${API_COMMON_ADMIN_URL}/update/cretenine`,
  "cholesterol-update": `${API_COMMON_ADMIN_URL}/update/cholesterol`,
  "bmi-update": `${API_COMMON_ADMIN_URL}/update/bmi`,
  "blood-pressure-update": `${API_COMMON_ADMIN_URL}/update/blood-pressure`,
  "alchol-update": `${API_COMMON_ADMIN_URL}/update/alchol`,
  "hiv-update": `${API_COMMON_ADMIN_URL}/update/hiv`,
  "eye-update": `${API_COMMON_ADMIN_URL}/update/eye`,
  "ecg-update": `${API_COMMON_ADMIN_URL}/update/ecg`,
  "blood-group-update": `${API_COMMON_ADMIN_URL}/update/blood-group`,
  "romberg-update": `${API_COMMON_ADMIN_URL}/update/romberg`,
  "vision-update": `${API_COMMON_ADMIN_URL}/update/vision`,

  // Package Management
  "package-list": `${API_COMMON_ADMIN_URL}/package/list`,
  "package-details": `${API_COMMON_ADMIN_URL}/package/details`,
  "package-update": `${API_COMMON_ADMIN_URL}/package/update`,
  "add-package": `${API_COMMON_ADMIN_URL}/add/package`,
  "package-status-update": `${API_COMMON_ADMIN_URL}/package/status/update`,

  // Doctor Management
  "doctor-list": `${API_COMMON_ADMIN_URL}/view/doctor`,
  "doctor-details": `${API_COMMON_ADMIN_URL}/doctor/detail`,
  "doctor-update": `${API_COMMON_ADMIN_URL}/doctor/update`,
  "doctor-create": `${API_COMMON_ADMIN_URL}/create/doctor`,
  "update-doctor-status": `${API_COMMON_ADMIN_URL}/update/doctor/status`,

  // Workforce Type Management
  "workforce-type-list": `${API_COMMON_ADMIN_URL}/view/Workforce/type`,
  "workforce-type-details": `${API_COMMON_ADMIN_URL}/get/Workforce/type/byId`,
  "workforce-type-update": `${API_COMMON_ADMIN_URL}/update/Workforce/type`,
  "workforce-type-create": `${API_COMMON_ADMIN_URL}/create/Workforce/type`,
  "workforce-type-status": `${API_COMMON_ADMIN_URL}/Workforce/type/status/change`,

  // Center Wise Package
  "center-package-view": `${API_COMMON_ADMIN_URL}/view/center/package`,
  "center-package-details": `${API_COMMON_ADMIN_URL}/centerPackageDetails`,
  "center-package-update": `${API_COMMON_ADMIN_URL}/update/centerPackageDetails`,
  "center-package-add": `${API_COMMON_ADMIN_URL}/addpackage/toCenter`,
  "center-package-status-update": `${API_COMMON_ADMIN_URL}/update/center/package/status`,

  // Upload image
  "upload-file": `${API_COMMON_ADMIN_URL}/upload/file`,

  // User log history
  "user-logs": `${API_COMMON_ADMIN_URL}/user/logs`,

  // Download data
  "cet-csv-list": `${API_COMMON_ADMIN_URL}/cet/csv/list`,
  "download-csv": `${API_COMMON_ADMIN_URL}/cet/csv/download`,
  "editVehicleNumber": `${API_COMMON_ADMIN_URL}/editVehicleNumber`,

  // Graph
  "test-count-per-center" : `${API_COMMON_ADMIN_URL}/testCountPerCenter`,

  // Edit Health Records
  "driver-health-search-by-id": `${API_COMMON_ADMIN_URL}/search/driverByID`,
  "driver-health-search-by-vehicle": `${API_COMMON_ADMIN_URL}/searchDriver`,

  // Health Checkup Records

  // Health Checkup Management
  "search-driver": `${API_COMMON_CENTER_URL}/driver/search/bynumber`,
  "send-otp": `${API_COMMON_CENTER_URL}/driver/send/otp`,
  "verify-otp": `${API_COMMON_CENTER_URL}/driver/verify/otp`,
  "package-unit-list": `${API_COMMON_CENTER_URL}/driver/package/list/wise/unit`,
  "create-health-checkup-1": `${API_COMMON_CENTER_URL}/driver/create/health-checkup/step-1`,
  "create-health-checkup-2": `${API_COMMON_CENTER_URL}/driver/create/health-checkup/step-2`,
  "view-driver-health-checkup": `${API_COMMON_CENTER_URL}/driver/view/health-checkup`,
  "details-driver-health-checkup": `${API_COMMON_CENTER_URL}/driver/health-checkup/details`,
  "update-driver-health-checkup": `${API_COMMON_CENTER_URL}/driver/update/health-checkup`,
  "driver-packages": `${API_COMMON_CENTER_URL}/driver/package/list`,
  "upload-signature": `${API_COMMON_CENTER_URL}/driver/upload/signature`,
  "driver-doctor-list": `${API_COMMON_CENTER_URL}/driver/doctor/list`,
  // "workforce-type-list": `${API_COMMON_CENTER_URL}/driver/view/Workforce/type`,

  // Health Checkup Report
  "health-checkup-report": `${API_COMMON_CENTER_URL}/driver/health-report`,
  "health-checkup-download": `${API_COMMON_CENTER_URL}/driver/health-checkup/download`,
  "health-report-send-whatsapp": `${API_COMMON_CENTER_URL}/driver/send/otp/whatsapp`,
  "health-checkup-history": `${API_COMMON_CENTER_URL}/driver/health-checkup/history`,

  "editCET" : `${API_COMMON_ADMIN_URL}/editCET`,
  
  "cumulativeHealthAnalysis" : `${API_COMMON_ADMIN_URL}/cumulativeHealthAnalysis`,

  "get-requests": `${MOBILE_API_BASE_URL}/api/requests`,

  "get-prevRecords": `${MOBILE_API_BASE_URL}/api/driver-health-checkup/by-id`,

  "create-consultation": `${MOBILE_API_BASE_URL}/api/consultations`,

  "consultation-list": `${MOBILE_API_BASE_URL}/api/consultations/list`,

  "create-prescription": `${MOBILE_API_BASE_URL}/api/prescriptions`,

  "edit-prescription": `${MOBILE_API_BASE_URL}/api/prescriptions/prescription`,

  "restore-request": `${MOBILE_API_BASE_URL}/api/requests/`,

  "ban-driver": `${MOBILE_API_BASE_URL}/api/drivers/ban`,


  "get-banners": `${MOBILE_API_BASE_URL}/api/banners`,
  "create-banner": `${MOBILE_API_BASE_URL}/api/banners/create2`,
  "update-banner": `${MOBILE_API_BASE_URL}/api/banners`,
  "delete-banner": `${MOBILE_API_BASE_URL}/api/banners`,
  "upload-banner-file": `${MOBILE_API_BASE_URL}/api/banners/upload-to-s3`,
  "download-prescription-pdf": `${MOBILE_API_BASE_URL}/api/prescriptions/pdf`,

};
