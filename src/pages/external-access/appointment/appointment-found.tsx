import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectPatientUpcomingAppointment
} from '@pages/external-access/appointment/store/appointments.selectors';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import {useEffect} from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Button from '@components/button/button';
import {setSelectedAppointment} from './store/appointments.slice';
import {useHistory} from 'react-router';
import {AppointmentReschedulePath, AppointmentSchedulePath} from '@app/paths';
import ProviderPicture from './components/provider-picture';


const AppointmentFound = () => {
    dayjs.extend(customParseFormat);

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const appointment = useSelector(selectPatientUpcomingAppointment);
    const departments = useSelector(selectLocationList);
    const providers = useSelector(selectProviderList);

    const provider = providers?.find(a => a.id === appointment.providerId);
    const department = departments?.find(a => a.id === appointment.departmentId);

    const navigateToReschedule = () => {
        dispatch(setSelectedAppointment(appointment));
        history.push(`${AppointmentReschedulePath}/${appointment.appointmentId}`);
    }

    const navigateToSchedule = () => {
        history.push(AppointmentSchedulePath, {
            hasUpcomingAppointment: true
        });
    }

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);

    return (
        <div className='flex flex-col'>
            <h4 className='pb-9'>
                {t('external_access.schedule_appointment.appointment_found')}
            </h4>
            <div className='pb-10'>{t('external_access.schedule_appointment.appointment_found_desc')}</div>
            <div className='pb-10 border-b'>
                <div className='pb-5'>
                    <h5>
                        {t('external_access.appointments.appointment_date', {
                            date: dayjs(appointment.startDateTime).format('dddd, MMM DD, YYYY'),
                            time: dayjs(appointment.startTime, 'hh:mm').format('h:mm A')
                        })}
                    </h5>
                </div>
                <div className='flex'>
                    <ProviderPicture providerId={provider?.id} />
                    <div>
                        <h6 className='pb-2 appointment-type'>
                            {appointment.appointmentType}
                        </h6>
                        {provider && <div className='pb-6'>
                            {t('external_access.appointments.with_doctor', {
                                name: provider.displayName
                            })}
                        </div>}
                        <div className='subtitle'>
                            {department?.name}
                        </div>
                        <div>
                            {department?.address}
                        </div>
                        <div>
                            {`${(department?.address2)} ${department?.city} ${department?.state}, ${department?.zip}`}
                        </div>
                        <div className='pt-4'>
                            <Button
                                buttonType="secondary-big"
                                label='external_access.appointments.reschedule'
                                onClick={() => navigateToReschedule()}
                            />
                        </div>
                    </div>

                </div>

            </div>
            <div className='pt-16 pb-12'>
                <Button
                    buttonType='medium'
                    label='external_access.schedule_new_appointment'
                    onClick={() => navigateToSchedule()}
                />
            </div>

        </div>
    );
}

export default AppointmentFound;
