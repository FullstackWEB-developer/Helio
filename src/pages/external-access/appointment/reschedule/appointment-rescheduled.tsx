import React, {useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import {useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {
    GetAppointmentType,
} from '@constants/react-query-constants';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';
import {getAppointmentTypeById} from '@pages/appointments/services/appointments.service';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {
    selectSelectedAppointment
} from '@pages/external-access/appointment/store/appointments.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {selectDepartmentList, selectProviderList} from '@shared/store/lookups/lookups.selectors';

const AppointmentRescheduled = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
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

    const provider = providers?.find(a => a.id === appointment.providerId);
    const department = departments?.find(a => a.id === appointment.departmentId);

    const display = (value?:string) => {
        if (value) {
            return value;
        }
        return ''
    }

    if (isAppointmentTypesLoading) {
        return <ThreeDots/>
    }

    return  <div className='2xl:px-48'>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_scheduled')}
            </h4>
        </div>
        <div className='pt-9 pb-8'>
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
        <h6 className='pb-2 appointment-type'>
            {appointment.appointmentType}
        </h6>
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

        {appointmentType?.instructions && <>
                <div className='pt-10'>
                    {t('external_access.appointments.instructions')}
                </div>
                <div className='border-b pt-2'/>
                <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: appointmentType?.instructions}}/>
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
export default AppointmentRescheduled;
