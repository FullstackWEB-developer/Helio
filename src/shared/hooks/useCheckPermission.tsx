import {useSelector} from "react-redux";
import {selectAppUserPermission} from '@shared/store/app-user/appuser.selectors';
const useCheckPermission = (permission?: string) => {
    const userPermissions = useSelector(selectAppUserPermission);

    if (!permission) {
        return true;
    }
    if(!userPermissions) {
        return false;
    }
    
    return userPermissions.includes(permission)
}

export default useCheckPermission;