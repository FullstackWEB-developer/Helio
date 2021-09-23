import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import {useMutation} from 'react-query';
import {AxiosError} from 'axios';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import Button from '@components/button/button';
import {
    rescheduleAppointment
} from '@pages/appointments/services/appointments.service';
import {useHistory} from 'react-router-dom';
import {
    selectAppointmentTypes,
    selectIsAppointmentRescheduled,
    selectSelectedAppointment,
    selectSelectedAppointmentSlot
} from '@pages/external-access/appointment/store/appointments.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {
    setIsAppointmentRescheduled,
    setSelectedAppointment
} from '@pages/external-access/appointment/store/appointments.slice';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ProviderPicture from '../components/provider-picture';

const AppointmentRescheduleConfirm = () => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const appointment = useSelector(selectSelectedAppointment);
    const appointmentTypes = useSelector(selectAppointmentTypes);
    const appointmentType = appointmentTypes.find(a => a.id === Number(appointment.appointmentTypeId));
    const appointmentSlot = useSelector(selectSelectedAppointmentSlot);
    const departments = useSelector(selectLocationList);
    const isAppointmentRescheduled = useSelector(selectIsAppointmentRescheduled);
    const providers = useSelector(selectProviderList);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const provider = providers?.find(a => a.id === appointmentSlot.providerId);
    const department = departments?.find(a => a.id === appointmentSlot.departmentId);    

    const display = (value?: string) => {
        if (value) {
            return value;
        }
        return ''
    }

    const rescheduleAppointmentMutation = useMutation(rescheduleAppointment, {
        onSuccess: (newAppointment: Appointment) => {
            const startDateTime = `${dayjs(newAppointment.date).format('YYYY-MM-DD')}T${newAppointment.startTime}`;
            newAppointment.startDateTime = dayjs(startDateTime).toDate();
            dispatch(setSelectedAppointment(newAppointment));
            dispatch(setIsAppointmentRescheduled(true));
            history.push(`/o/appointment-rescheduled`);
        },
        onError: (error: AxiosError) => {
            const prefix = 'Error Message: ';
            let errMsg = error.response?.data.message;
            errMsg = errMsg.slice(errMsg.indexOf(prefix) + prefix.length);
            setErrorMessage(errMsg);
        }
    });

    const confirmAppointment = () => {
        rescheduleAppointmentMutation.mutate({
            appointmentId: parseInt(appointment.appointmentId),
            newAppointmentId: appointmentSlot.appointmentId,
            patientId: verifiedPatient.patientId
        });
    }

    return <div className='px-6'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.reschedule_appointment_title')}
            </h4>
        </div>
        <div className="pt-7">
            {t('external_access.appointments.new_appointment_date_time')}
        </div>
        <h5 className='pb-7'>
            {utils.formatUtcDate(appointmentSlot.date, 'dddd, MMM DD, YYYY')} {dayjs(appointmentSlot.startTime, 'HH:mm').format('[at] h:mm A')}
        </h5>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center pb-2'>
            <div className='h7'>
                {t('external_access.appointments.appointment_details')}
            </div>
        </div>

        <div className='flex'>                
            <ProviderPicture providerId={provider?.id} />            
            <div>
                <div>
                    {t('external_access.appointments.appointment_date', {
                        date: dayjs(appointment.startDateTime).format('dddd, MMM DD, YYYY'),
                        time: dayjs(appointment.startTime, 'hh:mm').format('hh:mm A')
                    })}
                </div>
                <div>
                    {appointmentType?.name ?? appointment.appointmentType}
                </div>
                {provider && <div className='pb-2'>
                    {t('external_access.appointments.withDoctor', {
                        name: provider.displayName
                    })}
                </div>}
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
        {rescheduleAppointmentMutation.isError && <div className='text-danger pt-12'>
            {t('external_access.appointments.reschedule_appointment_error')} {errorMessage}
        </div>}
        <div className='pt-12 flex flex-col xl:flex-row xl:space-x-6 space-x-0 space-y-6 xl:space-y-0'>
            <Button onClick={() => history.goBack()} buttonType='secondary-big' label='common.back' />

            <Button onClick={() => confirmAppointment()}
                buttonType='big'
                isLoading={rescheduleAppointmentMutation.isLoading}
                disabled={isAppointmentRescheduled}
                label='external_access.appointments.confirm_reschedule_appointment' />
        </div>
    </div>
}
export default AppointmentRescheduleConfirm;
