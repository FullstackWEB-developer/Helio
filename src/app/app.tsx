import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { lazily } from "react-lazily";
import FallbackLoader from '../shared/components/skeleton-loader/skeleton-loader';
import Layout from '../shared/layout/layout';
import Login from '../pages/login/login';
import GuardedRoute from './guarded-route';
import { Dashboard } from '../pages/dashboard/dashboard';
import SearchResults from "../shared/components/search-bar/components/search-results";
import PatientChart from "../pages/patients/patient-chart";
import VerifyRedirectLink from '../pages/external-access/hipaa-verification/verify-redirect-link';
import AppointmentDetail from '../pages/external-access/appointment/appointment-detail';
import RequestRefill from '../pages/external-access/request-refill/request-refill';
const { TicketsWithErrors } = lazily(() => import('../pages/tickets/ticket-list'))

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/o/:linkId" component={VerifyRedirectLink} />
                <Route path="/appointment-detail/:patientId" component={AppointmentDetail} />
                <Route path="/request-refill/:patientId" component={RequestRefill} />
                <Route path="/login">
                    <Login />
                </Route>
                <Layout>
                    <GuardedRoute exact path="/dashboard" component={Dashboard}/>
                    <Suspense fallback={<FallbackLoader />}>
                        <GuardedRoute exact path="/tickets" component={TicketsWithErrors}/>
                    </Suspense>
                    <Switch>
                        <GuardedRoute exact path="/patients/results" component={SearchResults}/>
                        <GuardedRoute exact path="/patients/:patientId" component={PatientChart}/>
                    </Switch>
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
