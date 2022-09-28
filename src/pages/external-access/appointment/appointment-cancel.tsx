import React, {useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllProviderList, selectLocationList} from '@shared/store/lookups/lookups.selectors';
import {getAllProviders, getLocations} from '@shared/services/lookups.service';
import {useMutation, useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {
    GetAppointmentSlots,
    GetAppointmentType,
    GetCancellationReasons,
    GetPatientAppointments
} from '@constants/react-query-constants';
import {
    getAppointmentSlots,
    getCancellationReasons,
    cancelAppointment, getAppointmentTypeById
} from '@pages/appointments/services/appointments.service';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import Button from '@components/button/button';
import Select from '@components/select/select';
import {Option} from '@components/option/option';
import {Controller, useForm} from 'react-hook-form';
import {AppointmentCancellationModel} from '@pages/external-access/appointment/models/appointment-cancellation.model';
import {useHistory, useParams} from 'react-router-dom';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';
import './appointment.scss';
import {
    setSelectedAppointment,
    setSelectedAppointmentSlot
} from '@pages/external-access/appointment/store/appointments.slice';
import {CancellationReasonTypes} from '@pages/external-access/models/cancellation-reason-types.enum';
import AppointmentTable from '@pages/external-access/appointment/components/appointment-table';
import Spinner from '@components/spinner/Spinner';
import {Appointment} from '@pages/external-access/appointment/models';
import {Location, Provider} from '@shared/models';
import {getAppointments} from '@pages/patients/services/patients.service';
import {AppointmentReschedulePath} from '@app/paths';
import {CancellationReason} from '@shared/models/cancellation-reason.model';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';

const AppointmentCancel = () => {
    dayjs.extend(utc);
    const {t} = useTranslation();
    const history = useHistory();
    const requiredText = t('common.required');
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const [appointment, setAppointment] = useState<Appointment>();
    const locations = useSelector(selectLocationList);
    const {appointmentId} = useParams<{appointmentId: string}>();
    const providers = useSelector(selectAllProviderList);
    const [provider, setProvider] = useState<Provider>();
    const [appointmentTypeId, setAppointmentTypeId] = useState<number>(0);
    const [location, setLocation] = useState<Location>();
    const maxSlots = 3;

    useEffect(() => {
        dispatch(getAllProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const {isLoading: isAppointmentsLoading, error, isFetchedAfterMount} = useQuery<Appointment[], AxiosError>([GetPatientAppointments, verifiedPatient?.patientId], () =>
            getAppointments(verifiedPatient.patientId),
        {
            onSuccess: (data) => {
                const appointment = data.find(a => a.appointmentId === appointmentId);
                if (!appointment) {
                    return;
                }
                setAppointment(appointment);
                setAppointmentTypeId(appointment.appointmentTypeId);
                dispatch(setSelectedAppointment(appointment));
                setProvider(providers?.find(a => a.id === appointment.providerId));
                setLocation(locations?.find(a => a.id === appointment.departmentId));
            }
        }
    );
    const startDate = dayjs().utc().toDate();
    const endDate = dayjs().utc().add(7, 'day').toDate();

    const {isLoading: isAppointmentTypesLoading, data: appointmentType} = useQuery<AppointmentType, AxiosError>([GetAppointmentType, appointmentTypeId], () =>
        getAppointmentTypeById(appointmentTypeId),
        {
            enabled: appointmentTypeId > 0
        }
    );

    const {isLoading: isAppointmentSlotsLoading, data: appointmentSlots, refetch} =
        useQuery<AppointmentSlot[], AxiosError>([GetAppointmentSlots, provider?.id, location?.id, appointmentTypeId], () =>
        getAppointmentSlots({
            providerId: [provider?.id as number],
            departmentId: location?.id as number,
            appointmentTypeId: appointmentTypeId,
            startDate: startDate,
            endDate: endDate,
            firstAvailable: false
        }),
        {
            enabled: false
        }
    );

    const {isLoading: isGetCancellationReasonsLoading, data: cancellationReasons} = useQuery<CancellationReason[], AxiosError>([GetCancellationReasons], () =>
        getCancellationReasons()
    );

    useEffect(() => {
        if (provider?.id && location?.id) {
            refetch();
        }
    }, [location?.id, provider?.id, refetch]);

    const display = (value?: string) => {
        if (value) {
            return value;
        }
        return ''
    }

    const getCancellationReasonsOptions = (reasons: CancellationReason[] | undefined) => {
        return reasons ? reasons.filter(r => r.type === CancellationReasonTypes.Cancel).map((item: CancellationReason) => {
            return {
                value: item.id.toString(),
                label: item.name
            } as Option;
        }) : [];
    }

    const cancelAppointmentMutation = useMutation(cancelAppointment, {
        onSuccess: () => {
            history.push(`/o/appointment-canceled`);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'external_access.appointments.cancel_failed',
                type: SnackbarType.Error
            }))
        }
    });

    const {handleSubmit, control, errors,
        formState: {isDirty}, } = useForm({
            mode: 'onBlur'
        });

    const onSubmit = (values: AppointmentCancellationModel) => {
        values.patientId = verifiedPatient.patientId;
        values.cancellationReason = getCancellationReasonsOptions(cancellationReasons)
            .find(r => r.value === values.appointmentCancelReasonId.toString())?.label || '';

        cancelAppointmentMutation.mutate({
            appointmentId: parseInt(appointment!.appointmentId),
            data: values
        });
    }

    const selectSlot = (slot: AppointmentSlot) => {
        dispatch(setSelectedAppointmentSlot(slot));
        history.push('/o/appointment-reschedule-confirm');
    }

    const showMoreSlots = () => {
        history.push(`${AppointmentReschedulePath}/${appointment?.appointmentId}`);
    }

    const canCancelable = (hasChargeControl: boolean) => {
        if(hasChargeControl)
            return appointmentType?.cancelable &&
                appointmentType?.cancelationFee &&
                (appointmentType?.cancelationTimeFrame && dayjs.utc(appointment!.startDateTime).diff(dayjs.utc(), 'hour') < appointmentType?.cancelationTimeFrame);

        return appointmentType?.cancelable &&
            (appointmentType?.cancelationTimeFrame && dayjs.utc(appointment!.startDateTime).diff(dayjs.utc(), 'hour') >= appointmentType?.cancelationTimeFrame);
    }

    const canReschedulable = (minLenght: number) => {
        return appointmentType?.reschedulable && appointmentSlots && appointmentSlots?.length > minLenght
    }

    if (!isFetchedAfterMount || isAppointmentTypesLoading || isAppointmentSlotsLoading || isGetCancellationReasonsLoading || isAppointmentsLoading) {
        return <Spinner fullScreen />
    }

    if (error) {
        return <div>{t('external_access.appointments.fetch_failed')}</div>
    }

    if (!appointment) {
        return <div>{t('external_access.appointments.no_single_appointment_with_id', {id : appointmentId})}</div>
    }

    return <div>
        <div className='flex items-center w-full 2xl:whitespace-pre 2xl:h-12 2xl:my-3'>
            <h4>
                {t('external_access.appointments.appointment_cancelation')}
            </h4>
        </div>
        {appointmentType && canCancelable(true) ?
                <div className='pt-9 xl:pt-8'>
                    <div className='p-4 warning-message body2'>
                        <Trans i18nKey="external_access.appointments.will_be_charged">
                            {appointmentType.cancelationTimeFrame?.toString()}
                            {appointmentType.cancelationFee?.toString()}
                        </Trans>
                    </div>
                </div> : undefined
        }

        {canCancelable(false) &&
                <div className='pt-8 pb-6'>
                    {t('external_access.appointments.please_confirm')}
                </div>
        }

        {canReschedulable(0) &&
            <>
                <div className=''>
                    <div className='h7'>
                        {t('external_access.appointments.you_can_reschedule')}
                    </div>
                </div>
                <div className='pt-4'>
                    <Trans i18nKey="external_access.appointments.appointment_slots">
                        {display(provider?.displayName)}
                        {display(location?.name)}
                    </Trans>
                </div>
                <div className='pt-12 pb-12'>
                    <AppointmentTable
                        isDetailsColumnVisible={false}
                        isRowHoverDisabled
                        data={appointmentSlots?.slice(0, maxSlots)}
                        onActionClick={(slot) => selectSlot(slot as AppointmentSlot)} />
                </div>
            </>
        }
        {canReschedulable(3) &&
            <div className='pb-16'>
                <Button buttonType='secondary-big' label='external_access.appointments.view_more_slots' onClick={() => showMoreSlots()} />
            </div>
        }
        {canReschedulable(0) &&
            <div className='pb-6'>
                <div className='h7'>
                    {t('external_access.appointments.want_to_cancel')}
                </div>
            </div>
        }
        {canCancelable(false) &&
            <div className='pb-5'>
                {t('external_access.appointments.to_cancel')}
            </div>
        }
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {canCancelable(false) &&
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
                                    onSelect={(option?: Option) => {
                                        if (option) {
                                            props.onChange(option.value);
                                        }
                                    }}
                                />
                            )}
                        />
                    </div>
                }
                {!canCancelable(false) &&
                    <div className='pt-6'>
                        {t('external_access.appointments.cancel_appointment_reach_us')}
                    </div>
                }
                <div className='pt-6'>
                    <Button buttonType='big' isLoading={cancelAppointmentMutation.isLoading} disabled={!isDirty || cancelAppointmentMutation.isError} label='external_access.appointments.cancel_appointment' type='submit' />
                </div>
            </form>
        </div>
    </div>
}

export default AppointmentCancel;
