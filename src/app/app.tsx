import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Layout from '../shared/layout/layout';
import Login from '../pages/login/login';
import GuardedRoute from './guarded-route';
import { Dashboard } from '../pages/dashboard/dashboard';
import { withSuspense } from '../shared/HOC/with-suspense';
import TicketList from '../pages/tickets/ticket-list';
const SearchResults = React.lazy(() => import('../shared/components/search-bar/components/search-results'));
const PatientChart = React.lazy(() => import('../pages/patients/patient-chart'));
const VerifyRedirectLink = React.lazy(() => import('../pages/external-access/hipaa-verification/verify-redirect-link'));
const AppointmentDetail = React.lazy(() => import('../pages/external-access/appointment/appointment-detail'));
const RequestRefill = React.lazy(() => import('../pages/external-access/request-refill/request-refill'));
const RequestMedicalRecords = React.lazy(() => import('../pages/external-access/request-medical-records/request-medical-records'));
const LabResults = React.lazy(() => import('../pages/external-access/lab-results/lab-results'));
const TicketNew = React.lazy(() => import('../pages/tickets/ticket-new'));
const RescheduleAppointment = React.lazy(() => import('../pages/external-access/reschedule-appointment/reschedule-appointment'));

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/o/:linkId' component={withSuspense(VerifyRedirectLink)} />
                <Route path='/appointment-detail' component={withSuspense(AppointmentDetail)} />
                <Route path='/request-refill' component={withSuspense(RequestRefill)} />
                <Route path='/request-medical-records' component={withSuspense(RequestMedicalRecords)} />
                <Route path='/lab-results' component={withSuspense(LabResults)} />
                <Route path='/reschedule-appointment' component={withSuspense(RescheduleAppointment)} />
                <Route path='/login'>
                    <Login />
                </Route>
                <Layout>
                    <GuardedRoute exact path='/dashboard' component={Dashboard} />
                    <GuardedRoute exact path='/tickets' component={withSuspense(TicketList)} />
                    <GuardedRoute exact path='/tickets/new' component={withSuspense(TicketNew)} />
                    <Switch>
                        <GuardedRoute exact path='/patients/results' component={withSuspense(SearchResults)} />
                        <GuardedRoute exact path='/patients/:patientId' component={withSuspense(PatientChart)} />
                    </Switch>
                </Layout>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
