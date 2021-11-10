import React, {useRef, useState} from 'react';
import dayjs from 'dayjs';
import {Appointment, AppointmentType} from '../models';
import {Trans, useTranslation} from 'react-i18next';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ProviderPicture from './provider-picture';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import classnames from 'classnames';
import Button from '@components/button/button';
import utils from '@shared/utils/utils';
import {useMutation} from 'react-query';
import {confirmAppointment} from '@pages/appointments/services/appointments.service';
import {ConfirmationStatus} from '../models/appointment-confirmation-status.enum';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import SvgIcon, {Icon} from '@components/svg-icon';
import Tooltip from '@components/tooltip/tooltip';
import {useHistory} from 'react-router';

const AppointmentDetailConfirmation = ({appointment, appointmentType}: {appointment: Appointment, appointmentType: AppointmentType | undefined}) => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const infoIcon = useRef<HTMLDivElement>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const providers = useSelector(selectProviderList);
    const provider = providers?.find(a => a.id === appointment.providerId);
    const locations = useSelector(selectLocationList);
    const location = locations?.find(l => l.id === appointment.departmentId);

    const displayData = (value?: string) => {
        return value ?? '';
    }

    const isAppointmentInNextSevenDays = () => {
        return utils.isDateInNextSevenDays(appointment.date);
    }

    const confirmAppointmentMutation = useMutation(confirmAppointment, {
        onSuccess: (_) => {
            history.replace('/o/appointment-confirmed');
        },
        onError: (_) => {
            dispatch(addSnackbarMessage({
                message: 'external_access.appointments.confirmation.confirm_error',
                type: SnackbarType.Error
            }));
        }
    });

    const confirmAppointmentClickHandler = () => {
        confirmAppointmentMutation.mutate({
            appointmentId: appointment.appointmentId,
            confirmationStatus: ConfirmationStatus.ConfirmedViaEmail
        });
    }

    const redirectToReschedule = () => {
        history.push(`/o/appointment-reschedule/${appointment.appointmentId}`);
    }

    const redirectToCancel = () => {
        history.push(`/o/appointment-cancel/${appointment.appointmentId}`);
    }

    const isAppointmentInPast = () => {
        return utils.isDateTimeInPast(appointment.startDateTime);
    }

    return (
        <>
            <div className='pb-2'>
                <h5>
                    {t('external_access.appointments.appointment_date', {
                        date: dayjs(appointment?.date).format('dddd, MMM DD, YYYY'),
                        time: dayjs(appointment?.startTime, 'hh:mm').format('hh:mm A')
                    })}
                </h5>
            </div>
            <div className='flex pt-2'>
                <ProviderPicture providerId={provider?.id} />
                <div>
                    <h6 className='pb-2'>
                        {appointmentType?.name ?? appointment?.appointmentType}
                    </h6>
                    {
                        provider && <div className='pb-6'>
                            {t('external_access.appointments.with_doctor', {
                                name: provider.displayName
                            })}
                        </div>
                    }
                    <div className='subtitle'>
                        {displayData(location?.name)}
                    </div>
                    <div>
                        {displayData(location?.address)}
                    </div>
                    <div>
                        {`${displayData(location?.address2)} ${displayData(location?.city)} ${displayData(location?.state)}, ${displayData(location?.zip)}`}
                    </div>
                </div>
            </div>
            {
                !isAppointmentInPast() &&
                <div className='flex my-12 flex-col xl:flex-row xl:space-x-6 space-x-0 space-y-6 xl:space-y-0'>
                    <div className='flex items-center'>
                        <Button label='external_access.appointments.confirmation.confirm' className='w-48' buttonType='big'
                            onClick={confirmAppointmentClickHandler} isLoading={confirmAppointmentMutation.isLoading} disabled={!isAppointmentInNextSevenDays()} />
                        <div ref={infoIcon} className={!isAppointmentInNextSevenDays() ? 'block' : 'hidden'}
                            onMouseEnter={() => setTooltipVisible(true)} onMouseLeave={() => setTooltipVisible(false)}>
                            <SvgIcon type={Icon.Info} wrapperClassName='px-1' className='cursor-pointer' fillClass='rgba-05-fill' />
                        </div>
                        <Tooltip targetRef={infoIcon} isVisible={tooltipVisible} placement='bottom-start'>
                            <div className='p-3'>{t('external_access.appointments.confirmation.not_in_next_seven_days')}</div>
                        </Tooltip>
                    </div>
                    {
                        appointmentType?.reschedulable && <Button buttonType='secondary-big' className='w-40' label='external_access.appointments.reschedule' disabled={isAppointmentInPast()}
                            onClick={() => redirectToReschedule()} />
                    }

                    {
                        appointmentType?.cancelable && <Button buttonType='secondary-big' className='w-32' label='common.cancel'
                            onClick={() => redirectToCancel()} />
                    }
                    {
                        appointmentType?.cancelable && appointmentType?.cancelationFee &&
                        (appointmentType?.cancelationTimeFrame && dayjs.utc(appointment!.startDateTime).diff(dayjs.utc(), 'hour') < appointmentType?.cancelationTimeFrame) &&

                        <div className='warning-message body2'>
                            <Trans i18nKey="external_access.appointments.will_be_charged">
                                {appointmentType.cancelationTimeFrame.toString()}
                                {appointmentType.cancelationFee.toString()}
                            </Trans>
                        </div>
                    }
                </div>
            }
            {
                appointmentType?.instructions &&
                <>
                    <div className='pt-20'>
                        {t('external_access.appointments.instructions')}
                    </div>
                    <div className='border-b pt-2' />
                    <div className='pt-4 body2' dangerouslySetInnerHTML={{__html: appointmentType?.instructions}} />
                </>
            }
            {
                location?.parkingInformation &&
                <>
                    <div className={classnames({'pt-8': appointmentType?.instructions, 'pt-20': !appointmentType?.instructions})}>
                        {t('external_access.appointments.parking_information')}
                    </div>
                    <div className='border-b pt-2' />
                    <div className='pt-4 body2'>
                        {location?.parkingInformation}
                    </div>
                </>
            }
            <div className={classnames({'pt-8': location?.parkingInformation, 'pt-20': !location?.parkingInformation})}>
                {t('external_access.appointments.directions')}
            </div>
            <div className='border-b pt-2' />
            <div className='pt-4 body2'>
                <Trans i18nKey="external_access.appointments.get_directions">
                    <a rel='noreferrer' target='_blank' href={`https://maps.google.com/?q=${location?.latitude},${location?.longitude}`}></a>
                </Trans>
            </div>
        </>
    )
}

export default AppointmentDetailConfirmation;