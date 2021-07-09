import {useQuery} from 'react-query';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import {AxiosError} from 'axios';
import {GetAppointmentSlots} from '@constants/react-query-constants';
import {getAppointmentSlots} from '@pages/appointments/services/appointments.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {
    selectRescheduleTimeFrame,
    selectSelectedAppointment
} from '@pages/external-access/appointment/store/appointments.selectors';
import {selectDepartmentList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import React, {useEffect, useMemo, useState} from 'react';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import {useForm} from 'react-hook-form';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import utils from '@shared/utils/utils';
import DaySlots from '@pages/external-access/appointment/components/day-slot';
import './appointment-reschedule.scss';
import {setIsAppointmentRescheduled} from '@pages/external-access/appointment/store/appointments.slice';
import businessDays from '@shared/utils/business-days';
import classnames from 'classnames';
import Spinner from '@components/spinner/Spinner';

const AppointmentReschedule = () => {
    dayjs.extend(utc);
    dayjs.extend(isoWeek);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const appointment = useSelector(selectSelectedAppointment);
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);
    const numberOfDays = 14;
    const numberOfWorkDays = 5;
    const rescheduleTimeFrame = useSelector(selectRescheduleTimeFrame);
    const minStartDate = rescheduleTimeFrame ? businessDays.add(dayjs(appointment.startDateTime).utc().toDate(), rescheduleTimeFrame) : dayjs(appointment.startDateTime).utc().toDate();
    const {control, setValue} = useForm({
        mode: 'onBlur',
        defaultValues: {
            selectedDate: dayjs().toDate()
        }
    });

    const [startDate, setStartDate] = useState(minStartDate);
    const [isWeekendSelected, setIsWeekendSelected] = useState(false);

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getDepartments());
        dispatch(setIsAppointmentRescheduled(false));
    }, [dispatch]);

    const provider = providers?.find(a => a.id === appointment.providerId);
    const department = departments?.find(a => a.id === appointment.departmentId);

    const {isLoading: isAppointmentSlotsLoading, data: appointmentSlots, refetch, isFetching} =
        useQuery<AppointmentSlot[], AxiosError>([GetAppointmentSlots, provider?.id, department?.id, appointment.appointmentTypeId], () => {
            let beginDate = dayjs(getWorkDates()[0]).toDate();
            beginDate = dayjs(beginDate).isBefore(minStartDate) ? minStartDate : beginDate;
            return getAppointmentSlots(provider?.id as number, department?.id as number, appointment.appointmentTypeId, beginDate, dayjs(beginDate).utc().add(numberOfDays, 'day').toDate());
        },
            {
                enabled: false
            }
        );

    useEffect(() => {
        if (provider?.id && department?.id && !appointmentSlots) {
            refetch();
        }

        if (appointmentSlots && appointmentSlots.length > 0) {
            setValue('selectedDate', new Date(appointmentSlots[0].date));
            setStartDate(new Date(appointmentSlots[0].date));
        }
    }, [appointmentSlots, department?.id, provider?.id, refetch, setValue]);

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

    if (isAppointmentSlotsLoading) {
        return <Spinner fullScreen />
    }

    if (!verifiedPatient) {
        return <div>{t('common.error')}</div>
    }
    const isBordered = (slotsDate: string) => {
        return dayjs(slotsDate).isSame(startDate);
    }
    return <div>
        <div className='2xl:whitespace-pre 2xl:h-12 2xl:my-3 flex items-center'>
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
                    isCalendarDisabled
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
            <div className='hidden lg:flex flex-row'>
                <SvgIcon type={Icon.ArrowLeft} className='cursor-pointer' fillClass='active-item-icon'
                    onClick={() => previousPage()} />
                <div>
                    <div className="grid grid-flow-col auto-cols-max md:auto-cols-min pb-3">
                        {
                            appointmentSlots && getWorkDates().map(date => {
                                return <div key={date} className={classnames('flex justify-center reschedule-slot subtitle2 w-56 md:w-80 mx-2', {'slot-date-selected body2': isBordered(date)})}>
                                    {dayjs(date).format('ddd, MMM D')}
                                </div>
                            })
                        }
                    </div>
                    <div className="grid grid-flow-col auto-cols-max md:auto-cols-min w-full justify-between border-t pt-4">
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
            <div className='lg:hidden flex flex-row'>
                <SvgIcon type={Icon.ArrowLeft} className='cursor-pointer mt-1' fillClass='active-item-icon'
                    onClick={() => previousPage(true)} />
                <div className="w-full">
                    {
                        appointmentSlots && <div className='p-1'>
                            <div className='flex justify-center w-auto px-4 subtitle2 border-b pb-3 mb-4'>
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
                <SvgIcon type={Icon.ArrowRight} className='cursor-pointer mt-1' fillClass='active-item-icon'
                    onClick={() => nextPage(true)} />
            </div>
            {
                isFetching && <div className='h-8 w-20'>
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
