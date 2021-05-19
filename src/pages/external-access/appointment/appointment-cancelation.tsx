import React, {useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectSelectedAppointment} from '@pages/external-access/appointment/store/appointments.selectors';
import {selectDepartmentList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import {useMutation, useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {GetAppointmentSlots, GetAppointmentType, GetCancellationReasons} from '@constants/react-query-constants';
import {
    getAppointmentSlots,
    getCancellationReasons,
    cancelAppointment, getAppointmentTypeById
} from '@pages/appointments/services/appointments.service';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import AppointmentsListItem from '@pages/external-access/appointment/components/appointments-list-item';
import Button from '@components/button/button';
import Select from '@components/select/select';
import {AppointmentCancelReason} from '@pages/external-access/appointment/models/appointment-cancel-reason.model';
import {Option} from '@components/option/option';
import {Controller, useForm} from 'react-hook-form';
import {AppointmentCancellationModel} from '@pages/external-access/appointment/models/appointment-cancellation.model';
import {useHistory} from 'react-router-dom';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';
import './appointment.scss';
import {setSelectedAppointmentSlot} from '@pages/external-access/appointment/store/appointments.slice';
import {CancellationReasonTypes} from '@pages/external-access/models/cancellation-reason-types.enum';

const AppointmentCancelation = () => {
    dayjs.extend(utc);
    const {t} = useTranslation();
    const history = useHistory();
    const requiredText = t('common.required');
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const appointment = useSelector(selectSelectedAppointment);
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);
    const maxSlots = 3;
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getDepartments());
    }, [dispatch]);

    const provider = providers?.find(a => a.id === appointment.providerId);
    const department = departments?.find(a => a.id === appointment.departmentId);
    const startDate = dayjs().utc().toDate();
    const endDate = dayjs().utc().add(7, 'day').toDate();

    const {isLoading: isAppointmentTypesLoading, data: appointmentType} = useQuery<AppointmentType, AxiosError>([GetAppointmentType, appointment.appointmentTypeId], () =>
            getAppointmentTypeById(appointment.appointmentTypeId),
        {
            enabled: !!appointment
        }
    );

    const {isLoading: isAppointmentSlotsLoading, data: appointmentSlots, refetch} = useQuery<AppointmentSlot[], AxiosError>([GetAppointmentSlots, provider?.id, department?.id, appointment.appointmentTypeId], () =>
            getAppointmentSlots(provider?.id as number, department?.id as number, appointment.appointmentTypeId, startDate, endDate),
        {
            enabled: false
        }
    );

    const {isLoading: isGetCancellationReasonsLoading, data: cancellationReasons} = useQuery<AppointmentCancelReason[], AxiosError>([GetCancellationReasons], () =>
            getCancellationReasons()
    );

    useEffect(() => {
        if(provider?.id && department?.id)
        {
            refetch();
        }
    }, [department?.id, provider?.id, refetch]);

    const display = (value?:string) => {
        if (value) {
            return value;
        }
        return ''
    }

    const getCancellationReasonsOptions = (reasons: AppointmentCancelReason[] | undefined) => {
        return reasons ? reasons.filter(r => r.type === CancellationReasonTypes.Cancel).map((item: AppointmentCancelReason) => {
            return {
                value:  item.id.toString(),
                label: item.name
            } as Option;
        }) : [];
    }

    const cancelAppointmentMutation = useMutation(cancelAppointment, {
        onSuccess: () => {
            history.push(`/o/appointment-canceled`);
        },
        onError: (error: AxiosError) => {
            const prefix = 'Error Message: ';
            let errMsg = error.response?.data.message;
            errMsg = errMsg.slice(errMsg.indexOf( prefix ) + prefix.length);
            setErrorMessage(errMsg);
        }
    });

    const {handleSubmit, control, errors,
        formState: { isDirty },} = useForm({
        mode: 'onBlur'
    });

    const onSubmit = ( values : AppointmentCancellationModel) => {
        values.patientId = verifiedPatient.patientId;
        values.cancellationReason = getCancellationReasonsOptions(cancellationReasons)
            .find(r => r.value === values.appointmentCancelReasonId.toString())?.label || '';

        cancelAppointmentMutation.mutate({
            appointmentId: parseInt(appointment.appointmentId),
            data: values
        });
    }

    const selectSlot = (slot: AppointmentSlot) => {
        dispatch(setSelectedAppointmentSlot(slot));
        history.push('/o/appointment-reschedule-confirm');
    }

    const showMoreSlots = () => {
        history.push(`/o/appointment-reschedule`);
    }

    if (isAppointmentTypesLoading || isAppointmentSlotsLoading || isGetCancellationReasonsLoading) {
        return <ThreeDots/>
    }

    if (!verifiedPatient) {
        return <div>{t('common.error')}</div>
    }

    return <div className='2xl:px-48'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_cancelation')}
            </h4>
        </div>
        {appointmentType?.cancelable &&
        appointmentType?.cancelationFee &&
        (appointmentType?.cancelationTimeFrame &&
            dayjs.utc(appointment.startDateTime).diff(dayjs.utc(), 'hour') < appointmentType?.cancelationTimeFrame) &&
                <div className='pt-9 xl:pt-8'>
                    <div className='warning-message p-4 body2'>
                        <Trans i18nKey="external_access.appointments.will_be_charged">
                            {appointmentType.cancelationTimeFrame?.toString()}
                            {appointmentType.cancelationFee?.toString()}
                        </Trans>
                    </div>
                </div>
        }
        <div className='pt-6 pb-6'>
            {t('external_access.appointments.please_confirm')}
        </div>
        <div className='pb-6'>
            <div className='h7'>
                {t('external_access.appointments.you_can_reschedule')}
            </div>
        </div>
        <div className='pb-6'>
            <Trans i18nKey="external_access.appointments.appointment_slots">
                {display(provider?.displayName)}
                {display(department?.name)}
            </Trans>
        </div>
        <div className='pb-6'>
            {
                appointmentSlots?.slice(0, maxSlots).map((slot) => {
                    return <div key={slot.appointmentId}
                                className='cursor-pointer'
                                onClick={() => selectSlot(slot)}>
                        <AppointmentsListItem item={slot}/></div>
                })
            }
        </div>
        {
            appointmentSlots && appointmentSlots?.length > 3 && <div className='pb-16'>
                <Button buttonType='secondary' label='external_access.appointments.view_more_slots' onClick={() => showMoreSlots()}/>
            </div>
        }
        <div className='pb-6'>
            <div className='h7'>
                {t('external_access.appointments.want_to_cancel')}
            </div>
        </div>
        <div className='pb-6'>
            {t('external_access.appointments.to_cancel')}
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='lg:w-1/2 xl:w-1/3 2xl:w-1/4'>
                    <Controller
                        name='appointmentCancelReasonId'
                        control={control}
                        rules={{required: requiredText}}
                        defaultValue={''}
                        render={(props) => (
                            <Select
                                options={getCancellationReasonsOptions(cancellationReasons)}
                                label='external_access.appointments.select_reason'
                                {...props}
                                data-test-id={'external-access-appointments-cancellation-reasons'}
                                error={errors.appointmentCancelReasonId?.message}
                                required={true}
                                value={props.value}
                                onSelect={(option?: Option)=>{
                                    if(option){
                                        props.onChange(option.value);
                                    }
                                }}
                            />
                        )}
                    />
                </div>
                {cancelAppointmentMutation.isError && <div className='text-danger'>
                    {t('external_access.appointments.cancel_appointment_error')} {errorMessage}
                </div>}
                <div className='pt-6 pb-16'>
                    <Button buttonType='big' disabled={!isDirty} label='external_access.appointments.cancel_appointment' type='submit'/>
                </div>
            </form>
        </div>
    </div>
}

export default AppointmentCancelation;
