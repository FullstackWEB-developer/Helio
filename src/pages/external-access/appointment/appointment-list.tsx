import {useTranslation} from 'react-i18next';
import React from 'react';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import AppointmentsListItem from '@pages/external-access/appointment/components/appointments-list-item';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {GetPatientAppointments} from '@constants/react-query-constants';
import {getAppointments} from '@pages/patients/services/patients.service';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import Logger from '@shared/services/logger';
import {setSelectedAppointment} from '@pages/external-access/appointment/store/appointments.slice';
import {useHistory} from 'react-router-dom';

const AppointmentList = () => {
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const history = useHistory();
    const dispatch = useDispatch();

    const {isLoading, error, data: appointments} = useQuery<Appointment[], AxiosError>([GetPatientAppointments, verifiedPatient?.patientId], () =>
            getAppointments(verifiedPatient.patientId),
        {
            enabled: !!verifiedPatient,
            onSuccess : (data) => {
                if (data.length  === 1) {
                    selectAppointment(data[0]);
                }
            }
        }
    );

    const selectAppointment = (appointment: Appointment) => {
        dispatch(setSelectedAppointment(appointment));
        history.push('/o/appointment-detail');
    }

    if (isLoading) {
        return <ThreeDots/>
    }

    if (error) {
        const logger = Logger.getInstance();
        logger.error(`Error getting appointments for patient ${verifiedPatient.patientId}`, error);
        return <div>{t('common.error')}</div>
    }

    if (appointments) {
        return (
            <div className='2xl:px-48'>
                <div className='2xl:whitespace-pre 2xl:h-20 flex w-full items-center'>
                    <h4>
                        {t('external_access.appointments.list_title', {number: appointments.length})}
                    </h4>
                </div>
                <div className='pt-6 pb-8'>
                    {t('external_access.appointments.select_appointment')}
                </div>
                <div className='pb-16'>
                    {
                        appointments.map((appointment) => {
                            return <div key={appointment.appointmentId} className='cursor-pointer' onClick={() => selectAppointment(appointment)}>
                                <AppointmentsListItem item={appointment}/></div>
                        })
                    }
                </div>
            </div>
        );
    }

    return <div>{t('external_access.appointments.no_appointments_found')}</div>
}

export default AppointmentList;
