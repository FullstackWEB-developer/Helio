import React, {useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {AxiosError} from 'axios';
import {
    GetAppointmentType
} from '@constants/react-query-constants';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';
import {getAppointmentTypeById} from '@pages/appointments/services/appointments.service';
import {
    selectSelectedAppointment
} from '@pages/external-access/appointment/store/appointments.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Spinner from '@components/spinner/Spinner';
import {useHistory} from 'react-router-dom';
import ProviderPicture from '../components/provider-picture';

const AppointmentRescheduled = () => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const appointment = useSelector(selectSelectedAppointment);
    const departments = useSelector(selectLocationList);
    const providers = useSelector(selectProviderList);

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);

    history.listen((newLocation, action) => {
        if (action === "POP") {
            history.go(1);
        }
    });

    const {isLoading: isAppointmentTypesLoading, data: appointmentType} = useQuery<AppointmentType, AxiosError>([GetAppointmentType, appointment.appointmentTypeId], () =>
        getAppointmentTypeById(appointment.appointmentTypeId),
        {
            enabled: !!appointment
        }
    );

    const provider = providers?.find(a => a.id === appointment.providerId);
    const department = departments?.find(a => a.id === appointment.departmentId);

    const display = (value?: string) => {
        if (value) {
            return value;
        }
        return ''
    }

    if (isAppointmentTypesLoading) {
        return <Spinner fullScreen />
    }

    return <div>
        <div className='flex items-center w-full 2xl:whitespace-pre 2xl:h-12 2xl:my-3'>
            <h4>
                {t('external_access.appointments.appointment_scheduled')}
            </h4>
        </div>
        <div className='pt-6 pb-8'>
            {t('external_access.appointments.see_appointment_details')}
        </div>
        <div className='pb-2'>
            <h5>
                {t('external_access.appointments.appointment_date', {
                    date: dayjs(appointment.startDateTime).format('dddd, MMMM DD, YYYY'),
                    time: dayjs(appointment.startTime, 'hh:mm').format('hh:mm A')
                })}
            </h5>
        </div>
        <div className='flex pt-6'>

            <ProviderPicture providerId={provider?.id} />
            <div>
                <h6 className='pb-2 appointment-type'>
                    {appointmentType?.name}
                </h6>
                {provider && <div className='pb-6'>
                    {t('external_access.appointments.with_doctor', {
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
        {appointmentType?.instructions && <>
            <div className='pt-10'>
                {t('external_access.appointments.instructions')}
            </div>
            <div className='pt-2 border-b' />
            <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: appointmentType?.instructions}} />
        </>
        }

        {department?.parkingInformation && <>
            <div className='pt-8'>
                {t('external_access.appointments.parking_information')}
            </div>
            <div className='pt-2 border-b' />
            <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: department?.parkingInformation}} />
        </>
        }
        <div className='pt-6'>
            {t('external_access.appointments.directions')}
        </div>
        <div className='pt-2 border-b' />
        <div className='pt-4 body2'>
            <Trans i18nKey="external_access.appointments.get_directions">
                <a rel='noreferrer' target='_blank' href={`https://maps.google.com/?q=${department?.latitude},${department?.longitude}`}>Get directions</a> to your appointment location.
            </Trans>
        </div>
    </div>

}
export default AppointmentRescheduled;
