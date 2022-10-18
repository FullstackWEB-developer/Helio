import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {GetAppointmentTypes, GetPatientAppointments} from '@constants/react-query-constants';
import {getAppointments} from '@pages/patients/services/patients.service';
import Logger from '@shared/services/logger';
import {setSelectedAppointment, setAppointmentTypes} from '@pages/external-access/appointment/store/appointments.slice';
import {useHistory} from 'react-router-dom';
import './appointment.scss';
import AppointmentTable from './components/appointment-table';
import {getAppointmentTypes} from '@pages/appointments/services/appointments.service';
import {AppointmentType} from './models/appointment-type.model';
import Spinner from '@components/spinner/Spinner';
import {AppointmentDetailPath, AppointmentSchedulePath} from '@app/paths';
import Button from '@components/button/button';
import {getAllProviders, getLocations} from '@shared/services/lookups.service';

const AppointmentList = () => {
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const history = useHistory();
    const dispatch = useDispatch();
    const [appointmentList, setAppointmentList] = useState<Appointment[]>();

    useEffect(() => {
        dispatch(getAllProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const {isLoading: isAppointmentTypeLoading, data: appointmentTypes} = useQuery<AppointmentType[], AxiosError>([GetAppointmentTypes], () => getAppointmentTypes(), {
        enabled: true,
        onSuccess: (data) => {
            if (data.length < 1) {
                return;
            }
            dispatch(setAppointmentTypes(data));
        }
    });

    const {isLoading, error, data: appointments} = useQuery<Appointment[], AxiosError>([GetPatientAppointments, verifiedPatient?.patientId], () =>
        getAppointments(verifiedPatient.patientId),
        {
            enabled: !!verifiedPatient
        }
    );

    useEffect(() => {
        if (!appointmentTypes || !appointments) {
            return;
        }
        const newAppointment = appointments.map(a => {
            const appointmentType = appointmentTypes.find(p => p.id === Number(a.appointmentTypeId));
            return {...a, patientAppointmentTypeName: appointmentType?.name ?? a.patientAppointmentTypeName};
        });
        setAppointmentList(newAppointment);
    }, [appointments, appointmentTypes])

    const selectAppointment = (appointment: Appointment) => {
        dispatch(setSelectedAppointment(appointment));
        history.push(`${AppointmentDetailPath}/${appointment.appointmentId}`);
    }

    if (isLoading || isAppointmentTypeLoading) {
        return <Spinner fullScreen />
    }

    if (error) {
        const logger = Logger.getInstance();
        logger.error(`Error getting appointments for patient ${verifiedPatient.patientId}`, error);
        return <div>{t('common.error')}</div>
    }

    if (appointmentList) {
        return (
            <div>
                <div className='2xl:whitespace-pre 2xl:h-20 flex w-full items-center'>
                    <h4>
                        {t('external_access.appointments.list_title', {number: appointmentList.length})}
                    </h4>
                </div>
                {appointmentList.length > 0 && <div className='pt-6 pb-8'>
                    {t('external_access.appointments.select_appointment')}
                </div>}
                {
                    appointmentList.length > 0 ?
                    <AppointmentTable
                        isActionColumnVisible={false}
                        data={appointmentList}
                        onRowClick={(appointment) => selectAppointment(appointment as Appointment)} /> :
                    <Button data-testid='schedule' label='external_access.appointments.appointment_schedule' onClick={() => history.push(AppointmentSchedulePath)}/>
                }
            </div>
        );
    }

    return <div>{t('external_access.appointments.no_appointments_found')}</div>
}

export default AppointmentList;
