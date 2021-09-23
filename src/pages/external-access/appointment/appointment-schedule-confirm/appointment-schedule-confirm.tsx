import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import Button from '@components/button/button';
import {
    getAppointmentTypesForPatient,
    scheduleAppointment
} from '@pages/appointments/services/appointments.service';
import {useHistory} from 'react-router-dom';
import {
    selectSelectedAppointmentSlot
} from '@pages/external-access/appointment/store/appointments.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {
    setSelectedAppointment
} from '@pages/external-access/appointment/store/appointments.slice';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {AppointmentType} from '@pages/external-access/appointment/models';
import {GetAppointmentTypesForPatient} from '@constants/react-query-constants';
import Spinner from '@components/spinner/Spinner';
import ProviderPicture from '../components/provider-picture';

const AppointmentScheduleConfirm = () => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const providers = useSelector(selectProviderList);
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const appointmentSlot = useSelector(selectSelectedAppointmentSlot);
    const departments = useSelector(selectLocationList);

    const [errorMessage, setErrorMessage] = useState('');

    const provider = providers?.find(a => a.id === appointmentSlot?.providerId);
    const department = departments?.find(a => a.id === appointmentSlot?.departmentId);

    const {isLoading: appointmentTypesLoading, data: appointmentTypes} = useQuery<AppointmentType[], AxiosError>([GetAppointmentTypesForPatient],
        () => getAppointmentTypesForPatient(verifiedPatient.patientId, verifiedPatient.primaryProviderId || verifiedPatient.defaultProviderId),
        {
            enabled: !!verifiedPatient
        });

    const display = (value?: string) => {
        if (value) {
            return value;
        }
        return '';
    }

    useEffect(() => {
        if (!appointmentSlot) {
            history.push('/o/appointment-schedule/select');
        }
    }, [appointmentSlot, history]);

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const scheduleAppointmentMutation = useMutation(scheduleAppointment, {
        onSuccess: (newAppointment: Appointment) => {
            const startDateTime = `${dayjs(newAppointment.date).format('YYYY-MM-DD')}T${newAppointment.startTime}`;
            newAppointment.startDateTime = dayjs(startDateTime).toDate();
            dispatch(setSelectedAppointment(newAppointment));
            history.push(`/o/appointment-scheduled`);
        },
        onError: (error: AxiosError) => {
            const prefix = t('external_access.prefix_error_message');
            let errMsg = error.response?.data.message;
            errMsg = errMsg.slice(errMsg.indexOf(prefix) + prefix.length);
            setErrorMessage(errMsg);
        }
    });

    const confirmAppointment = () => {
        scheduleAppointmentMutation.mutate({
            appointmentId: appointmentSlot.appointmentId,
            appointmentTypeId: Number(appointmentSlot.appointmentTypeId),
            departmentId: appointmentSlot.departmentId,
            patientId: verifiedPatient.patientId
        });
    }

    const getAppointmentTypeName = (appointmentTypeId: number) => {
        return appointmentTypes?.find(a => a.id === appointmentTypeId)?.name;
    }

    if (!verifiedPatient) {
        return <div>{t('external_access.not_verified_patient')}</div>;
    }

    if (appointmentTypesLoading) {
        return <Spinner fullScreen />
    }

    return (
        <div className='px-6'>
            <div className='flex items-center w-full 2xl:whitespace-pre 2xl:h-12 2xl:my-3'>
                <h4>
                    {dayjs(appointmentSlot.date).format('dddd, MMM DD, YYYY')}
                </h4>
            </div>
            <h5 className='pt-7'>
                {dayjs(appointmentSlot.startTime, 'HH:mm').format('h:mm A')}
            </h5>
            <div className='flex pt-6'>
                <ProviderPicture providerId={provider?.id} />
                <div>
                    <h6 className='my-1'>
                        {getAppointmentTypeName(appointmentSlot.appointmentTypeId)}
                    </h6>
                    {provider &&
                        <div className='pb-2 body1'>
                            {t('external_access.appointments.withDoctor', {
                                name: provider.displayName
                            })}
                        </div>}
                    <div className='mt-7'>
                        <div className='subtitle'>
                            {display(department?.name)}
                        </div>
                        <div>
                            {display(department?.address)}
                        </div>
                        <div>
                            {`${display(department?.address2)} ${display(department?.city)} ${display(department?.state)}, ${display(department?.zip)}`}
                        </div>
                    </div>
                </div>
            </div>
            {scheduleAppointmentMutation.isError && <div className='pt-12 text-danger'>
                {t('external_access.appointments.reschedule_appointment_error')} {errorMessage}
            </div>}
            <div className='flex flex-col pt-12 space-x-0 space-y-6 xl:flex-row xl:space-x-6 xl:space-y-0'>
                <Button onClick={() => history.goBack()} buttonType='secondary-big' label='common.back' />

                <Button onClick={() => confirmAppointment()}
                    buttonType='big'
                    isLoading={scheduleAppointmentMutation.isLoading}
                    label='external_access.appointments.confirm_schedule_appointment'
                />
            </div>
        </div>
    );
};


export default AppointmentScheduleConfirm;
