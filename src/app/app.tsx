import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { lazily } from "react-lazily";
import FallbackLoader from '../shared/components/skeleton-loader/skeleton-loader';
import Layout from '../shared/layout/layout';
import Login from '../pages/login/login';
import GuardedRoute from './guarded-route';
import { Dashboard } from '../pages/dashboard/dashboard';
const { TicketsWithErrors } = lazily(() => import('../pages/tickets/ticket-list'))

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login">
                    <Login></Login>
                </Route>
                <Layout>
                    <GuardedRoute exact path="/dashboard" component={Dashboard}></GuardedRoute>
                    <Suspense fallback={<FallbackLoader />}>
                        <GuardedRoute exact path="/tickets" component={TicketsWithErrors}></GuardedRoute>
                    </Suspense>
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
