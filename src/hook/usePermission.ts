import { LOCAL_FORAGE_PERMISSION_KEY } from "@constants/AppConstant";
import localforage from "localforage";
import { useEffect, useState } from "react";

interface RecordTypes {
    [key: string]: string[]
}

const usePermission = (page_name: string) => {
    const [permissionArr, setPermissionArr] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPermissions();
    }, []);
    
    const getPermissions = async () => {
        try {
          const prmsnObj = (await localforage.getItem( LOCAL_FORAGE_PERMISSION_KEY )) as RecordTypes;
            
          setPermissionArr(prmsnObj[page_name]);
          
        } catch (err) {
          // This code runs if there were any errors.
          console.log(err);
        } finally {
          setLoading(false)
        }
    }
  
  return {
    canView: permissionArr?.includes("view") ? true : false,
    canEdit: permissionArr?.includes("edit") ? true : false,
    canCreate: permissionArr?.includes("create") ? true : false,
    canModify: permissionArr?.length >= 2 ? true : false,
    loading
  };
}

export default usePermission