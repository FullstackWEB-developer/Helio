import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ControlledCheckbox, ControlledDateInput, ControlledSelect} from '@components/controllers';
import {isMobile} from 'react-device-detect';
import {useForm} from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import utils from '@shared/utils/utils';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import SvgIcon, {Icon} from '@components/svg-icon';
import {useQuery} from 'react-query';
import DaySlots from '../components/day-slot';
import {AppointmentSlot} from '../models/appointment-slot.model';
import {GetAppointmentSlots} from '@constants/react-query-constants';
import {getAppointmentSlots} from '@pages/appointments/services/appointments.service';
import classnames from 'classnames';
import {selectAppointmentSlotRequest} from '../store/appointments.selectors';
import {AxiosError} from 'axios';
import Spinner from '@components/spinner/Spinner';
import {Option} from '@components/option/option';
import Button from '@components/button/button';
import {setSelectedAppointmentSlot} from '../store/appointments.slice';
import {useHistory} from 'react-router';
import {AppointmentSlotTimeOfDay} from '../models';
import Modal from '@components/modal/modal';
import {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {GenderFilterOption} from '../models/appointment-gender-filter-option.model';
import './appointment-schedule-select.scss';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {AppointmentDepartmentModel} from '@pages/external-access/appointment/models/appointment-department.model';
import AppointmentScheduleMap from './appointment-schedule-map';
import FilterDot from '@components/filter-dot/filter-dot';

const numberOfWorkDays = 7;
const MaxFetchCount = 8;
const AppointmentScheduleSelect = () => {
    dayjs.extend(utc);
    dayjs.extend(isoWeek);

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const history = useHistory();
    const verifiedPatient = useSelector(selectVerifiedPatent);

    const providers = useSelector(selectProviderList);
    const locations = useSelector(selectLocationList);
    const appointmentSlotRequest = useSelector(selectAppointmentSlotRequest);
    const [currentFilterCount, setCurrentFilterCount] = useState<number>(0);
    const [showAllSlot, setShowAllSlot] = useState(false);
    const [slotRequest, setSlotRequest] = useState(appointmentSlotRequest);
    const [departmentLatLng, setDepartmentLatLng] = useState<AppointmentDepartmentModel[]>([]);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(appointmentSlotRequest?.startDate ?? dayjs().utc().local().toDate());
    const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>([]);
    const [displayMaxTryError, setDisplayMaxTryError] = useState<boolean>();
    const tryCount = useRef<number>(0);
    const DEFAULT_OPTION_ANY: Option = useMemo(() => ({
        label: t('common.any'),
        value: '0'
    }), [t]);

    useEffect(() => {
        if (!appointmentSlotRequest) {
            history.push('/o/appointment-schedule');
        }
    }, [appointmentSlotRequest, history]);

    const {control, setValue} = useForm({
        defaultValues: {
            selectedDate: appointmentSlotRequest?.startDate,
            provider: appointmentSlotRequest?.providerId?.toString() ?? '',
            location: appointmentSlotRequest?.departmentId?.toString() ?? '',
            time_earlymorning: {value: AppointmentSlotTimeOfDay.EarlyMorning.toString(), checked: false},
            time_morning: {value: AppointmentSlotTimeOfDay.Morning.toString(), checked: false},
            time_afternoon: {value: AppointmentSlotTimeOfDay.Afternoon.toString(), checked: false}
        }
    });


    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);


    useEffect(() => {
        if (isFilterOpen) {
            slotRequest.timeOfDays?.forEach(p => {
                setValue(`time_${AppointmentSlotTimeOfDay[p].toLowerCase()}`, {value: p.toString(), checked: true});
            });
        }
    }, [isFilterOpen, setValue])

    const locationOptions = useMemo(() => [
        DEFAULT_OPTION_ANY,
        ...utils.parseOptions(locations,
            item => utils.capitalizeFirstLetters(item.name),
            item => item.id.toString()
        )
    ], [DEFAULT_OPTION_ANY, locations]);

    const providerOptions = useMemo(() => [
        DEFAULT_OPTION_ANY,
        ...utils.parseOptions(providers,
            item => utils.stringJoin(' ', item.firstName, item.lastName),
            item => item.id.toString()
        )
    ], [DEFAULT_OPTION_ANY, providers]);


    const getWorkDates = useCallback(() => {
        const workDates: string[] = [];
        let workDate = dayjs(selectedDate).startOf('isoWeek').toDate();
        const startDay = workDate.getDay();
        for (let day = startDay; day <= numberOfWorkDays; day++) {
            workDates.push(utils.formatUtcDate(workDate, 'YYYY-MM-DDT00:00:00'));
            workDate = dayjs(workDate).add(1, 'day').toDate();
        }
        return workDates;
    }, [selectedDate]);

    const {isLoading: isAppointmentSlotsLoading, isFetching} =
        useQuery<AppointmentSlot[], AxiosError>([GetAppointmentSlots, slotRequest],
            () => getAppointmentSlots({...slotRequest}, false),
            {
                enabled: !!slotRequest,
                onSuccess: (data: AppointmentSlot[]) => {
                    if (!data || data.length < 1) {
                        setDepartmentLatLng([]);
                        if (slotRequest.firstAvailable && tryCount.current <= MaxFetchCount) {
                            nextPage(isMobile);
                            tryCount.current = tryCount.current + 1;
                        }
                        if (tryCount.current === MaxFetchCount) {
                            setDisplayMaxTryError(true);
                        }
                        return;
                    }
                    const latLong = locations.filter(p => data.findIndex(d => p.id === d.departmentId) > -1)
                        .map((p) => {
                            return {
                                latLong: [p.latitude, p.longitude],
                                name: p.name,
                                address: p.address,
                                address2: p.address2,
                                city: p.city,
                                state: p.state,
                                zip: p.zip
                            }
                        });
                    setDepartmentLatLng(latLong);
                    const sorted =data.sort((a, b) => dayjs.utc(a.date).toDate().getTime() - dayjs.utc(b.date).toDate().getTime());
                    setAppointmentSlots(sorted);
                    const firstAvailableDate = new Date(sorted[0].date);
                    setValue('selectedDate', firstAvailableDate);
                    setSelectedDate(firstAvailableDate);
                }
            }
        );

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

    const isSlotOverflow = useMemo(() => {
        let moreThan = false;
        const workDates = getWorkDates();
        for (const [key, value] of mappedSlots) {

            if (!workDates.includes(key)) {
                continue;
            }
            if (value.slots.length > 8) {
                moreThan = true;
                break;
            }
        }
        return moreThan;

    }, [getWorkDates, mappedSlots])


    const isBordered = (slotsDate: string) => {
        return dayjs(slotsDate).isSame(selectedDate);
    }
    const changeDate = (newStartDate: Date) => {
        setValue('selectedDate', newStartDate);
        setSelectedDate(newStartDate);
        setSlotRequest({...slotRequest, startDate: newStartDate, endDate: dayjs(newStartDate).add(7, 'day').toDate()});
        setDisplayMaxTryError(false);
    }

    const changeProvider = (event?: Option) => {
        if (!event) {
            return;
        }
        setSlotRequest({...slotRequest, providerId: !!event.value ? [Number(event.value)] : undefined});
        setDisplayMaxTryError(false);
    }

    const changeLocation = (event?: Option) => {
        if (!event) {
            return;
        }
        setSlotRequest({...slotRequest, departmentId: !!event.value ? Number(event.value) : undefined});
        setDisplayMaxTryError(false);
    }

    const nextPage = (isMobile = false) => {
        let nextStartDate = dayjs(selectedDate).startOf('isoWeek').utc().add(7, 'day').toDate();
        if (isMobile) {
            const d = (dayjs(selectedDate).day() === 5) ? 3 : 1;
            nextStartDate = dayjs(selectedDate).utc().add(d, 'day').toDate();
        }
        changeDate(nextStartDate);
    };

    const previousPage = (isMobile = false) => {
        let prevStartDate = dayjs(selectedDate).startOf('isoWeek').utc().add(-7, 'day').toDate();
        if (isMobile) {
            const d = (dayjs(selectedDate).day() === 1) ? -3 : -1;
            prevStartDate = dayjs(selectedDate).utc().add(d, 'day').toDate();
        }
        changeDate(prevStartDate);
    };

    const onDateChange = (date?: Date) => {
        if (!date) {
            return;
        }
        changeDate(date);
    }

    const onSlotClick = (slot: AppointmentSlot) => {
        dispatch(setSelectedAppointmentSlot(slot));
        history.push('/o/appointment-schedule/confirm');
    }

    const onGenderFilterChanged = (event: CheckboxCheckEvent) => {
        const sex = event.value === GenderFilterOption.Female ? 'F' : 'M';
        const pro = providers.filter(p => p.sex === sex).map(p => p.id);
        if (event.checked) {
            setSlotRequest({...slotRequest, providerId: pro});
            setCurrentFilterCount((count) => count + 1);
        } else {
            const b = slotRequest.providerId?.filter(p => !pro.includes(p));
            setSlotRequest({...slotRequest, providerId: b});
            setCurrentFilterCount((count) => count - 1);
        }
        setDisplayMaxTryError(false);
    }

    const onTimeOfDayChanged = (event: CheckboxCheckEvent) => {
        const timeOfDay = Number(event.value) as AppointmentSlotTimeOfDay;
        const slotRequestTimeOfDayCopy = [...slotRequest.timeOfDays ?? []];
        if (event.checked) {
            slotRequestTimeOfDayCopy.push(timeOfDay);
            setCurrentFilterCount((count) => count + 1);
            setSlotRequest({...slotRequest, timeOfDays: slotRequestTimeOfDayCopy});
        } else {
            slotRequestTimeOfDayCopy.splice(slotRequestTimeOfDayCopy.findIndex(p => p === timeOfDay), 1);
            setSlotRequest({...slotRequest, timeOfDays: slotRequestTimeOfDayCopy});
            setCurrentFilterCount((count) => count - 1);
        }
        setDisplayMaxTryError(false);
    }

    if (!verifiedPatient) {
        return <div>{t('external_access.not_verified_patient')}</div>;
    }
    
    return (
        <div className='flex flex-row appointment-schedule-select without-default-padding without-default-padding-right without-default-padding-bottom'>

            <div className='flex-1 pt-16 mr-14 pb-36'>
                <div className='flex items-center 2xl:whitespace-pre 2xl:h-12 2xl:mt-3 2xl:mb-9'>
                    <h4>
                        {t('external_access.appointments.select_your_appointment')}
                    </h4>
                </div>

                <div className='flex flex-col'>
                    <div className='flex flex-row flex-wrap items-center mb-4 lg:flex-nowrap'>
                        <ControlledDateInput
                            control={control}
                            label='external_access.appointments.date'
                            className='lg:mr-8'
                            name='selectedDate'
                            value={selectedDate}
                            isWeekendDisabled
                            min={new Date(new Date().toDateString())}
                            onChange={(event) => onDateChange(event)}
                            dataTestId='external-access-appointments-reschedule-date'
                        />
                        <ControlledSelect
                            control={control}
                            name='provider'
                            className='lg:mr-8'
                            defaultValue={DEFAULT_OPTION_ANY}
                            label='external_access.schedule_appointment.provider'
                            options={providerOptions}
                            onSelect={changeProvider}
                        />
                        <ControlledSelect
                            name='location'
                            control={control}
                            label='external_access.schedule_appointment.location'
                            options={locationOptions}
                            onSelect={changeLocation}
                        />
                        <div className='flex flex-col lg:ml-7 items-center'>
                            <div className='body2-medium'>
                                {t('external_access.schedule_appointment.filters.title')}
                            </div>
                            <div className='relative flex flex-row items-center'>
                                <SvgIcon
                                    type={Icon.FilterList}
                                    wrapperClassName='pb-6 cursor-pointer flex justify-center'
                                    fillClass='rgba-05-fill'
                                    onClick={() => setFilterOpen(!isFilterOpen)}
                                />
                                {currentFilterCount > 0 && <div className='absolute bottom-6 right-1'>
                                    <FilterDot />
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div>
                        {(isAppointmentSlotsLoading || isFetching) &&
                            <Spinner />
                        }
                        {displayMaxTryError && <div>{t('external_access.appointments.no_appointment_found_in_max_tries')}</div>}
                        {!isAppointmentSlotsLoading && !displayMaxTryError && !isFetching &&
                            <>
                                <div className='flex-row hidden lg:flex'>
                                    <SvgIcon type={Icon.ArrowLeft} className='cursor-pointer' fillClass='active-item-icon'
                                        onClick={() => previousPage()} />
                                    <div>
                                        <div className="grid grid-flow-col pb-3 auto-cols-max md:auto-cols-min">
                                            {appointmentSlots &&
                                                React.Children.toArray(
                                                    getWorkDates().map(date => (
                                                        <div
                                                            className={classnames('flex justify-center reschedule-slot subtitle2 w-56 md:w-80 mx-2', {'slot-date-selected body2': isBordered(date)})}>
                                                            {dayjs(date).format('ddd, MMM D')}
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                        <div className="grid justify-between w-full grid-flow-col pt-4 overflow-y-auto border-t auto-cols-max md:auto-cols-min slot-full-container">
                                            {appointmentSlots &&
                                                React.Children.toArray(
                                                    getWorkDates().map((date) => {
                                                        const column = mappedSlots.get(date);
                                                        return <div className='flex justify-center pt-1'>
                                                            {!isFetching &&
                                                                <DaySlots
                                                                    hideShowMore
                                                                    column={column}
                                                                    showAllSlot={showAllSlot}
                                                                    slotClick={onSlotClick}
                                                                />
                                                            }
                                                        </div>
                                                    })
                                                )
                                            }
                                        </div>
                                        <div className='flex justify-center w-full'>
                                            {appointmentSlots && isSlotOverflow &&
                                                <Button
                                                    buttonType='link'
                                                    label={showAllSlot ? 'common.show_less' : 'common.show_more'}
                                                    onClick={() => setShowAllSlot(!showAllSlot)}
                                                />
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
                                        {appointmentSlots &&
                                            <>
                                                <div className='p-1'>
                                                    <div className='flex justify-center w-auto px-4 pb-3 mb-4 border-b subtitle2'>
                                                        {dayjs(selectedDate).format('ddd, MMM D')}
                                                    </div>
                                                    {
                                                        !isFetching && <>
                                                            {
                                                                mappedSlots.get(dayjs(selectedDate).format('YYYY-MM-DDT00:00:00'))
                                                                    ? <DaySlots
                                                                        hideShowMore
                                                                        column={mappedSlots.get(dayjs(selectedDate).format('YYYY-MM-DDT00:00:00'))}
                                                                        showAllSlot={showAllSlot}
                                                                        slotClick={onSlotClick}
                                                                    />
                                                                    : <div data-test-id='external-access-appointments-no-day-slots'>
                                                                        {t('external_access.appointments.no_day_slots_found')}
                                                                    </div>
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <SvgIcon
                                        type={Icon.ArrowRight}
                                        className='mt-1 cursor-pointer'
                                        fillClass='active-item-icon'
                                        onClick={() => nextPage(true)}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center'>
                <Modal
                    isOpen={isFilterOpen}
                    title={t('common.filters')}
                    className='appointment-schedule-select-modal h-full md:h-auto'
                    onClose={() => setFilterOpen(false)}
                    isClosable
                >
                    <div className='pt-5 pb-12 h-full'>
                        <div>
                            <span className='subtitle2'>{t('external_access.schedule_appointment.time_of_day.title')}</span>
                            <div className='mt-5'>
                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.time_of_day.early_morning'
                                    name='time_earlymorning'
                                    value={AppointmentSlotTimeOfDay.EarlyMorning.toString()}
                                    className='body2'
                                    labelClassName=''
                                    assistiveText='external_access.schedule_appointment.time_of_day.early_morning_info'
                                    onChange={onTimeOfDayChanged}
                                />

                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.time_of_day.morning'
                                    name='time_morning'
                                    className='body2'
                                    labelClassName=''
                                    value={AppointmentSlotTimeOfDay.Morning.toString()}
                                    assistiveText='external_access.schedule_appointment.time_of_day.morning_info'
                                    onChange={onTimeOfDayChanged}
                                />

                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.time_of_day.afternoon'
                                    name='time_afternoon'
                                    className='body2'
                                    labelClassName=''
                                    value={AppointmentSlotTimeOfDay.Afternoon.toString()}
                                    assistiveText='external_access.schedule_appointment.time_of_day.afternoon_info'
                                    onChange={onTimeOfDayChanged}
                                />
                            </div>
                        </div>
                        <div className='mt-6'>
                            <span className='subtitle2'>{t('external_access.schedule_appointment.gender.title')}</span>
                            <div className='flex flex-col md:flex-row justify-between mt-5'>
                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.gender.female'
                                    name='gender_female'
                                    value={GenderFilterOption.Female}
                                    className='body2'
                                    onChange={onGenderFilterChanged}
                                />

                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.gender.male'
                                    name='gender_male'
                                    value={GenderFilterOption.Male}
                                    className='body2'
                                    onChange={onGenderFilterChanged}

                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className='flex-1 hidden h-full lg:block'>
                    <AppointmentScheduleMap departmentLatLng={departmentLatLng} />
            </div>

        </div>
    )

}

export default AppointmentScheduleSelect;
