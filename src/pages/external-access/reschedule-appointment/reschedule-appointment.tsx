import withErrorLogging from '@shared/HOC/with-error-logging';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { getDepartments, getProviders } from '@shared/services/lookups.service';
import {
    clearAppointments,
    clearVerifiedPatient
} from '../../patients/store/patients.slice';
import { selectAppointmentList, selectVerifiedPatent } from '../../patients/store/patients.selectors';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import Select from '@components/select/select';
import { Option } from '@components/option/option';
import { selectProviderList } from '@shared/store/lookups/lookups.selectors';
import { Appointment } from '../appointment/models/appointment.model';
import {
    selectAppointmentSchedulingError,
    selectIsAppointmentRescheduling,
    selectIsOpenSlotsLoading,
    selectRescheduledAppointment,
} from './store/reschedule-appointment.selectors';
import FindOpenSlotsForm from './components/find-open-slots-form';
import CompleteReschedulingForm from './components/complete-rescheduling-form';
import { clearRescheduleAppointmentState, selectedAppointmentUpdated } from './store/reschedule-appointment.slice';
import dayjs from 'dayjs';
import { getAppointments } from '@pages/patients/services/patients.service';

const RescheduleAppointment = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const isOpenSlotsLoading = useSelector(selectIsOpenSlotsLoading);
    const isRescheduling = useSelector(selectIsAppointmentRescheduling);
    const error = useSelector(selectAppointmentSchedulingError);
    const rescheduledAppointment = useSelector(selectRescheduledAppointment);
    const [selectedAppointment, setSelectedAppointment] = useState<Option>();
    const providers = useSelector(selectProviderList);
    const appointments = useSelector(selectAppointmentList);

    useEffect(() => {
        if (verifiedPatient) {
            if (verifiedPatient) {
                dispatch(getAppointments(verifiedPatient.patientId));
                dispatch(getDepartments());
                dispatch(getProviders());
            }
        }
        return () => {
            dispatch(clearAppointments());
            dispatch(clearRescheduleAppointmentState());
            dispatch(clearVerifiedPatient());
        }
    }, [dispatch, verifiedPatient]);


    const getAppointmentOptions = (appointments: Appointment[]) => {
        if (appointments && appointments.length > 0) {
            const options = appointments.map(appointment => {
                const date = new Date(appointment.date);
                const dateStr = ` ${dayjs(date).format('MM/dd/yyyy')} at ${appointment.startTime}`;
                let label = `Your ${appointment.appointmentType} appointment on ${dateStr}`;
                if (appointment.providerId > 0 && providers && providers.length > 0) {
                    const provider = providers.filter(a => a.id === appointment.providerId);
                    if (provider?.length > 0) {
                        label += ` with ${provider[0].displayName}`;
                    }
                }
                return {
                    value: appointment.appointmentId,
                    label
                } as Option;
            });
            options.unshift({
                value: '',
                label: ''
            });

            return options;
        } else {
            return [];
        }
    }

    const updateSelectedAppointment = (option?: Option) => {
        if(option){
            setSelectedAppointment(option);
            dispatch(selectedAppointmentUpdated());
        }               
    }

    const currentAppointmentsOptions: Option[] = getAppointmentOptions(appointments);
    if (!verifiedPatient) {
        return <div>{t('hipaa_validation_form.hipaa_verification_failed')}</div>
    }

    if (!appointments || isOpenSlotsLoading || isRescheduling) {
        return (<ThreeDots />);
    }

    if (rescheduledAppointment) {
        return (<div>{t('reschedule_appointment.appointment_rescheduled')}</div>);
    }

    if (error) {
        return (<div>{t(error)}</div>);
    }

    if (appointments.length === 0) {
        return (<div>{t('appointment.no_appointments')}</div>);
    }

    return (
        <div className={'w-96 py-4 mx-auto flex flex-col'}>
            <Select
                options={currentAppointmentsOptions}                
                value={selectedAppointment}
                onSelect={(option?: Option) => updateSelectedAppointment(option)}
                data-test-id='reschedule-existing-appointment-select'
                label={'reschedule_appointment.select_appointment_to_reschedule'}
            />
            <div hidden={!selectedAppointment}>
                <FindOpenSlotsForm selectedAppointmentId={selectedAppointment?.value as string} />
            </div>

            <div hidden={!selectedAppointment}>
                <CompleteReschedulingForm selectedAppointmentId={selectedAppointment?.value as string} />
            </div>
        </div>)
}
export default withErrorLogging(RescheduleAppointment);
