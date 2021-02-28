import { Controller, useForm } from 'react-hook-form';
import Select, { Option } from '../../../../shared/components/select/select';
import Button from '../../../../shared/components/button/button';
import React from 'react';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectOpenSlots } from '../store/reschedule-appointment.selectors';
import { rescheduleAppointment } from '../services/reschedule-appointment.service';
import { selectVerifiedPatent } from '../../../patients/store/patients.selectors';
import dayjs from 'dayjs';

interface CompleteReschedulingFormProps {
    selectedAppointmentId: string
}

const CompleteReschedulingForm = ({ selectedAppointmentId }: CompleteReschedulingFormProps) => {
    const { handleSubmit, control, errors } = useForm();
    const { t } = useTranslation();
    const openSlots = useSelector(selectOpenSlots);
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const dispatch = useDispatch();

    const getSlotOptions = (): Option[] => {
        if (openSlots && openSlots.length > 0) {
            const options = openSlots.map(slot => {
                const date = new Date(slot.date);
                const dateStr = ` ${dayjs(date).format('MM/dd/yyyy')} at ${slot.startTime}`;
                const label = `${dateStr}`;
                return {
                    value: slot.appointmentId.toString(),
                    label
                } as Option;
            });
            options.unshift({
                value: '',
                label: ''
            });
            return options;
        }
        return [];
    }

    const reschedule = (data: any) => {
        dispatch(rescheduleAppointment(selectedAppointmentId, parseInt(data.newAppointmentId), verifiedPatient.patientId));
    }


    if (openSlots && openSlots.length === 0) {
        return <div>{t('reschedule_appointment.no_slots_found')}</div>
    }

    return (<div hidden={!openSlots || openSlots.length === 0}>
        <form onSubmit={handleSubmit(reschedule)}>
            <Controller
                options={getSlotOptions()}
                as={Select}
                rules={{ required: t('common.required') as string }}
                control={control}
                className={'w-full'}
                error={errors.newAppointmentId?.message}
                data-test-id='reschedule-new-appointment-select'
                label={t('reschedule_appointment.new_appointment')}
                name={'newAppointmentId'}
            />
            <div className={'flex justify-center pt-2'}>
                <Button data-test-id='reschedule-appointment-reschedule-button' className={'btn-secondary'} type={'submit'} label={t('reschedule_appointment.reschedule')} />
            </div>
        </form>
    </div>);
}

export default withErrorLogging(CompleteReschedulingForm);
