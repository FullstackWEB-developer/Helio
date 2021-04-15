import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import AppointmentDisplay from '../../../patients/components/appointment-display';
import {getPatientClinicalDetails} from '@pages/patients/services/patients.service';
import {useQuery} from 'react-query';
import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import {GetPatientClinical, OneMinute} from '@constants/react-query-constants';

interface TicketDetailAppointmentsProps {
    ticket: Ticket
}

const TicketDetailAppointments = ({ticket}: TicketDetailAppointmentsProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();


    const {data: patientClinical} = useQuery<ClinicalDetails, Error>([GetPatientClinical, ticket?.patientId], () =>
            getPatientClinicalDetails(ticket?.patientId as number),
        {
            staleTime: OneMinute,
            enabled: !!ticket?.patientId
        }
    );

    useEffect(() => {
        if (ticket?.patientId) {
            dispatch(getProviders());
            dispatch(getDepartments());
        }
    }, [dispatch, ticket]);

    if (!patientClinical) {
        return null;
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        <div className='text-gray-400 pt-6 pb-3'>{t('patient.summary.last_appointment')}</div>
        {patientClinical?.lastAppointment && <AppointmentDisplay appointment={patientClinical.lastAppointment}/>}
        <div className='text-gray-400 pt-6 pb-3'>{t('patient.summary.upcoming_appointments')}</div>
        {
            patientClinical?.upcomingAppointments.length > 0 ?
                patientClinical.upcomingAppointments.map((ua) => <AppointmentDisplay key= {ua.appointmentId} appointment={ua} border={true}/>)
                : null
        }
    </div>
}

export default withErrorLogging(TicketDetailAppointments);
