import React, {useEffect, useMemo, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {getAllProviders, getLocations} from '@shared/services/lookups.service';
import Button from '@components/button/button';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllProviderList, selectLocationList} from '@shared/store/lookups/lookups.selectors';
import './appointment.scss';
import {
    setRescheduleTimeFrame
} from '@pages/external-access/appointment/store/appointments.slice';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import classnames from 'classnames';
import ProviderPicture from './components/provider-picture';
import {Appointment, AppointmentType} from '@pages/external-access/appointment/models';
import {Location, Provider} from '@shared/models';
import {useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {GetAppointmentTypes, GetPatientAppointments} from '@constants/react-query-constants';
import {getAppointments} from '@pages/patients/services/patients.service';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import Spinner from '@components/spinner/Spinner';
import {getAppointmentTypes} from '@pages/appointments/services/appointments.service';

const AppointmentDetail = () => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const history = useHistory();
    const dispatch = useDispatch();
    const {appointmentId} = useParams<{appointmentId: string}>();
    const defaultTimeFrame = 7;
    const [appointment, setAppointment] = useState<Appointment>();
    const [appointmentType, setAppointmentType] = useState<AppointmentType>();
    const locations = useSelector(selectLocationList);
    const providers = useSelector(selectAllProviderList);
    const [provider, setProvider] = useState<Provider>();
    const [appointmentTypeId, setAppointmentTypeId] = useState<number>(0);
    const [location, setLocation] = useState<Location>();
    useEffect(() => {
        dispatch(getAllProviders());
        dispatch(getLocations());
    }, [dispatch]);


    useEffect(() => {
        dispatch(setRescheduleTimeFrame(appointmentType?.rescheduleTimeFrame || defaultTimeFrame));
    }, [appointmentType?.rescheduleTimeFrame, dispatch]);

    const {isLoading: appointmentTypesLoading, refetch: fetchAppointmentTypes} = useQuery<AppointmentType[], AxiosError>([GetAppointmentTypes], () => getAppointmentTypes(), {
        enabled: false,
        onSuccess: (data) => {
            if (data.length < 1) {
                return;
            }
            setAppointmentType(data.find(a => a.id === appointmentTypeId));
        }
    });

    const {isLoading: isAppointmentsLoading, error, isFetchedAfterMount} = useQuery<Appointment[], AxiosError>([GetPatientAppointments, verifiedPatient?.patientId], () =>
            getAppointments(verifiedPatient.patientId),
        {
            onSuccess: (data) => {
                const appointment = data.find(a => a.appointmentId === appointmentId);
                if (!appointment) {
                    return;
                }
                setAppointment(appointment);
                fetchAppointmentTypes().then();
                setAppointmentTypeId(Number(appointment.appointmentTypeId));
                setProvider(providers?.find(a => a.id === appointment.providerId));
                setLocation(locations?.find(a => a.id === appointment.departmentId));
            }
        }
    );

    const display = (value?: string) => {
        if (value) {
            return value;
        }
        return ''
    }

    const displayCancel = () => {
        return !appointmentType || appointmentType.cancelable;
    }

    const displayReschedule = () => {
        return !appointmentType || appointmentType.reschedulable;
    }

    const redirectToReschedule = () => {
        history.push(`/o/appointment-reschedule/${appointment?.appointmentId}`);
    }
    const redirectToCancel = () => {
        history.push(`/o/appointment-cancel/${appointment?.appointmentId}`);
    }


    const cancelRescheduleMessage = useMemo(() => {
        if (!appointmentType) {
            return ''
        }
        if (appointmentType.cancelable && !appointmentType.reschedulable) {
            return 'external_access.appointments.can_not_be_rescheduled';
        }
        if (!appointmentType.cancelable && appointmentType.reschedulable) {
            return 'external_access.appointments.can_not_be_canceled';
        }
        if (!appointmentType.cancelable && !appointmentType.reschedulable) {
            return 'external_access.appointments.can_not_be_rescheduled_canceled';
        }
    }, [appointmentType]);


    if (isAppointmentsLoading || !isFetchedAfterMount || appointmentTypesLoading) {
        return <Spinner />
    }

    if (error) {
        return <div>{t('external_access.appointments.fetch_failed')}</div>
    }

    if (!appointment) {
        return <div>{t('external_access.appointments.no_single_appointment_with_id', {id : appointmentId})}</div>
    }
    return <div>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_details')}
            </h4>
        </div>
        {!!cancelRescheduleMessage && <div className='pt-6 pb-2 w-4/5'>
            <div className='warning-message body2 px-6 py-3.5 rounded border border-solid'>
                {t(cancelRescheduleMessage)}
            </div>
        </div>
        }
        <div className='pt-6 pb-9'>
            {t('external_access.appointments.see_appointment_details')}
        </div>
        <div className='pb-2'>
            <h5>
                {t('external_access.appointments.appointment_date', {
                    date: dayjs(appointment?.startDateTime).format('dddd, MMM DD, YYYY'),
                    time: dayjs(appointment?.startTime, 'hh:mm').format('hh:mm A')
                })}
            </h5>
        </div>
        <div className='flex'>
            <ProviderPicture providerId={provider?.id} />
            <div>
                <h6 className='pb-2'>
                    {appointmentType?.name ?? appointment?.appointmentType}
                </h6>
                {provider && <div className='pb-6'>
                    {t('external_access.appointments.with_doctor', {
                        name: provider.displayName
                    })}
                </div>}
                <div className='subtitle'>
                    {display(location?.name)}
                </div>
                <div>
                    {display(location?.address)}
                </div>
                <div>
                    {`${display(location?.address2)} ${display(location?.city)} ${display(location?.state)}, ${display(location?.zip)}`}
                </div>
            </div>
        </div>

        <div className='pt-12 flex flex-col xl:flex-row xl:space-x-6 space-x-0 space-y-6 xl:space-y-0'>
            <Button disabled={!displayReschedule()} onClick={() => redirectToReschedule()} buttonType='big' label='external_access.appointments.reschedule' />
            <Button disabled={!displayCancel()} onClick={() => redirectToCancel()} buttonType='secondary-big' label='common.cancel' />
        </div>

        {appointmentType?.instructions && <>
            <div className='pt-20'>
                {t('external_access.appointments.instructions')}
            </div>
            <div className='border-b pt-2' />
            <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: appointmentType?.instructions}} />
        </>
        }

        {location?.parkingInformation && <>
            <div className={classnames({'pt-8': appointmentType?.instructions, 'pt-20': !appointmentType?.instructions})}>
                {t('external_access.appointments.parking_information')}
            </div>
            <div className='border-b pt-2' />
            <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: location?.parkingInformation}} />
        </>
        }
        <div className={classnames({'pt-8': location?.parkingInformation, 'pt-20': !location?.parkingInformation})}>
            {t('external_access.appointments.directions')}
        </div>
        <div className='border-b pt-2' />
        <div className='pt-4 body2'>
            <Trans i18nKey="external_access.appointments.get_directions">
                <a rel='noreferrer' target='_blank' href={`https://maps.google.com/?q=${location?.latitude},${location?.longitude}`}>Get directions</a> to your appointment location.
            </Trans>
        </div>
    </div>
}
export default AppointmentDetail;
