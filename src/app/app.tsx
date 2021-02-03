import React, {Suspense} from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { lazily } from "react-lazily";
import FallbackLoader from '../shared/components/skeleton-loader/skeleton-loader';
import Layout from '../shared/layout/layout';
import Login from '../pages/login/login';
import VerifyRedirectLink from '../pages/appointment/verify-redirect-link'
import GuardedRoute from './guarded-route';
import { Dashboard } from '../pages/dashboard/dashboard';
import SearchResults from "../shared/components/search-bar/components/search-results";
import PatientChart from "../pages/patients/patient-chart";
import AppointmentDetail from "../pages/appointment/appointment-detail";
const { TicketsWithErrors } = lazily(() => import('../pages/tickets/ticket-list'))

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/o/:linkId">
                    <VerifyRedirectLink></VerifyRedirectLink>
                </Route>
                <Route path="/appointment-detail/:patientId">
                    <AppointmentDetail></AppointmentDetail>
                </Route>
                <Route path="/login">
                    <Login></Login>
                </Route>
                <Layout>
                    <GuardedRoute exact path="/dashboard" component={Dashboard}></GuardedRoute>
                    <Suspense fallback={<FallbackLoader />}>
                        <GuardedRoute exact path="/tickets" component={TicketsWithErrors}></GuardedRoute>
                    </Suspense>
                    <Switch>
                        <GuardedRoute exact path="/patients/results" component={SearchResults}></GuardedRoute>
                        <GuardedRoute exact path="/patients/:patientId" component={PatientChart}></GuardedRoute>
                    </Switch>
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
