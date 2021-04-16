import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Controller, useForm } from 'react-hook-form';
import DateTimeInput from '../../../../shared/components/date-time-input/date-time-input';
import Button from '../../../../shared/components/button/button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getOpenSlots } from '../services/reschedule-appointment.service';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppointmentList } from '../../../patients/store/patients.selectors';
import dayjs from 'dayjs';

interface FindOpenSlotsFormProps {
    selectedAppointmentId: string
}

const FindOpenSlotsForm = ({ selectedAppointmentId }: FindOpenSlotsFormProps) => {
    const { handleSubmit, control, errors } = useForm();
    const { t } = useTranslation();
    const appointments = useSelector(selectAppointmentList);
    const dispatch = useDispatch();

    const findOpenSlots = async (data: any) => {
        const selectedAppointment = appointments.find(a => a.appointmentId === selectedAppointmentId);
        if (selectedAppointment) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            dispatch(getOpenSlots(selectedAppointment.providerId, selectedAppointment.departmentId, selectedAppointment.appointmentTypeId, startDate, endDate));
        }
    }

    return <form onSubmit={handleSubmit(findOpenSlots)}>
        <Controller data-test-id='reschedule_appointment_start_date'
            type='date'
            control={control}
            name='startDate'
            id='startDate'
            rules={{ required: t('common.required') as string }}
            as={DateTimeInput}
            className={'w-full'}
            defaultValue={dayjs().format('yyyy-MM-dd')}
            error={errors.startDate?.message}
            label={'reschedule_appointment.start_date'}
        />
        <Controller data-test-id='reschedule_appointment_end_date'
            type='date'
            name='endDate'
            control={control}
            rules={{ required: t('common.required') as string }}
            id='endDate'
            className={'w-full'}
            defaultValue={dayjs().add(7, 'day').format('yyyy-MM-dd')}
            as={DateTimeInput}
            error={errors.endDate?.message}
            label={'reschedule_appointment.end_date'}
        />
        <div className={'flex justify-center pt-2'}>
            <Button
                data-test-id='reschedule-appointment-find-slots-button'
                type={'submit'}
                label={'reschedule_appointment.find_open_slots'} />
        </div>
    </form>
}

export default withErrorLogging(FindOpenSlotsForm);
