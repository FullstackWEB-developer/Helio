import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import utils from '@shared/utils/utils';

const GuardedRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {

    if (!Component) {
        return null;
    }
    return (
        <Route {...rest} render={(props) => (
            utils.isLoggedIn()
                ? <Component {...props} />
                : <Redirect to='/login' />
        )} />
    )
}

export default GuardedRoute;
