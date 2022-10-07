import withErrorLogging from '@shared/HOC/with-error-logging';
import Collapsible from '@components/collapsible/collapsible';
import React, { useEffect, useState } from 'react';
import { getLocations, getRatingOptions, getUserList } from '@shared/services/lookups.service';
import { getEnumByType, getList } from '../services/tickets.service';
import { getLookupValues } from '@shared/services/lookups.service';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CheckboxCheckEvent } from '@components/checkbox/checkbox';
import {
    selectEnumValues,
    selectLookupValues,
    selectSearchTerm,
    selectTicketFilter,
    selectTicketQueryType,
    selectTicketsPaging
} from '../store/tickets.selectors';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';
import Radio from '@components/radio/radio';
import { TicketOptionsBase } from '../models/ticket-options-base.model';
import { Controller, useForm } from 'react-hook-form';
import { Option } from '@components/option/option';
import { selectLocationList, selectRatingOptions, selectUserOptions } from '@shared/store/lookups/lookups.selectors';
import { TicketQuery } from '../models/ticket-query';
import dayjs from 'dayjs';
import { TicketEnumValue } from '../models/ticket-enum-value.model';
import utc from 'dayjs/plugin/utc';
import TagInput from '@components/tag-input/tag-input';
import { setTicketListQueryType, setTicketsFiltered } from '../store/tickets.slice';
import { TicketListQueryType } from '../models/ticket-list-type';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import classNames from 'classnames';
import ControlledSelect from '@components/controllers/controlled-select';
import { DATE_ISO_FORMAT } from '@shared/constants/form-constants'
import utils from '@shared/utils/utils';
import './ticket-filter.scss';
import Button from '@components/button/button';
import CheckboxList from '@components/checkbox-list/checkbox-list';

