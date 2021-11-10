import React, {useEffect, useState} from 'react';
import Spinner from '@components/spinner/Spinner';
import {GetAppointmentById, GetAppointmentTypes} from '@constants/react-query-constants';
import {getAppointmentById, getAppointmentTypes} from '@pages/appointments/services/appointments.service';
import {AxiosError} from 'axios';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useParams} from 'react-router';
import {Appointment, AppointmentType} from '../models';
import AppointmentDetailConfirmation from '../components/appointment-detail-confirmation';
import {useDispatch, useSelector} from 'react-redux';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import {selectIsLoadingLookupValues} from '@shared/store/lookups/lookups.selectors';
import utils from '@shared/utils/utils';

const AppointmentConfirmation = () => {
    const {t} = useTranslation();
    let {appointmentId} = useParams<{appointmentId: string}>();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const isLoadingLookupValues = useSelector(selectIsLoadingLookupValues);

    const {data: appointment, isFetching: fetchingAppointmentDetails, error: appointmentError} = useQuery<Appointment, AxiosError>([GetAppointmentById, appointmentId],
        () => getAppointmentById(appointmentId),
        {
            enabled: !!appointmentId
        }
    );

    const [appointmentType, setAppointmentType] = useState<AppointmentType>();
    const {isFetching: fetchingAppointmentTypes} = useQuery<AppointmentType[], AxiosError>([GetAppointmentTypes], () => getAppointmentTypes(), {
        enabled: !!appointment,
        onSuccess: (data) => {
            if (data.length < 1) {
                return;
            }
            setAppointmentType(data.find(a => a.id === appointment!.appointmentTypeId));
        }
    });

    if (fetchingAppointmentDetails || fetchingAppointmentTypes || isLoadingLookupValues) {
        return <Spinner fullScreen={true} />
    }

    if (appointmentError) {
        return <div className='text-danger'>{t('external_access.appointments.confirmation.error_fetching', {appointmentId})}</div>
    }

    return (
        <div className='flex flex-col without-default-padding without-default-padding-right without-default-padding-bottom'>
            <h4 className='pt-16'>
                {t('external_access.appointments.confirmation.title')}
            </h4>
            <div className='pt-12 pb-7'>{
                appointment?.startDateTime && utils.isDateTimeInPast(appointment.startDateTime) ?
                    t('external_access.appointments.confirmation.subtitle_past') :
                    t('external_access.appointments.confirmation.subtitle')
            }</div>
            {appointment && <AppointmentDetailConfirmation appointment={appointment} appointmentType={appointmentType} />}
        </div>
    )
};

export default AppointmentConfirmation;