import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {getPatientById} from '../../../../shared/services/search.service';
import {selectPatientClinical} from '@pages/patients/store/patients.selectors';
import {getDepartments, getProviders} from '../../../../shared/services/lookups.service';
import AppointmentDisplay from '../../../patients/components/appointment-display';
import {getPatientClinicalDetails} from '@pages/patients/services/patients.service';

interface TicketDetailAppointmentsProps {
    ticket: Ticket
}

const TicketDetailAppointments = ({ticket}: TicketDetailAppointmentsProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const patientClinical = useSelector(selectPatientClinical);

    useEffect(() => {
        if (ticket && ticket.patientId) {
            dispatch(getPatientById(ticket.patientId));
            dispatch(getPatientClinicalDetails(ticket.patientId));
            dispatch(getProviders());
            dispatch(getDepartments());
        }
    }, [dispatch, ticket]);

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
