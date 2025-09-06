import NotFoundPage from '@components/Common/NotFoundPage';
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from '@constants/AppConstant';
import DownloadDataComp from '@modules/DownloadData';
import React from 'react'
import usePermission from 'src/hook/usePermission';

const DownloadData = () => {
 const { canView, loading } = usePermission(pageNameArray[1]);
 return canView ? (
   <DownloadDataComp />
 ) : (
   <NotFoundPage
     status={403}
     message={NO_VIEW_PERMISSION_MSG}
     loading={loading}
   />
 );
}

export default DownloadData