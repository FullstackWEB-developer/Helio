import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Layout from '../shared/layout/layout';
import Login from '../pages/login/login';
import GuardedRoute from './guarded-route';
import { Dashboard } from '@pages/dashboard/dashboard';
import { withSuspense } from '@shared/HOC/with-suspense';
import TicketList from '../pages/tickets/ticket-list';
import { QueryClient, QueryClientProvider } from "react-query";
import { TicketsPath } from './paths';
import RealTimeUserStatusUpdate from '@shared/websockets/real-time-user-status-update';
import ExternalAccessLayout from '@pages/external-access/layout/external-access-layout';
const SearchResults = React.lazy(() => import('../shared/components/search-bar/components/search-results'));
const PatientChart = React.lazy(() => import('../pages/patients/patient-chart'));
const VerifyRedirectLink = React.lazy(() => import('../pages/external-access/hipaa-verification/verify-redirect-link'));
const AppointmentList = React.lazy(() => import('@pages/external-access/appointment/appointment-list'));
const AppointmentDetail = React.lazy(() => import('@pages/external-access/appointment/appointment-detail'));
const RequestRefill = React.lazy(() => import('../pages/external-access/request-refill/request-refill'));
const RequestMedicalRecords = React.lazy(() => import('../pages/external-access/request-medical-records/request-medical-records'));
const LabResults = React.lazy(() => import('../pages/external-access/lab-results/lab-results'));
const CancelAppointment = React.lazy(() => import('../pages/external-access/appointment/cancel-appointment'));
const TicketNew = React.lazy(() => import('../pages/tickets/ticket-new'));
const TicketDetail = React.lazy(() => import('../pages/tickets/ticket-detail'));
const RescheduleAppointment = React.lazy(() => import('../pages/external-access/reschedule-appointment/reschedule-appointment'));

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    });

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Switch>
                    <Route path='/o/'>
                        <ExternalAccessLayout>
                            <Switch>
                                <Route path='/o/appointment-list' component={withSuspense(AppointmentList)} />
                                <Route path='/o/appointment-detail' component={withSuspense(AppointmentDetail)} />
                                <Route path='/o/request-refill' component={withSuspense(RequestRefill)} />
                                <Route path='/o/request-medical-records' component={withSuspense(RequestMedicalRecords)} />
                                <Route path='/o/lab-results' component={withSuspense(LabResults)} />
                                <Route path='/o/cancel-appointment' component={withSuspense(CancelAppointment)} />
                                <Route path='/o/reschedule-appointment' component={withSuspense(RescheduleAppointment)} />
                                <Route path='/o/:linkId' component={withSuspense(VerifyRedirectLink)} />
                            </Switch>
                        </ExternalAccessLayout>
                    </Route>
                    <Route path='/login'>
                        <Login />
                    </Route>
                    <Layout>
                        <RealTimeUserStatusUpdate />
                        <GuardedRoute exact path='/dashboard' component={Dashboard} />
                        <GuardedRoute exact path={TicketsPath} component={withSuspense(TicketList)} />
                        <GuardedRoute exact path={`${TicketsPath}/new`} component={withSuspense(TicketNew)} />
                        <GuardedRoute exact path={`${TicketsPath}/:ticketNumber(\\d+)`} component={withSuspense(TicketDetail)} />
                        <Switch>
                            <GuardedRoute exact path='/patients/results' component={withSuspense(SearchResults)} />
                            <GuardedRoute exact path='/patients/:patientId' component={withSuspense(PatientChart)} />
                        </Switch>
                    </Layout>
                </Switch>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