const TicketFilter = ({ isOpen }: { isOpen: boolean }) => {
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const allKey = '0';
    const timePeriod_DateRange = '4';
    const paging = useSelector(selectTicketsPaging);
    const ticketQueryFilter = useSelector(selectTicketFilter);
    const departments = useSelector((state) => selectLookupValues(state, 'Department'));
    const reasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const tags = useSelector((state) => selectLookupValues(state, 'TicketTags'));
    const userList = useSelector(selectUserOptions);
    const ticketChannels = useSelector((state => selectEnumValues(state, 'TicketChannel')));
    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')));
    const statesFilter = useSelector((state => selectEnumValues(state, 'TicketStateFilter')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const offices = useSelector(selectLocationList);
    const searchTerm: string = useSelector(selectSearchTerm);
    const { control, handleSubmit, watch, setValue, getValues, reset } = useForm({});
    const [fromDate, setFromDate] = useState<Date | undefined>();
    const [toDate, setToDate] = useState<Date | undefined>();
    const [formResetDateTime, setFormResetDateTime] = useState<Date>();
    const ticketListQueryType = useSelector(selectTicketQueryType);
    const [collapsibleState, setCollapsibleState] = useState<{ [key: string]: boolean }>({});
    const watchTimePeriod = watch('timePeriod');
    const ratings = useSelector(selectRatingOptions);
    const { id } = useSelector(selectAppUserDetails);

    useEffect(() => {
        dispatch(getLocations());
        dispatch(getUserList());
        dispatch(getEnumByType('TicketChannel'));
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketStateFilter'));
        dispatch(getRatingOptions());
        dispatch(getEnumByType('TicketType'));
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketTags'));
        dispatch(getLookupValues('TicketReason'));
    }, [dispatch]);

    useEffect(() => {
        const setCheckBoxControl = (name: string, values: any[] | any | undefined) => {
            if (!values || !name) {
                return;
            }
            if (Array.isArray(values)) {
                values.forEach((value) => setValue(`${name}[${parseInt(value) + 1000}]`, { value: value, checked: true }));
            } else {
                setValue(`${name}[${values}]`, { value: values, checked: true });
            }
        }
        const setRadioButtonControl = (name: string, values: any[] | any | undefined) => {
            const isArray = Array.isArray(values);
            if (!values || !name || (isArray && values.length < 1)) {
                return;
            }

            setValue(name, isArray ? `${values[0]}` : `${values}`);
        }

        const setTagValueControl = (name: string, values: any[] | any) => {
            if (!values || !name) {
                return;
            }
            setValue(name, Array.isArray(values) ? values : [values]);
        }

        const setDatePickerControl = (fromDateFilter: string | undefined, toDateFilter: string | undefined) => {
            if (!!fromDateFilter && !!toDateFilter) {
                setValue('timePeriod', '4');
                setValue('fromDate', dayjs(fromDateFilter).utc().toDate());
                setValue('toDate', dayjs(toDateFilter).utc().toDate());
            } else if (fromDateFilter) {
                const date = dayjs().utc();
                switch (fromDateFilter) {
                    case date.startOf('day').format(DATE_ISO_FORMAT):
                        setValue('timePeriod', '1');
                        break;
                    case date.subtract(7, 'day').format(DATE_ISO_FORMAT):
                        setValue('timePeriod', '2');
                        break;
                    case date.subtract(30, 'day').startOf('day').format(DATE_ISO_FORMAT):
                        setValue('timePeriod', '3');
                        break;
                    default:
                        setValue('timePeriod', '4');
                        setValue('fromDate', dayjs(ticketQueryFilter.fromDate).utc().toDate());
                        setValue('toDate', dayjs(ticketQueryFilter.fromDate).utc().toDate());
                        break;
                }
            }
        }

        const getDefaultCheckboxValues = (name: string, values: any[] | any | undefined): void => {
            let items;
            let defaultValues;
            if(!values || values.length === 0){
                return;
            }
            if(!Array.isArray(values)){
                values = [values];
            }
            switch (name) {
                case 'states':
                    items = statesFilter
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(parseInt(value.key)) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultStatesValues(defaultValues);
                    break;
                case 'channels':
                    items = ticketChannels
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(parseInt(value.key)) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultChannelsValues(defaultValues);
                    break;
                case 'statuses':
                    items = convertEnumToOptions(ticketStatuses)
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(parseInt(value.key)) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultStatusValues(defaultValues);
                    break;
                case 'ticketTypes':
                    items = ticketTypes
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(parseInt(value.key)) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultTicketTypesValues(defaultValues);
                    break;
                case 'offices':
                    items = convertOfficesToOptions()
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(parseInt(value.key)) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultOfficesValues(defaultValues);
                    break;
                case 'patientRating':
                    items = convertEnumToOptions([...ratings].sort((a, b) => b.key - a.key), true)
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(parseInt(value.key)) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultPatientRatingValues(defaultValues);
                    break;
                case 'botRating':
                    items = convertEnumToOptions([...ratings].sort((a, b) => b.key - a.key), true)
                    defaultValues = new Array(items.length).fill(false);
                    items.map((value, index) => {values.includes(parseInt(value.key)) ? defaultValues[index] = true : defaultValues[index] = false});
                    setDefaultBotRatingValues(defaultValues);
                break;
            }
        }
        getDefaultCheckboxValues('botRating', ticketQueryFilter.botRating);
        getDefaultCheckboxValues('patientRating', ticketQueryFilter.patientRating);
        getDefaultCheckboxValues('offices', ticketQueryFilter.locations);
        getDefaultCheckboxValues('ticketTypes', ticketQueryFilter.ticketTypes);
        getDefaultCheckboxValues('statuses', ticketQueryFilter.statuses);
        getDefaultCheckboxValues('channels', ticketQueryFilter.channels);
        getDefaultCheckboxValues('states', ticketQueryFilter.states);
        setCheckBoxControl('states', ticketQueryFilter.states);
        setCheckBoxControl('channels', ticketQueryFilter.channels);
        setCheckBoxControl('statuses', ticketQueryFilter.statuses);
        setCheckBoxControl('ticketTypes', ticketQueryFilter.ticketTypes);
        setCheckBoxControl('offices', ticketQueryFilter.locations);
        setRadioButtonControl('department', ticketQueryFilter.departments);
        setRadioButtonControl('reasons', ticketQueryFilter.reasons);
        setRadioButtonControl('priority', ticketQueryFilter.priority);
        setTagValueControl('tags', ticketQueryFilter.tags);
        setDatePickerControl(ticketQueryFilter.fromDate, ticketQueryFilter.toDate);
        if (ticketQueryFilter.assignedTo && ticketQueryFilter.assignedTo.length > 0) {
            setValue('assignedTo', ticketQueryFilter.assignedTo);
        }
        setCheckBoxControl('patientRating', ticketQueryFilter.patientRating);
        setCheckBoxControl('botRating', ticketQueryFilter.botRating);

    }, [setValue, ticketQueryFilter])

    const getSelectedFromCheckbox = (items: CheckboxCheckEvent[], ignoreIsAllKeyCheck = false): string[] => {
        if (items) {
            return items.filter((a: CheckboxCheckEvent) => a.checked).map((b: CheckboxCheckEvent) => b.value);
        }
        return [];
    }

    const fetchTickets = (values: any) => {
        const query: TicketQuery = {
            ...paging,
            ...ticketQueryFilter,
            page: 1
        };
        query.statuses = getSelectedFromCheckbox(values.statuses).map((a: string) => parseInt(a));
        query.channels = getSelectedFromCheckbox(values.channels).map((a: string) => parseInt(a));
        query.ticketTypes = getSelectedFromCheckbox(values.ticketTypes).map((a: string) => parseInt(a));
        query.locations = getSelectedFromCheckbox(values.offices);
        query.states = getSelectedFromCheckbox(values.states).map((a: string) => parseInt(a));
        query.patientRating = getSelectedFromCheckbox(values.patientRating, true).map((a: string) => parseInt(a));
        query.botRating = getSelectedFromCheckbox(values.botRating, true).map((a: string) => parseInt(a));
        query.departments = [];
        query.tags = [];
        query.reasons = [];
        query.priority = undefined;
        query.fromDate = undefined;
        query.toDate = undefined;
        query.assignedTo = [];
        let hasFilter = false;
        if ((query.statuses && query.statuses.length > 0) ||
            (query.channels && query.channels.length > 0) ||
            (query.ticketTypes && query.ticketTypes.length > 0) ||
            (query.locations && query.locations.length > 0) ||
            (query.states && query.states.length > 0) ||
            (query.patientRating && query.patientRating.length > 0) ||
            (query.botRating && query.botRating.length > 0)) {
            hasFilter = true;
        }
        if (values.priority) {
            query.priority = values.priority;
            hasFilter = true;
        }
        if (values.tags && values.tags.length > 0) {
            query.tags = values.tags;
            hasFilter = true;
        }

        if (values.department) {
            query.departments = [];
            hasFilter = true;
            if (values.department !== allKey) {
                query.departments.push(values.department);
            }
        }
        if (values.reasons) {
            hasFilter = true;
            query.reasons = [];
            if (values.reasons !== allKey) {
                query.reasons.push(values.reasons);
            }
        }

        if (values.timePeriod) {
            hasFilter = true;
            if (values.timePeriod === timePeriod_DateRange) {
                const { fromDate: fromDateValue, toDate }: { fromDate: Date | undefined, toDate: Date | undefined } = values;
                if (fromDateValue) {
                    query.fromDate = utils.toShortISOLocalString(fromDateValue);
                }

                if (toDate) {
                    query.toDate = utils.toShortISOLocalString(toDate);
                }
            } else {
                values.fromDate = undefined;
                values.toDate = undefined;
                let date = dayjs().utc();
                switch (values.timePeriod) {
                    case '1':
                        date = date.startOf('day');
                        break;
                    case '2':
                        date = date.subtract(7, 'day')
                        break;
                    case '3':
                        date = date.subtract(30, 'day').startOf('day')
                        break;
                }
                query.fromDate = date.format(DATE_ISO_FORMAT);
            }
        }

        if (!!values.assignedTo) {
            hasFilter = true;
            query.assignedTo.push(values.assignedTo);
        }

        if (searchTerm && values.searchTerm !== "") {
            hasFilter = true;
            query.searchTerm = searchTerm;
        }else{
            query.searchTerm = "";
        }

        if (ticketListQueryType === TicketListQueryType.MyTicket) {
            dispatch(setTicketListQueryType(TicketListQueryType.MyTicket));
            query.assignedTo = [id];
        } else {
            dispatch(setTicketListQueryType(TicketListQueryType.AllTicket));
        }
        dispatch(setTicketsFiltered(hasFilter));
        dispatch(getList(query, true));

    }

    const convertOfficesToOptions = (): TicketOptionsBase[] => {
        if (offices && offices.length > 0) {
            return offices.map(office => {
                return {
                    key: office.id.toString(),
                    value: office.name
                }
            })
        }

        return [];
    }

    const convertReasonsToOptions = (): TicketOptionsBase[] => {
        if (reasons && reasons.length > 0) {
            return [...reasons]
                .sort((a, b) => a.label.localeCompare(b.label))
                .map(reason => {
                    const parentLabel = reason?.parentValue ? reasons.find(r => r.value === reason.parentValue)?.label : '';
                    return {
                        key: reason.value,
                        value: parentLabel ? `${parentLabel} - ${reason.label}` : reason.label
                    }
                })
        }

        return [];
    }

    const convertDepartmentsToOptions = (): TicketOptionsBase[] => {
        if (departments && departments.length > 0) {
            return departments.map(dept => {
                return {
                    key: dept.value,
                    value: dept.label
                }
            })
        }

        return [];
    }

    const convertEnumToOptions = (items: TicketEnumValue[], camelCaseToWords = false): TicketOptionsBase[] => {
        if (items && items.length > 0) {
            return items.map(item => {
                return {
                    key: item.key.toString(),
                    value: camelCaseToWords ? utils.spaceBetweenCamelCaseWords(item.value) : item.value
                }
            })
        }
        return [];
    }

    const convertOptionsToRadio = (items: TicketOptionsBase[]): Option[] => {
        return items.map(item => {
            return {
                value: item.key,
                label: item.value
            } as Option
        })
    }

    const timePeriodList: TicketOptionsBase[] = [
        {
            key: '1',
            value: t('tickets.filter.time_periods.today')
        },
        {
            key: '2',
            value: t('tickets.filter.time_periods.last_7_days')
        },
        {
            key: '3',
            value: t('tickets.filter.time_periods.last_30_days')
        },
        {
            key: '4',
            value: t('tickets.filter.time_periods.date_range')
        }
    ]

    const addAllOption = (list: any[]): TicketOptionsBase[] => {
        return [{
            key: allKey,
            value: t('common.all')
        }, ...list];
    }

    const [defaultStatusValues, setDefaultStatusValues] = useState<boolean[]>(new Array(ticketStatuses.length).fill(false));
    const [defaultStatesValues, setDefaultStatesValues] = useState<boolean[]>(new Array(statesFilter.length).fill(false));
    const [defaultChannelsValues, setDefaultChannelsValues] = useState<boolean[]>(new Array(ticketChannels.length).fill(false));
    const [defaultTicketTypesValues, setDefaultTicketTypesValues] = useState<boolean[]>(new Array(ticketTypes.length).fill(false));
    const [defaultOfficesValues, setDefaultOfficesValues] = useState<boolean[]>(new Array(convertOfficesToOptions().length).fill(false));
    const [defaultPatientRatingValues, setDefaultPatientRatingValues] = useState<boolean[]>(new Array((convertEnumToOptions([...ratings].sort((a, b) => b.key - a.key), true)).length).fill(false));
    const [defaultBotRatingValues, setDefaultBotRatingValues] = useState<boolean[]>(new Array((convertEnumToOptions([...ratings].sort((a, b) => b.key - a.key), true)).length).fill(false));
    const getDefaultCheckboxValues = (name: string): boolean[] => {
        let value;
        switch (name) {
            case 'states':
                value = defaultStatesValues
                break;
            case 'channels':
                value = defaultChannelsValues
                break;
            case 'statuses':
                value = defaultStatusValues;
                break;
            case 'ticketTypes':
                value = defaultTicketTypesValues
                break;
            case 'offices':
                value = defaultOfficesValues
                break;
            case 'patientRating':
                value = defaultPatientRatingValues
                break;
            case 'botRating':
                value = defaultBotRatingValues
                break;
        }
        return value;
    }

    const GetCollapsibleCheckboxControl = (title: string, name: string, items: TicketOptionsBase[]) => {
        return <Collapsible title={title} isOpen={collapsibleState[name]} onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, [name]: isCollapsed })}>
                <CheckboxList items={items} name={name} control={control} resetDateTime={formResetDateTime} defaultValues={getDefaultCheckboxValues(name)}/>
        </Collapsible>
    }

    const GetRadioCollapsibleControl = (title: string, name: string, items: TicketOptionsBase[], children?: React.ReactNode) => {
        return <Collapsible title={title} isOpen={collapsibleState[name]} onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, [name]: isCollapsed })}>
            <Controller
                control={control}
                name={name}
                defaultValue=''
                render={(props) => {
                    return (<Radio
                        name={name}
                        truncate={true}
                        ref={props.ref}
                        data-test-id={`${name}-radio`}
                        labelClassName='ticket-filter-radio'
                        value={props.value}
                        items={convertOptionsToRadio(items)}
                        onChange={(e: string) => {
                            props.onChange(e);
                        }}
                    />
                    )
                }}
            />
            {children}
        </Collapsible>
    }

    const getUserOptions = (): Option[] => {
        const cloned = [...userList];
        cloned.unshift({
            label: t('common.all'),
            value: ''
        });
        return cloned;
    }

    const resetForm = () => {
        const fieldsValue = getValues();
        const clearArray = (values: any) => Array.isArray(values) ? Array(values.length).fill('') : values;
        dispatch(setTicketsFiltered(false));
        reset({
            statuses: clearArray(fieldsValue.statuses),
            channels: clearArray(fieldsValue.channels),
            offices: clearArray(fieldsValue.offices),
            states: clearArray(fieldsValue.states),
            ticketTypes: clearArray(fieldsValue.ticketTypes),
            assignedTo: '',
            department: '',
            reasons: '',
            priority: '',
            tags: [],
            timePeriod: '',
            patientRating: clearArray(fieldsValue.patientRating),
            botRating: clearArray(fieldsValue.botRating),
        });
        setFromDate(undefined);
        setToDate(undefined);
        setFormResetDateTime(new Date());
        fetchTickets({
            searchTerm: ""
        });
    }
    const dateFilters = () => {
        return (<div className={watchTimePeriod === timePeriod_DateRange ? 'block' : 'hidden'}>
            <ControlledDateInput
                control={control}
                type='date'
                label='tickets.filter.from_date'
                name='fromDate'
                dataTestId='ticket-filter-from-date'
                value={fromDate}
                defaultValue={null}
                max={new Date(new Date().toDateString())}
                isSmallSize={true}
                isCalendarPositionComputed
                onChange={setFromDate}
            />
            <ControlledDateInput
                control={control}
                type='date'
                defaultValue={null}
                disabled={!fromDate}
                min={fromDate}
                value={toDate}
                isCalendarPositionComputed
                label='tickets.filter.to_date'
                max={new Date(new Date().toDateString())}
                isSmallSize={true}
                onChange={setToDate}
                name='toDate'
                dataTestId='ticket-filter-to-date'
            />
        </div>);
    }

    const setSelectedTags = (values: string[]) => {
        setValue('tags', values);
    }

    const getClassNames = () => classNames({
        'w-96 transition-width transition-slowest ease top-0 bg-secondary-100 overflow-y-auto overflow-x-hidden': isOpen,
        'hidden': !isOpen
    });

    return <div className={getClassNames()}>
        <div className='min-h-full px-6 pb-20 bg-secondary-100 relative pt-4' >
            <div className='py-4 subtitle'>{t('tickets.filter.filter_tickets')}</div>
            <div className='flex flex-row pb-3'>
                <Button data-test-id='apply-button' className='cursor-pointer mr-4' label='tickets.filter.fetch' buttonType='small' onClick={() => handleSubmit(fetchTickets)()} ></Button>
                <Button data-test-id='reset-all-button' className='cursor-pointer' label='tickets.filter.reset_all' buttonType='secondary' onClick={() => resetForm()}></Button>
            </div>
            <form id='myForm'>
                {GetCollapsibleCheckboxControl('tickets.filter.statuses', 'statuses', (convertEnumToOptions(ticketStatuses)))}
                {GetCollapsibleCheckboxControl('tickets.filter.state', 'states', (convertEnumToOptions(statesFilter)))}
                {GetRadioCollapsibleControl('tickets.filter.time_period', 'timePeriod', timePeriodList, dateFilters())}
                {GetRadioCollapsibleControl('tickets.filter.priority', 'priority', addAllOption(convertEnumToOptions([...ticketPriorities].reverse())))}
                {GetCollapsibleCheckboxControl('tickets.filter.channel', 'channels', (convertEnumToOptions(ticketChannels)))}
                {GetCollapsibleCheckboxControl('tickets.filter.ticket_type', 'ticketTypes', (convertEnumToOptions(ticketTypes)))}
                {GetRadioCollapsibleControl('tickets.filter.reason', 'reasons', addAllOption(convertReasonsToOptions()))}
                {GetRadioCollapsibleControl('tickets.filter.department', 'department', addAllOption(convertDepartmentsToOptions()))}
                {GetCollapsibleCheckboxControl('tickets.filter.office_location', 'offices', (convertOfficesToOptions()))}
                {ticketListQueryType !== TicketListQueryType.MyTicket &&
                    <Collapsible title={'tickets.filter.assigned_to'}
                        isOpen={collapsibleState['assignedTo']}
                        onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, "assignedTo": isCollapsed })}>
                        <div>
                            <ControlledSelect
                                name='assignedTo'
                                control={control}
                                defaultValue=''
                                options={getUserOptions()}
                            />
                        </div>
                    </Collapsible>
                }
                {ratings && GetCollapsibleCheckboxControl('tickets.filter.patient_ratings', 'patientRating', convertEnumToOptions([...ratings].sort((a, b) => b.key - a.key), true))}
                {ratings && GetCollapsibleCheckboxControl('tickets.filter.bot_ratings', 'botRating', convertEnumToOptions([...ratings].sort((a, b) => b.key - a.key), true))}
                <Collapsible title='tickets.filter.tags'
                    isOpen={collapsibleState['tags']}
                    onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, "tags": isCollapsed })}>
                    <Controller
                        name='tags'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <TagInput
                                {...props}
                                initialTags={props.value}
                                tagOptions={tags}
                                data-test-id='ticket-new-tag-input'
                                className={'w-full border-none h-14'}
                                tagHolderClassName=''
                                setSelectedTags={setSelectedTags}
                                initialIsListVisible={true}
                            />
                        )}
                    />
                </Collapsible>
            </form>
        </div>
    </div>;
}

export default withErrorLogging(TicketFilter);
