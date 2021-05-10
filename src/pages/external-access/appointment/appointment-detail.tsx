import React, {useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import {useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {
    GetAppointmentType,
} from '@constants/react-query-constants';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import Button from '@components/button/button';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';
import {getAppointmentTypeById} from '@pages/appointments/services/appointments.service';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {useHistory} from 'react-router-dom';
import {selectSelectedAppointment} from '@pages/external-access/appointment/store/appointments.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {selectDepartmentList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import './appointment.scss';
import {setRescheduleTimeFrame} from '@pages/external-access/appointment/store/appointments.slice';

const AppointmentDetail = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const callUsPhone = process.env.REACT_APP_CALL_US_PHONE;
    const chatLink = process.env.REACT_APP_CHAT_LINK;
    const defaultTimeFrame = 7;
    const appointment = useSelector(selectSelectedAppointment);
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);
    useEffect(() => {
        dispatch(getProviders());
        dispatch(getDepartments());
    }, [dispatch]);



    const {isLoading: isAppointmentTypesLoading, data: appointmentType} = useQuery<AppointmentType, AxiosError>([GetAppointmentType, appointment.appointmentTypeId], () =>
        getAppointmentTypeById(appointment.appointmentTypeId),
        {
            enabled: !!appointment
        }
    );

    useEffect(() => {
        dispatch(setRescheduleTimeFrame(appointmentType?.rescheduleTimeFrame || defaultTimeFrame));
    }, [appointmentType?.rescheduleTimeFrame, dispatch]);

    const provider = providers?.find(a => a.id === appointment.providerId);
    const department = departments?.find(a => a.id === appointment.departmentId);

    const display = (value?:string) => {
        if (value) {
            return value;
        }
        return ''
    }

    const displayCancel = () => {
        return !appointmentType || appointmentType.cancelable;
    }

    const redirectToReschedule = () => {
        history.push(`/o/appointment-reschedule`);
    }
    const redirectToCancel = () => {
        history.push(`/o/appointment-cancelation`);
    }

    if (isAppointmentTypesLoading) {
        return <ThreeDots/>
    }

    return  <div className='2xl:px-48'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_details')}
            </h4>
        </div>
        <div className='pt-6 pb-9'>
            {t('external_access.appointments.see_appointment_details')}
        </div>
        <div className='pb-2'>
            <h5>
                {t('external_access.appointments.appointment_date', {
                    date: utils.formatUtcDate(appointment.startDateTime, 'dddd, MMM DD, YYYY'),
                    time: utils.formatUtcDate(appointment.startDateTime, 'hh:mm A')
                })}
            </h5>
        </div>
        <h5 className='pb-2 appointment-type'>
            {appointment.appointmentType}
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
        <div className='pt-12 flex flex-col xl:flex-row xl:space-x-6 space-x-0 space-y-6 xl:space-y-0'>
            {(appointmentType ? appointmentType?.reschedulable : true) && <Button onClick={() => redirectToReschedule()} buttonType='medium' label='external_access.appointments.reschedule' />}
            <Button disabled={!displayCancel()} onClick={() => redirectToCancel()} buttonType='secondary' label='common.cancel' />
        </div>
        { !displayCancel() && <div className='pt-10 xl:pt-20'>
            <div className='warning-message p-4 body2'>
                <Trans i18nKey="external_access.appointments.can_not_be_canceled">
                    <a rel='noreferrer' className='underline' target='_self' href={chatLink}>Chat</a>
                    {callUsPhone}
                </Trans>
            </div>
        </div>
        }
        { appointmentType?.instructions && <>
            <div className='pt-10 xl:pt-20'>
                {t('external_access.appointments.instructions')}
            </div>
            <div className='border-b pt-2'/>
                <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: appointmentType?.instructions}} />
        </>
        }

        { department?.parkingInformation && <>
            <div className='pt-8'>
                {t('external_access.appointments.parking_information')}
            </div>
            <div className='border-b pt-2'/>
            <div className='pt-4 body2'>
                {department?.parkingInformation}
            </div>
        </>
        }
        <div className='pt-6'>
            {t('external_access.appointments.directions')}
        </div>
        <div className='border-b pt-2'/>
        <div className='pt-4 pb-16 body2'>
            <Trans i18nKey="external_access.appointments.get_directions">
                <a rel='noreferrer' className='underline' target='_blank' href={`https://maps.google.com/?q=${department?.latitude},${department?.longitude}`}>Get directions</a> to your appointment location.
            </Trans>
        </div>
    </div>

}
export default AppointmentDetail;
