import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ControlledCheckbox, ControlledDateInput, ControlledSelect} from '@components/controllers';
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
import businessDays from '@shared/utils/business-days';
import {Option} from '@components/option/option';
import MapViewer from '@components/map-viewer';
import {Marker} from 'react-leaflet';
import Button from '@components/button/button';
import {setSelectedAppointmentSlot} from '../store/appointments.slice';
import {useHistory} from 'react-router';
import {AppointmentSlotTimeOfDay} from '../models';
import Modal from '@components/modal/modal';
import {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {GenderFilterOption} from '../models/appointment-gender-filter-option.model';
import './appointment-schedule-select.scss';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';

const numberOfWorkDays = 5;

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

    const [isWeekendSelected, setIsWeekendSelected] = useState(false);
    const [showAllSlot, setShowAllSlot] = useState(false);
    const [slotRequest, setSlotRequest] = useState(appointmentSlotRequest);
    const [departmentLatLng, setDepartmentLatLng] = useState<number[][]>();
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [startDate, setStartDate] = useState(appointmentSlotRequest?.startDate ?? dayjs().utc().local().toDate());

    const DEFAULT_OPTION_ANY: Option = useMemo(() => ({
        label: t('common.any'),
        value: ''
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
            item => item.name,
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
        let workDate = dayjs(startDate).startOf('isoWeek').toDate();
        const startDay = workDate.getDay();
        for (let day = startDay; day <= numberOfWorkDays; day++) {
            workDates.push(utils.formatUtcDate(workDate, 'YYYY-MM-DDT00:00:00'));
            workDate = dayjs(workDate).add(1, 'day').toDate();
        }
        return workDates;
    }, [startDate]);

    const {isLoading: isAppointmentSlotsLoading, data: appointmentSlots, isFetching} =
        useQuery<AppointmentSlot[], AxiosError>([GetAppointmentSlots, slotRequest],
            () => getAppointmentSlots({...slotRequest}, false),
            {
                enabled: !!slotRequest,
                onSuccess: (data: AppointmentSlot[]) => {
                    if (!data || data.length < 1) {
                        setDepartmentLatLng(undefined);
                        return;
                    }
                    const latLong = locations.filter(p => data.findIndex(d => p.id === d.departmentId) > -1)
                        .map(p => [p.latitude, p.longitude]);
                    setDepartmentLatLng(latLong);

                    setValue('selectedDate', new Date(data[0].date));
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
        return dayjs(slotsDate).isSame(startDate);
    }
    const changeDate = (newStartDate: Date) => {
        setValue('selectedDate', newStartDate);
        setStartDate(newStartDate);
        setSlotRequest({...slotRequest, startDate: newStartDate});
    }

    const changeProvider = (event?: Option) => {
        if (!event) {
            return;
        }
        setSlotRequest({...slotRequest, providerId: !!event.value ? [Number(event.value)] : undefined});
    }

    const changeLocation = (event?: Option) => {
        if (!event) {
            return;
        }
        setSlotRequest({...slotRequest, departmentId: !!event.value ? Number(event.value) : undefined});
    }

    const nextPage = (isMobile = false) => {
        setIsWeekendSelected(false);
        let nextStartDate = dayjs(startDate).startOf('isoWeek').utc().add(7, 'day').toDate();
        if (isMobile) {
            const d = (dayjs(startDate).day() === 5) ? 3 : 1;
            nextStartDate = dayjs(startDate).utc().add(d, 'day').toDate();
        }
        changeDate(nextStartDate);
    };

    const previousPage = (isMobile = false) => {
        setIsWeekendSelected(false);
        let prevStartDate = dayjs(startDate).startOf('isoWeek').utc().add(-7, 'day').toDate();
        if (isMobile) {
            const d = (dayjs(startDate).day() === 1) ? -3 : -1;
            prevStartDate = dayjs(startDate).utc().add(d, 'day').toDate();
        }
        changeDate(prevStartDate);
    };

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
        } else {
            const b = slotRequest.providerId?.filter(p => !pro.includes(p));
            setSlotRequest({...slotRequest, providerId: b});
        }
    }

    const onTimeOfDayChanged = (event: CheckboxCheckEvent) => {
        const timeOfDay = Number(event.value) as AppointmentSlotTimeOfDay;
        const slotRequestTimeOfDayCopy = [...slotRequest.timeOfDays ?? []];
        if (event.checked) {
            slotRequestTimeOfDayCopy.push(timeOfDay);
            setSlotRequest({...slotRequest, timeOfDays: slotRequestTimeOfDayCopy});
        } else {
            slotRequestTimeOfDayCopy.splice(slotRequestTimeOfDayCopy.findIndex(p => p === timeOfDay), 1);
            setSlotRequest({...slotRequest, timeOfDays: slotRequestTimeOfDayCopy});
        }
    }

    if (!verifiedPatient) {
        return <div>{t('hipaa_validation_form.not_verified_patient')}</div>;
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
                            value={startDate}
                            isWeekendDisabled
                            min={new Date(new Date().toDateString())}
                            onChange={(event) => onDateChange(event)}
                            dataTestId='external-access-appointments-reschedule-date'
                        />
                        <ControlledSelect
                            control={control}
                            name='provider'
                            className='lg:mr-8'
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
                        <SvgIcon
                            type={Icon.FilterList}
                            wrapperClassName='pb-6 lg:ml-7 cursor-pointer'
                            fillClass='rgba-05-fill'
                            onClick={() => setFilterOpen(!isFilterOpen)}
                        />
                    </div>
                    <div>
                        {(isAppointmentSlotsLoading || isFetching) &&
                            <Spinner />
                        }
                        {!isAppointmentSlotsLoading && !isFetching &&
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
                                                    getWorkDates().map((date, index) => {
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
                                                        {dayjs(startDate).format('ddd, MMM D')}
                                                    </div>
                                                    {
                                                        !isFetching && <>
                                                            {
                                                                mappedSlots.get(dayjs(startDate).format('YYYY-MM-DDT00:00:00'))
                                                                    ? <DaySlots
                                                                        hideShowMore
                                                                        column={mappedSlots.get(dayjs(startDate).format('YYYY-MM-DDT00:00:00'))}
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
                    className='appointment-schedule-select-modal'
                    onClose={() => setFilterOpen(false)}
                    isClosable
                >
                    <div className='pt-5 pb-12'>
                        <div>
                            <span className='subtitle2'>{t('external_access.schedule_appointment.time_of_day.title')}</span>
                            <div className='mt-5'>
                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.time_of_day.early_morning'
                                    name='time_earlymorning'
                                    value={AppointmentSlotTimeOfDay.EarlyMorning.toString()}
                                    className='body2'
                                    assistiveText='external_access.schedule_appointment.time_of_day.early_morning_info'
                                    onChange={onTimeOfDayChanged}
                                />

                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.time_of_day.morning'
                                    name='time_morning'
                                    className='body2'
                                    value={AppointmentSlotTimeOfDay.Morning.toString()}
                                    assistiveText='external_access.schedule_appointment.time_of_day.morning_info'
                                    onChange={onTimeOfDayChanged}
                                />

                                <ControlledCheckbox
                                    control={control}
                                    label='external_access.schedule_appointment.time_of_day.afternoon'
                                    name='time_afternoon'
                                    className='body2'
                                    value={AppointmentSlotTimeOfDay.Afternoon.toString()}
                                    assistiveText='external_access.schedule_appointment.time_of_day.afternoon_info'
                                    onChange={onTimeOfDayChanged}
                                />
                            </div>
                        </div>
                        <div className='mt-6'>
                            <span className='subtitle2'>{t('external_access.schedule_appointment.gender.title')}</span>
                            <div className='flex flex-row justify-between mt-5'>
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
                {!isAppointmentSlotsLoading && !isFetching &&
                    <MapViewer
                        className='map-viewer'
                        wrapperClassName='map-viewer-wrapper'
                        zoomControl
                        scrollWheelZoom
                        bounds={departmentLatLng}
                    >
                        {departmentLatLng &&
                            React.Children.toArray(departmentLatLng.map(l => (
                                <Marker position={[l[0], l[1]]} />
                            )))
                        }
                    </MapViewer>
                }
            </div>

        </div>
    )

}

export default AppointmentScheduleSelect;
