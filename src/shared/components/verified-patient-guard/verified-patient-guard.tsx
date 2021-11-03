import {ReactNode} from "react";
import useVerifiedPatient from '@shared/hooks/useVerifiedPatient';
import {useHistory} from 'react-router-dom';
import {
    AppointmentCancelPath,
    AppointmentCancelShortPath,
    AppointmentDetailPath,
    AppointmentDetailShortPath,
    AppointmentListPath,
    AppointmentRescheduleConfirmPath,
    AppointmentRescheduledPath,
    AppointmentReschedulePath,
    AppointmentRescheduleShortPath,
    AppointmentScheduledPath,
    AppointmentSchedulePath,
    AppointmentScheduleShortPath,
    InitialVerificationPath,
    LabResultsPath,
    LabResultsShortPath,
    RequestMedicalRecordsPath,
    ViewMedicationsPath
} from '@app/paths';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {RequestChannel} from '@pages/external-access/verify-patient/models/request-channel.enum';
import {useDispatch} from 'react-redux';
import {setRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import {matchPath} from 'react-router';

interface VerifiedPatientGuardProps {
    children?: ReactNode | Element | null;
}
const VerifiedPatientGuard = ({children}: VerifiedPatientGuardProps) => {
    const hasVerifiedPatient = useVerifiedPatient();
    const history = useHistory();

    const rescheduleAppointmentMatch = matchPath(history.location.pathname, {
        path: `${AppointmentReschedulePath}/:appointmentId`,
        exact: true,
        strict: false
    });

    const rescheduleAppointmentShortMatch = matchPath(history.location.pathname, {
        path: `${AppointmentRescheduleShortPath}/:appointmentId`,
        exact: true,
        strict: false
    });

    const cancelAppointmentMatch = matchPath(history.location.pathname, {
        path: `${AppointmentCancelPath}/:appointmentId`,
        exact: true,
        strict: false
    });

    const cancelAppointmentShortMatch = matchPath(history.location.pathname, {
        path: `${AppointmentCancelShortPath}/:appointmentId`,
        exact: true,
        strict: false
    });

    const viewAppointmentMatch = matchPath(history.location.pathname, {
        path: `${AppointmentDetailPath}/:appointmentId`,
        exact: true,
        strict: false
    });

    const viewAppointmentShortMatch = matchPath(history.location.pathname, {
        path: `${AppointmentDetailShortPath}/:appointmentId`,
        exact: true,
        strict: false
    });

    const scheduleAppointmentMatch = matchPath(history.location.pathname, {
        path: AppointmentSchedulePath,
        exact: true,
        strict: false
    });

    const scheduleAppointmentShortMatch = matchPath(history.location.pathname, {
        path: AppointmentScheduleShortPath,
        exact: true,
        strict: false
    });


    const appointmentScheduledMatch = matchPath(history.location.pathname, {
        path: AppointmentScheduledPath,
        exact: true,
        strict: false
    });

    const appointmentListMatch = matchPath(history.location.pathname, {
        path: `${AppointmentListPath}`,
        exact: true,
        strict: false
    });

    const appointmentRescheduledMatch = matchPath(history.location.pathname, {
        path: AppointmentRescheduledPath,
        exact: true,
        strict: false
    });

    const appointmentRescheduleConfirmMatch = matchPath(history.location.pathname, {
        path: AppointmentRescheduleConfirmPath,
        exact: true,
        strict: false
    });

    const labResultsMatch = matchPath(history.location.pathname, {
        path: LabResultsPath,
        exact: true,
        strict: false
    });

    const singleLabResultMatch = matchPath(history.location.pathname, {
        path: `${LabResultsPath}/:labResultId`,
        exact: true,
        strict: false
    });

    const singleLabResultShortMatch = matchPath(history.location.pathname, {
        path: `${LabResultsShortPath}/:labResultId`,
        exact: true,
        strict: false
    });

    const requestMedicalRecordsMatch = matchPath(history.location.pathname, {
        path: RequestMedicalRecordsPath,
        exact: true,
        strict: false
    });

    const viewMedicationsMatch = matchPath(history.location.pathname, {
        path: ViewMedicationsPath,
        exact: true,
        strict: false
    });

    let requestType = ExternalAccessRequestTypes.None;
    if (rescheduleAppointmentMatch || rescheduleAppointmentShortMatch || appointmentRescheduleConfirmMatch || appointmentRescheduledMatch) {
        requestType = ExternalAccessRequestTypes.RescheduleAppointment;
    } else if (cancelAppointmentMatch || cancelAppointmentShortMatch) {
        requestType = ExternalAccessRequestTypes.CancelAppointment;
    } else if (viewAppointmentMatch || viewAppointmentShortMatch) {
        requestType = ExternalAccessRequestTypes.GetAppointmentDetail;
    } else if (appointmentListMatch) {
        requestType = ExternalAccessRequestTypes.AppointmentList;
    } else if (scheduleAppointmentMatch || appointmentScheduledMatch || scheduleAppointmentShortMatch) {
        requestType = ExternalAccessRequestTypes.ScheduleAppointment;
    } else if (labResultsMatch || singleLabResultMatch || singleLabResultShortMatch) {
        requestType = ExternalAccessRequestTypes.GetLabResults;
    } else if (viewMedicationsMatch) {
        requestType = ExternalAccessRequestTypes.RequestRefill
    } else if (requestMedicalRecordsMatch) {
        requestType = ExternalAccessRequestTypes.RequestMedicalRecords
    }

    const dispatch = useDispatch();
    if (requestType === ExternalAccessRequestTypes.None) {
        return <>{children}</>;
    }
    if (!hasVerifiedPatient) {
        const redirectLink : RedirectLink = {
            requestType : requestType,
            requestChannel:RequestChannel.Web,
            linkCreationDate: new Date(),
            attributes: undefined,
            patientId:'',
            linkId: history.location.pathname,
            fullUrl: window.location.href,
            sentAddress:'',
            ticketId:'',
            redirectAfterVerification: history.location.pathname
        }
        dispatch(setRedirectLink(redirectLink));
        history.push(InitialVerificationPath);
        return null;
    }
    return <>{children}</>;
}

export default VerifiedPatientGuard;
