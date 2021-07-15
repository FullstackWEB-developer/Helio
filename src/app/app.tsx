import React, {useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Layout from '../shared/layout/layout';
import Login from '../pages/login/login';
import GuardedRoute from './guarded-route';
import {Dashboard} from '@pages/dashboard/dashboard';
import {withSuspense} from '@shared/HOC/with-suspense';
import TicketList from '../pages/tickets/ticket-list';
import {QueryClient, QueryClientProvider} from "react-query";
import {ContactsPath, TicketsPath, SmsPath} from './paths';
import RealTimeUserStatusUpdate from '@shared/websockets/real-time-user-status-update';
import ExternalAccessLayout from '@pages/external-access/layout/external-access-layout';
import Logger from '@shared/services/logger';
import {SignalRProvider} from '@shared/contexts/signalRContext';
import {createSmsConnectionHub} from '@shared/websockets/create-sms-connection-hub';
import {useSelector} from 'react-redux';
import {selectAccessToken} from '@shared/store/app-user/appuser.selectors';
import {SMS_INCOMING_NAME} from '@shared/constants/signalr-provider-constants';

const SearchResults = React.lazy(() => import('../shared/components/search-bar/components/search-results'));
const PatientChart = React.lazy(() => import('@pages/patients/patient-chart'));
const VerifyRedirectLink = React.lazy(() => import('@pages/external-access/hipaa-verification/verify-redirect-link'));
const AppointmentSchedule = React.lazy(() => import('@pages/external-access/appointment/appointment-schedule'));
const AppointmentCancellation = React.lazy(() => import('@pages/external-access/appointment/appointment-cancelation'));
const AppointmentCanceled = React.lazy(() => import('@pages/external-access/appointment/appointment-canceled'));
const AppointmentReschedule = React.lazy(() => import('@pages/external-access/appointment/reschedule/appointment-reschedule'));
const AppointmentRescheduleConfirm = React.lazy(() => import('@pages/external-access/appointment/reschedule/appointment-reschedule-confirm'));
const AppointmentRescheduled = React.lazy(() => import('@pages/external-access/appointment/reschedule/appointment-rescheduled'));
const AppointmentDetail = React.lazy(() => import('@pages/external-access/appointment/appointment-detail'));
const AppointmentList = React.lazy(() => import('@pages/external-access/appointment/appointment-list'));
const RequestRefill = React.lazy(() => import('@pages/external-access/request-refill/request-refill'));
const ViewMedications = React.lazy(() => import('@pages/external-access/request-refill/view-medications'));
const RequestRefillConfirmation = React.lazy(() => import('@pages/external-access/request-refill/request-refill-confirmation'));
const RequestMedicalRecords = React.lazy(() => import('@pages/external-access/request-medical-records/request-medical-records'));
const LabResults = React.lazy(() => import('@pages/external-access/lab-results/lab-results'));
const LabResultsDetailed = React.lazy(() => import('@pages/external-access/lab-results/lab-result-detailed'));
const TicketNew = React.lazy(() => import('@pages/tickets/ticket-new'));
const TicketDetail = React.lazy(() => import('@pages/tickets/ticket-detail'));
const Contacts = React.lazy(() => import('../pages/contacts/contacts'));
const DownloadMedicalRecords = React.lazy(() => import('@pages/external-access/request-medical-records/download-medical-record'));
const MedicalRecordsPreview = React.lazy(() => import('@pages/external-access/request-medical-records/medical-records-preview'));
const Sms = React.lazy(() => import('@pages/sms'));

function App() {
    let logger = Logger.getInstance();
    const accessToken = useSelector(selectAccessToken);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
                onError: (error) => {
                    logger.error("Query Error ", error);
                }
            },
            mutations: {
                onError: (error) => {
                    logger.error("Mutation Error ", error);
                }
            }
        }
    });

    useEffect(() => {
        const logStreamInterval = setInterval(() => {
            logger = Logger.getInstance();
        }, Number(process.env.REACT_APP_LOG_STREAM_CHECK_INTERVAL) || 5000);
        return () => {
            clearInterval(logStreamInterval)
        }
    }, []);

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
                                <Route path='/o/view-medications' component={withSuspense(ViewMedications)} />
                                <Route path='/o/request-refill-confirmation' component={withSuspense(RequestRefillConfirmation)} />
                                <Route path='/o/request-medical-records'
                                    component={withSuspense(RequestMedicalRecords)} />
                                <Route exact path='/o/lab-results' component={withSuspense(LabResults)} />
                                <Route path='/o/lab-results/:labResultId' component={withSuspense(LabResultsDetailed)} />
                                <Route path='/o/appointment-schedule' component={withSuspense(AppointmentSchedule)} />
                                <Route path='/o/appointment-cancelation'
                                    component={withSuspense(AppointmentCancellation)} />
                                <Route path='/o/appointment-canceled' component={withSuspense(AppointmentCanceled)} />
                                <Route path='/o/appointment-reschedule'
                                    component={withSuspense(AppointmentReschedule)} />
                                <Route path='/o/appointment-reschedule-confirm'
                                    component={withSuspense(AppointmentRescheduleConfirm)} />
                                <Route path='/o/appointment-rescheduled'
                                    component={withSuspense(AppointmentRescheduled)} />
                                <Route path='/o/dmr/:linkId' component={withSuspense(DownloadMedicalRecords)} />
                                <Route path='/o/:linkId' component={withSuspense(VerifyRedirectLink)} />
                            </Switch>
                        </ExternalAccessLayout>
                    </Route>
                    <Route exact={true} path='/medical-records-preview'
                        component={withSuspense(MedicalRecordsPreview)} />
                    <Route path='/login'>
                        <Login />
                    </Route>
                    <SignalRProvider name={SMS_INCOMING_NAME} createConnection={() => createSmsConnectionHub(accessToken)}>
                        <Layout>
                            <RealTimeUserStatusUpdate />
                            <GuardedRoute exact path='/dashboard' component={Dashboard} />
                            <GuardedRoute exact path={TicketsPath} component={withSuspense(TicketList)} />
                            <GuardedRoute exact path={`${TicketsPath}/new`} component={withSuspense(TicketNew)} />
                            <GuardedRoute
                                exact
                                path={`${TicketsPath}/:ticketNumber(\\d+)`}
                                component={withSuspense(TicketDetail)}
                            />
                            <Switch>
                                <GuardedRoute exact path='/patients/results' component={withSuspense(SearchResults)} />
                                <GuardedRoute exact path='/patients/:patientId' component={withSuspense(PatientChart)} />
                            </Switch>
                            <GuardedRoute exact path={`${ContactsPath}/:contactId?`} component={withSuspense(Contacts)} />
                            <GuardedRoute exact path={`${SmsPath}/:ticketId?`} component={withSuspense(Sms)} />
                        </Layout>
                    </SignalRProvider>
                </Switch>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
