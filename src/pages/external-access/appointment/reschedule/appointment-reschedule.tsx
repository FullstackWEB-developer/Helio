import {useQuery} from 'react-query';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import {AxiosError} from 'axios';
import {GetAppointmentSlots, GetPatientAppointments} from '@constants/react-query-constants';
import {getAppointmentSlots} from '@pages/appointments/services/appointments.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {
    selectRescheduleTimeFrame,
} from '@pages/external-access/appointment/store/appointments.selectors';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import React, {useEffect, useMemo, useState} from 'react';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import {useForm} from 'react-hook-form';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import utils from '@shared/utils/utils';
import DaySlots from '@pages/external-access/appointment/components/day-slot';
import './appointment-reschedule.scss';
import {
    setIsAppointmentRescheduled, setSelectedAppointment
} from '@pages/external-access/appointment/store/appointments.slice';
import businessDays from '@shared/utils/business-days';
import classnames from 'classnames';
import Spinner from '@components/spinner/Spinner';
import {Appointment} from '@pages/external-access/appointment/models';
import {Location, Provider} from '@shared/models';
import {getAppointments} from '@pages/patients/services/patients.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {useParams} from 'react-router-dom';

const AppointmentReschedule = () => {
    dayjs.extend(utc);
    dayjs.extend(isoWeek);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const [appointment, setAppointment] = useState<Appointment>();
    const locations = useSelector(selectLocationList);
    const providers = useSelector(selectProviderList);
    const [provider, setProvider] = useState<Provider>();
    const [location, setLocation] = useState<Location>();
    const numberOfDays = 14;
    const numberOfWorkDays = 5;
    const {appointmentId} = useParams<{appointmentId: string}>();
    const [minStartDate, setMinStartDate] = useState<Date>();
    const rescheduleTimeFrame = useSelector(selectRescheduleTimeFrame);
    const {control, setValue} = useForm({
        mode: 'onBlur',
        defaultValues: {
            selectedDate: dayjs().toDate()
        }
    });

    const {isLoading: isAppointmentsLoading, error, isFetchedAfterMount} = useQuery<Appointment[], AxiosError>([GetPatientAppointments, verifiedPatient?.patientId], () =>
            getAppointments(verifiedPatient.patientId),
        {
            onSuccess: (data) => {
                const appointment = data.find(a => a.appointmentId === appointmentId);
                if (!appointment) {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        position: SnackbarPosition.TopCenter,
                        message:  t('external_access.appointments.no_single_appointment_with_id', {id: appointmentId})
                    }));
                    return;
                }
                setAppointment(appointment);
                dispatch(setSelectedAppointment(appointment));
                setMinStartDate(rescheduleTimeFrame ? businessDays.add(dayjs(appointment.startDateTime).utc().toDate(), rescheduleTimeFrame) : dayjs(appointment.startDateTime).utc().toDate());
                setProvider(providers?.find(a => a.id === appointment.providerId));
                setLocation(locations?.find(a => a.id === appointment.departmentId));
            }
        }
    );

    const [startDate, setStartDate] = useState(minStartDate);
    const [isWeekendSelected, setIsWeekendSelected] = useState(false);

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
        dispatch(setIsAppointmentRescheduled(false));
    }, [dispatch, verifiedPatient]);


    const {isLoading: isAppointmentSlotsLoading, data: appointmentSlots, refetch, isFetching} =
        useQuery<AppointmentSlot[], AxiosError>([GetAppointmentSlots, provider?.id, location?.id, appointment?.appointmentTypeId], () => {
            let beginDate = dayjs(getWorkDates()[0]).toDate();
            beginDate = dayjs(beginDate).isBefore(minStartDate!) ? minStartDate! : beginDate;
            return getAppointmentSlots({
                providerId: [provider?.id as number],
                departmentId: location?.id as number,
                appointmentTypeId: appointment!.appointmentTypeId,
                startDate: beginDate,
                endDate: dayjs(beginDate).utc().add(numberOfDays, 'day').toDate()
            });
        },
            {
                enabled: false
            }
        );

    useEffect(() => {
        if (provider?.id && location?.id && !appointmentSlots) {
            refetch();
        }

        if (appointmentSlots && appointmentSlots.length > 0) {
            setValue('selectedDate', new Date(appointmentSlots[0].date));
            setStartDate(new Date(appointmentSlots[0].date));
        }
    }, [appointmentSlots, location?.id, provider?.id, refetch, setValue]);

    const getWorkDates = () => {
        let workDates = [] as string[];
        let workDate = dayjs(startDate).startOf('isoWeek').toDate();
        const startDay = workDate.getDay();
        for (let day = startDay; day <= numberOfWorkDays; day++) {
            workDates.push(utils.formatUtcDate(workDate, 'YYYY-MM-DDT00:00:00'));
            workDate = dayjs(workDate).add(1, 'day').toDate();
        }
        return workDates;
    }

    const mappedSlots: Map<any, any> = useMemo(() => {
        const mapByDate = (slots: AppointmentSlot[], keyGetter: Function) => {
            const map = new Map();
            slots.forEach(slot => {
                const key = keyGetter(slot);
                const item = {
                    slots: [slot]
                }
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, item);
                } else {
                    collection.slots.push(slot);
                }
            });
            return map;
        }

        if (appointmentSlots) {
            return mapByDate(appointmentSlots, (slot: AppointmentSlot) => slot.date);
        }
        return new Map<any, any>();
    }, [appointmentSlots]);

    const refreshCalendar = (newStartDate: Date) => {
        setValue('selectedDate', newStartDate);
        setStartDate(newStartDate);
        setTimeout(() => {
            refetch();
        }, 300);
    }

    const onDateChange = (date?: Date) => {
        if (!date) {
            return;
        }
        if (!businessDays.isBusinessDay(dayjs(date))) {
            setValue('selectedDate', startDate);
            setIsWeekendSelected(true);
            return;
        }
        setIsWeekendSelected(false);
        refreshCalendar(date);
    }

    const nextPage = (isMobile = false) => {
        setIsWeekendSelected(false);
        let nextStartDate = dayjs(startDate).startOf('isoWeek').utc().add(7, 'day').toDate();
        if (isMobile) {
            let d = (dayjs(startDate).day() === 5) ? 3 : 1;
            nextStartDate = dayjs(startDate).utc().add(d, 'day').toDate();
        }
        refreshCalendar(nextStartDate);
    };

    const previousPage = (isMobile = false) => {
        setIsWeekendSelected(false);
        let prevStartDate = dayjs(startDate).startOf('isoWeek').utc().add(-7, 'day').toDate();
        if (isMobile) {
            const d = (dayjs(startDate).day() === 1) ? -3 : -1;
            prevStartDate = dayjs(startDate).utc().add(d, 'day').toDate();
        }
        refreshCalendar(prevStartDate);
    };
    if (!isFetchedAfterMount || isAppointmentsLoading) {
        return <Spinner fullScreen />
    }

    if (!appointment) {
        return <div>{t('external_access.appointments.no_single_appointment_with_id', {id : appointmentId})}</div>
    }

    if (isAppointmentSlotsLoading) {
        return <Spinner fullScreen />
    }

    if (error) {
        return <div>{t('external_access.appointments.fetch_failed')}</div>
    }

    const isBordered = (slotsDate: string) => {
        return dayjs(slotsDate).isSame(startDate);
    }

    if (!appointment) {
        return <div>{t('external_access.appointments.no_single_appointment_with_id', {id: appointmentId})}</div>
    }
    return <div>
        <div className='flex items-center 2xl:whitespace-pre 2xl:h-12 2xl:my-3'>
            <h4>
                {t('external_access.appointments.select_your_appointment')}
            </h4>
        </div>
        <div className='pt-6 pb-4'>
            {t('external_access.appointments.below_available_appointments')}
        </div>
        <div className='pb-6 md:w-48 sm:w-full'>
            <form>
                <ControlledDateInput
                    type='date'
                    label='external_access.appointments.date'
                    control={control}
                    name='selectedDate'
                    min={new Date(new Date().toDateString())}
                    onChange={(event) => onDateChange(event)}
                    dataTestId='external-access-appointments-reschedule-date' />
            </form>
            {isWeekendSelected && <div className='text-danger'>
                {t('external_access.appointments.select_business_day')}
            </div>
            }
        </div>
        <div className='pb-1'>
            <div className='flex-row hidden lg:flex'>
                <SvgIcon type={Icon.ArrowLeft} className='cursor-pointer' fillClass='active-item-icon'
                    onClick={() => previousPage()} />
                <div>
                    <div className="grid grid-flow-col pb-3 auto-cols-max md:auto-cols-min">
                        {
                            appointmentSlots && getWorkDates().map(date => {
                                return <div key={date} className={classnames('flex justify-center reschedule-slot subtitle2 w-56 md:w-80 mx-2', {'slot-date-selected body2': isBordered(date)})}>
                                    {dayjs(date).format('ddd, MMM D')}
                                </div>
                            })
                        }
                    </div>
                    <div className="grid justify-between w-full grid-flow-col pt-4 border-t auto-cols-max md:auto-cols-min">
                        {
                            appointmentSlots && getWorkDates().map((date, index) => {
                                const column = mappedSlots.get(date);
                                return <div className='flex justify-center pt-1' key={index}>
                                    {!isFetching &&
                                        <DaySlots column={column} />
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
                <SvgIcon type={Icon.ArrowRight} className='cursor-pointer' fillClass='active-item-icon'
                    onClick={() => nextPage()} />
            </div>
            <div className='flex flex-row lg:hidden'>
                <SvgIcon type={Icon.ArrowLeft} className='mt-1 cursor-pointer' fillClass='active-item-icon'
                    onClick={() => previousPage(true)} />
                <div className="w-full">
                    {
                        appointmentSlots && <div className='p-1'>
                            <div className='flex justify-center w-auto px-4 pb-3 mb-4 border-b subtitle2'>
                                {dayjs(startDate).format('ddd, MMM D')}
                            </div>
                            {
                                !isFetching && <>
                                    {
                                        mappedSlots.get(dayjs(startDate).format('YYYY-MM-DDT00:00:00'))
                                            ? <DaySlots
                                                column={mappedSlots.get(dayjs(startDate).format('YYYY-MM-DDT00:00:00'))}
                                            />
                                            : <div data-test-id='external-access-appointments-no-day-slots'>
                                                {t('external_access.appointments.no_day_slots_found')}
                                            </div>
                                    }
                                </>
                            }
                        </div>
                    }
                </div>
                <SvgIcon type={Icon.ArrowRight} className='mt-1 cursor-pointer' fillClass='active-item-icon'
                    onClick={() => nextPage(true)} />
            </div>
            {
                isFetching && <div className='w-20 h-8'>
                    <Spinner fullScreen />
                </div>
            }
            {
                !isFetching && (!appointmentSlots || appointmentSlots.length <= 0) && <div data-test-id='external-access-appointments-not-found'>
                    {t('external_access.appointments.no_slots_found')}
                </div>
            }
        </div>
    </div>
}

export default AppointmentReschedule;
