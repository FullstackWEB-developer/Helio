import React, {useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import Button from '@components/button/button';
import {useHistory} from 'react-router-dom';
import {selectAppointmentTypes, selectSelectedAppointment} from '@pages/external-access/appointment/store/appointments.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import './appointment.scss';
import {setRescheduleTimeFrame} from '@pages/external-access/appointment/store/appointments.slice';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import classnames from 'classnames';
import utils from '@shared/utils/utils';

const AppointmentDetail = () => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const defaultTimeFrame = 7;
    const appointment = useSelector(selectSelectedAppointment);
    const appointmentTypes = useSelector(selectAppointmentTypes);
    const appointmentType = appointmentTypes.find(a => a.id === Number(appointment.appointmentTypeId));
    const departments = useSelector(selectLocationList);
    const department = departments?.find(a => a.id === appointment.departmentId);
    const providers = useSelector(selectProviderList);
    const provider = providers?.find(a => a.id === appointment.providerId);

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);


    useEffect(() => {
        dispatch(setRescheduleTimeFrame(appointmentType?.rescheduleTimeFrame || defaultTimeFrame));
    }, [appointmentType?.rescheduleTimeFrame, dispatch]);

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

    return  <div>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex w-full items-center'>
            <h4>
                {t('external_access.appointments.appointment_details')}
            </h4>
        </div>
        {!displayCancel() && <div className='pt-6 pb-2 w-4/5'>
            <div className='warning-message body2 px-6 py-3.5 rounded border border-solid'>
                <Trans i18nKey="external_access.appointments.can_not_be_canceled">
                    {utils.getAppParameter('CallUsPhone')}
                </Trans>
            </div>
        </div>
        }
        <div className='pt-6 pb-9'>
            {t('external_access.appointments.see_appointment_details')}
        </div>
        <div className='pb-2'>
            <h5>
                {t('external_access.appointments.appointment_date', {
                    date: dayjs(appointment.startDateTime).format('dddd, MMM DD, YYYY'),
                    time: dayjs(appointment.startTime, 'hh:mm').format('hh:mm A')
                })}
            </h5>
        </div>
        <h6 className='pb-2'>
            {appointmentType?.name ?? appointment.appointmentType}
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
        <div className='pt-12 flex flex-col xl:flex-row xl:space-x-6 space-x-0 space-y-6 xl:space-y-0'>
            {(appointmentType ? appointmentType?.reschedulable : true) && <Button onClick={() => redirectToReschedule()} buttonType='big' label='external_access.appointments.reschedule' />}
            <Button disabled={!displayCancel()} onClick={() => redirectToCancel()} buttonType='secondary-big' label='common.cancel' />
        </div>
        
        { appointmentType?.instructions && <>
            <div className='pt-20'>
                {t('external_access.appointments.instructions')}
            </div>
            <div className='border-b pt-2'/>
                <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: appointmentType?.instructions}} />
        </>
        }

        { department?.parkingInformation && <>
            <div className={classnames({'pt-8': appointmentType?.instructions, 'pt-20': !appointmentType?.instructions})}>
                {t('external_access.appointments.parking_information')}
            </div>
            <div className='border-b pt-2'/>
            <div className='pt-4 body2'>
                {department?.parkingInformation}
            </div>
        </>
        }
        <div className={classnames({'pt-8': department?.parkingInformation, 'pt-20': !department?.parkingInformation})}>
            {t('external_access.appointments.directions')}
        </div>
        <div className='border-b pt-2'/>
        <div className='pt-4 body2'>
            <Trans i18nKey="external_access.appointments.get_directions">
                <a rel='noreferrer' target='_blank' href={`https://maps.google.com/?q=${department?.latitude},${department?.longitude}`}>Get directions</a> to your appointment location.
            </Trans>
        </div>
    </div>
}
export default AppointmentDetail;
