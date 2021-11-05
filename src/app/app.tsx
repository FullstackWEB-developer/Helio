import React, {useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Layout from '../shared/layout/layout';
import Login from '../pages/login/login';
import GuardedRoute from './guarded-route';
import {Dashboard} from '@pages/dashboard/dashboard';
import {withSuspense} from '@shared/HOC/with-suspense';
import TicketList from '../pages/tickets/ticket-list';
import {
    ContactsPath,
    TicketsPath,
    SmsPath,
    UsersPath,
    UserDetailsPath,
    UsersBulkPath,
    BlackListsPath,
    TicketSmsPath,
    CallsLogPath,
    ChatsLogPath,
    AppointmentFoundPath,
    AppointmentReschedulePath,
    AppointmentCancelPath,
    AppointmentDetailPath,
    LabResultsPath,
    RequestRefillPath,
    RequestMedicalRecordsPath,
    AppointmentListPath,
    AppointmentRescheduledPath,
    AppointmentRescheduleConfirmPath,
    AppointmentScheduledPath,
    RegistrationPath,
    RegistrationShortPath,
    LabResultsShortPath,
    AppointmentDetailShortPath,
    AppointmentCancelShortPath,
    AppointmentRescheduleShortPath,
    AppointmentScheduleShortPath,
    ViewMedicationsPath,
    AppointmentSchedulePath,
    NotAuthorizedPath, MyStatsPath
} from './paths';
import RealTimeUserStatusUpdate from '@shared/websockets/real-time-user-status-update';
import ExternalAccessLayout from '@pages/external-access/layout/external-access-layout';
import Logger from '@shared/services/logger';
import {SignalRProvider} from '@shared/contexts/signalRContext';
import {createSmsConnectionHub} from '@shared/websockets/create-sms-connection-hub';
import {useSelector} from 'react-redux';
import {selectAccessToken} from '@shared/store/app-user/appuser.selectors';
import {SMS_INCOMING_NAME} from '@shared/constants/signalr-provider-constants';
import utils from '@shared/utils/utils';
import Confirmation from '@components/confirmation/confirmation';
import IncomingSmsUpdate from '@shared/websockets/incoming-sms-update';
import VerifiedPatientGuard from '@components/verified-patient-guard/verified-patient-guard';
const SearchResults = React.lazy(() => import('../shared/components/search-bar/components/search-results'));
const PatientChart = React.lazy(() => import('@pages/patients/patient-chart'));
const VerifyRedirectLink = React.lazy(() => import('@pages/external-access/verify-patient/verify-redirect-link'));
const AppointmentSchedule = React.lazy(() => import('@pages/external-access/appointment/appointment-schedule'));
const AppointmentScheduleSelect = React.lazy(() => import('@pages/external-access/appointment/appointment-schedule-select/appointment-schedule-select'));
const AppointmentScheduleConfirm = React.lazy(() => import('@pages/external-access/appointment/appointment-schedule-confirm/appointment-schedule-confirm'));
const AppointmentCancel = React.lazy(() => import('@pages/external-access/appointment/appointment-cancel'));
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
const DownloadMedicalRecords = React.lazy(() => import('@pages/external-access/request-medical-records/download-medical-records'));
const MedicalRecordsPreview = React.lazy(() => import('@pages/external-access/request-medical-records/medical-records-preview'));
const TicketSms = React.lazy(() => import('@pages/external-access/ticket-sms/ticket-sms'));
const Sms = React.lazy(() => import('@pages/sms'));
const UserDetails = React.lazy(() => import('@pages/users/details'));
const UserAdd = React.lazy(() => import('@pages/users/add/user-add'));
const UserList = React.lazy(() => import('@pages/users/list/user-list'));
const CallsLogList = React.lazy(() => import('@pages/calls-log/calls-log-list'));
const ChatsLogList = React.lazy(() => import('@pages/chat-log/chat-log-list'));
const BlackList = React.lazy(() => import('@pages/blacklists/blacklists'));
const BulkAddUser = React.lazy(() => import('@pages/users/bulk-add/bulk-add'));
const GetExternalUserDobZip = React.lazy(() => import('@pages/external-access/verify-patient/get-external-user-dob-zip'));
const ExternalUserVerificationCode = React.lazy(() => import('@pages/external-access/verify-patient/external-user-verification-code'));
const ExternalUserMobileNumber = React.lazy(() => import('@pages/external-access/verify-patient/get-external-user-mobile-number'));
const ExternalUserCreateCallbackTicket = React.lazy(() => import('@pages/external-access/verify-patient/external-user-create-callback-ticket'));
const Registration = React.lazy(() => import('@pages/external-access/registration/registration'));
const ExternalAppointmentFound = React.lazy(() => import('@pages/external-access/appointment/appointment-found'));
const NotAuthorized = React.lazy(() => import('@pages/not-authorized/not-authorized'));
const MyStats = React.lazy(() => import('@pages/application/my-stats'));

function App() {
    const accessToken = useSelector(selectAccessToken);

    useEffect(() => {
        const logStreamInterval = setInterval(() => {
            Logger.getInstance();
        }, Number(utils.getAppParameter('LogStreamCheckInterval')) || 5000);
        return () => {
            clearInterval(logStreamInterval)
        }
    }, []);

    return <BrowserRouter>
        <Switch>
            <Route path='/o/'>
                <ExternalAccessLayout>
                    <Switch>
                        <Route path={TicketSmsPath} component={withSuspense(TicketSms)} />
                        <Route path='/o/verify-patient' component={withSuspense(GetExternalUserDobZip)} />
                        <Route path='/o/verify-patient-code' component={withSuspense(ExternalUserVerificationCode)} />
                        <Route path='/o/verify-patient-get-mobile' component={withSuspense(ExternalUserMobileNumber)} />
                        <Route path='/o/callback-ticket' component={withSuspense(ExternalUserCreateCallbackTicket)} />
                        <Route path={RegistrationPath} component={withSuspense(Registration)} />
                        <Route path={RegistrationShortPath} component={withSuspense(Registration)} />
                        <VerifiedPatientGuard>
                            <Switch>
                                <Route path={AppointmentListPath} component={withSuspense(AppointmentList)} />
                                <Route path={`${AppointmentDetailPath}/:appointmentId`} component={withSuspense(AppointmentDetail)} />
                                <Route path={`${AppointmentDetailShortPath}/:appointmentId`} component={withSuspense(AppointmentDetail)} />
                                <Route path={RequestRefillPath} component={withSuspense(RequestRefill)} />
                                <Route path={ViewMedicationsPath} component={withSuspense(ViewMedications)} />
                                <Route path='/o/request-refill-confirmation' component={withSuspense(RequestRefillConfirmation)} />
                                <Route path={RequestMedicalRecordsPath} component={withSuspense(RequestMedicalRecords)} />
                                <Route exact path={LabResultsPath} component={withSuspense(LabResults)} />
                                <Route path={`${LabResultsPath}/:labResultId`} component={withSuspense(LabResultsDetailed)} />
                                <Route path={`${LabResultsShortPath}/:labResultId`} component={withSuspense(LabResultsDetailed)} />
                                <Route exact path={AppointmentSchedulePath} component={withSuspense(AppointmentSchedule)} />
                                <Route exact path={AppointmentScheduleShortPath} component={withSuspense(AppointmentSchedule)} />
                                <Route exact path={`${AppointmentSchedulePath}/select`} component={withSuspense(AppointmentScheduleSelect)} />
                                <Route exact path={`${AppointmentSchedulePath}/confirm`} component={withSuspense(AppointmentScheduleConfirm)} />
                                <Route path={AppointmentScheduledPath} component={withSuspense(AppointmentRescheduled)} />
                                <Route path={`${AppointmentCancelPath}/:appointmentId`} component={withSuspense(AppointmentCancel)} />
                                <Route path={`${AppointmentCancelShortPath}/:appointmentId`} component={withSuspense(AppointmentCancel)} />
                                <Route path='/o/appointment-canceled' component={withSuspense(AppointmentCanceled)} />
                                <Route path={`${AppointmentReschedulePath}/:appointmentId`} component={withSuspense(AppointmentReschedule)} />
                                <Route path={`${AppointmentRescheduleShortPath}/:appointmentId`} component={withSuspense(AppointmentReschedule)} />
                                <Route path={AppointmentRescheduleConfirmPath} component={withSuspense(AppointmentRescheduleConfirm)} />
                                <Route path={AppointmentRescheduledPath} component={withSuspense(AppointmentRescheduled)} />
                                <Route path='/o/download-medical-records' component={withSuspense(DownloadMedicalRecords)} />
                                <Route path={AppointmentFoundPath} component={withSuspense(ExternalAppointmentFound)} />
                                <Route path='/o/dmr/:linkId' component={withSuspense(DownloadMedicalRecords)} />
                                <Route exact path='/o/:linkId' component={withSuspense(VerifyRedirectLink)} />
                            </Switch>
                        </VerifiedPatientGuard>
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
                    <IncomingSmsUpdate />
                    <GuardedRoute exact path='/dashboard' component={Dashboard} />
                    <GuardedRoute exact path={TicketsPath} component={withSuspense(TicketList)} />
                    <GuardedRoute exact path={`${TicketsPath}/new`} component={withSuspense(TicketNew)} />
                    <GuardedRoute exact path={`${TicketsPath}/results`} component={withSuspense(SearchResults)} />
                    <GuardedRoute
                        exact
                        path={`${TicketsPath}/:ticketNumber(\\d+)`}
                        component={withSuspense(TicketDetail)}
                    />
                    <Switch>
                        <GuardedRoute exact path='/patients/results' component={withSuspense(SearchResults)} />
                        <GuardedRoute exact path='/patients/:patientId' component={withSuspense(PatientChart)} />
                    </Switch>
                    <Switch>
                        <GuardedRoute exact path={`${ContactsPath}/results`} component={withSuspense(SearchResults)} />
                        <GuardedRoute exact path={`${ContactsPath}/:contactId?`} component={withSuspense(Contacts)} />
                    </Switch>

                    <GuardedRoute exact path={`${SmsPath}/:ticketId?`} component={withSuspense(Sms)} />
                    <GuardedRoute exact path={UsersPath} component={withSuspense(UserList)} permission='Users.Access' />
                    <GuardedRoute exact path={`${UsersPath}/new`} component={withSuspense(UserAdd)} permission='Users.Access' />
                    <GuardedRoute exact path={`${UserDetailsPath}/:userId`} component={withSuspense(UserDetails)} />
                    <GuardedRoute exact path={MyStatsPath} component={withSuspense(MyStats)}/>
                    <GuardedRoute exact path={BlackListsPath} component={withSuspense(BlackList)} permission='BlockedAccess.Access' />
                    <GuardedRoute exact path={UsersBulkPath} component={withSuspense(BulkAddUser)} />
                    <GuardedRoute exact path={CallsLogPath} component={withSuspense(CallsLogList)} />
                    <GuardedRoute exact path={ChatsLogPath} component={withSuspense(ChatsLogList)} />
                    <GuardedRoute exact path={NotAuthorizedPath} component={withSuspense(NotAuthorized)} />
                    <Confirmation
                        className='shadow-md'
                        hasOverlay={true}
                        displayCancel={false}
                        isCloseButtonDisabled={true}
                        onOk={() => utils.logout()}
                        title={'login.session_timeout'}
                        message={'login.session_timeout_description'}
                        isOpen={utils.isSessionExpired()} />
                </Layout>
            </SignalRProvider>
        </Switch>
    </BrowserRouter>;
}

export default App;
