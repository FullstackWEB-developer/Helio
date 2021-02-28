import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authenticationSelector } from '../shared/store/app-user/appuser.selectors';

const GuardedRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
    const isLoggedIn = useSelector(authenticationSelector).isLoggedIn;
    if (!Component) {
        return null;
    }
    return (
        <Route {...rest} render={(props) => (
            isLoggedIn
                ? <Component {...props} />
                : <Redirect to='/login' />
        )} />
    )
}

export default GuardedRoute;
