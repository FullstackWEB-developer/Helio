import {ReactNode} from "react";
import useCheckPermission from "../../hooks/useCheckPermission";

interface ComponentPermissionGuardProps {
    permission: string;
    children?: ReactNode | Element | null;
}
const ComponentPermissionGuard = ({permission, children}: ComponentPermissionGuardProps) => {
    const hasPermission = useCheckPermission(permission);

    if (!hasPermission) {
        return <></>;
    }
    return <>{children}</>;
}

export default ComponentPermissionGuard;
