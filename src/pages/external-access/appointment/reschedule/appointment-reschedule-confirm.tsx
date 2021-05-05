import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import {useMutation} from 'react-query';
import {AxiosError} from 'axios';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import Button from '@components/button/button';
import {
    rescheduleAppointment
} from '@pages/appointments/services/appointments.service';
import {useHistory} from 'react-router-dom';
import {
    selectSelectedAppointment,
    selectSelectedAppointmentSlot
} from '@pages/external-access/appointment/store/appointments.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {selectDepartmentList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {setSelectedAppointment} from '@pages/external-access/appointment/store/appointments.slice';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import dayjs from 'dayjs';

const AppointmentRescheduleConfirm = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const appointment = useSelector(selectSelectedAppointment);
    const appointmentSlot = useSelector(selectSelectedAppointmentSlot);
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getDepartments());
    }, [dispatch]);

    const provider = providers?.find(a => a.id === appointmentSlot.providerId);
    const department = departments?.find(a => a.id === appointmentSlot.departmentId);

    const display = (value?:string) => {
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
            history.push(`/o/appointment-rescheduled`);
        },
        onError: (error: AxiosError) => {
            const prefix = 'Error Message: ';
            let errMsg = error.response?.data.message;
            errMsg = errMsg.slice(errMsg.indexOf( prefix ) + prefix.length);
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
    const redirectToReschedule = () => {
        history.push(`/o/appointment-reschedule`);
    }

    return  <div className='2xl:px-48'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {utils.formatUtcDate(appointmentSlot.date, 'dddd, MMM DD, YYYY')}
            </h4>
        </div>
        <h5 className='pt-6 pb-2'>
            {`${appointmentSlot.startTime} ${utils.formatUtcDate(appointmentSlot.date, 'A')}`}
        </h5>
        {provider && <div className='pb-6'>
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
        {rescheduleAppointmentMutation.isError && <div className='text-danger'>
            {t('external_access.appointments.reschedule_appointment_error')} {errorMessage}
        </div>}
        <div className='pt-12 flex flex-col xl:flex-row xl:space-x-6 space-x-0 space-y-6 xl:space-y-0'>
            <Button onClick={() => confirmAppointment()} buttonType='medium' label='external_access.appointments.confirm_reschedule_appointment' />
            <Button onClick={() => redirectToReschedule()} buttonType='secondary' label='common.back' />
        </div>
    </div>
}
export default AppointmentRescheduleConfirm;
