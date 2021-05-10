import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import {getPatientClinicalDetails} from '@pages/patients/services/patients.service';
import {useQuery} from 'react-query';
import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import {GetPatientClinical, OneMinute} from '@constants/react-query-constants';
import TicketAppointmentDisplay from '@pages/tickets/components/ticket-detail/ticket-appointment-display';

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
        {patientClinical?.lastAppointment &&
        <>
            <div className='h8 pb-3'>
                {t('patient.summary.last_appointment')}
            </div>
            <TicketAppointmentDisplay appointment={patientClinical.lastAppointment}/>
        </>
        }
        <>
            {
                patientClinical?.upcomingAppointments.length > 0 &&
                <>
                    <div className='h8 pt-6 pb-3'>
                        {t('patient.summary.upcoming_appointments')}
                    </div>
                    {
                        patientClinical.upcomingAppointments.map((appointment) => <TicketAppointmentDisplay
                            key={appointment.appointmentId} appointment={appointment}/>)
                    }
                </>
            }

        </>

    </div>
}

export default withErrorLogging(TicketDetailAppointments);
