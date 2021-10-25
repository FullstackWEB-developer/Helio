import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import utils from '@shared/utils/utils';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import NotAuthorized from '@pages/not-authorized/not-authorized';
interface GuardedRouteProps extends RouteProps {
    permission?: string;
}

const GuardedRoute: React.FC<GuardedRouteProps> = ({component: Component, permission, ...rest }) => {
    const hasPermission = useCheckPermission(permission);
    if (!Component) {
        return null;
    }

    return (
        <Route {...rest} render={(props) => {
            if (!utils.isLoggedIn()) {
                return (<Redirect to='/login' />);
            }
            if (!hasPermission) {
                return (<NotAuthorized />);
            }
            return (<Component {...props} />)
        }} />
    )
}

export default GuardedRoute;
