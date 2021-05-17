import withErrorLogging from '@shared/HOC/with-error-logging';
import Collapsible from '@components/collapsible/collapsible';
import React, {useEffect, useState} from 'react';
import {getContacts} from '@shared/services/contacts.service';
import {getDepartments, getUserList} from '@shared/services/lookups.service';
import {getEnumByType, getList, getLookupValues} from '../services/tickets.service';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {
    selectEnumValues,
    selectLookupValues,
    selectSearchTerm,
    selectTicketFilter,
    selectTicketsPaging
} from '../store/tickets.selectors';
import Radio from '@components/radio/radio';
import {TicketOptionsBase} from '../models/ticket-options-base.model';
import {Controller, useForm} from 'react-hook-form';
import Select from '@components/select/select';
import {Option} from '@components/option/option';
import {selectDepartmentList, selectUserOptions} from '@shared/store/lookups/lookups.selectors';
import {TicketQuery} from '../models/ticket-query';
import dayjs from 'dayjs';
import {TicketEnumValue} from '../models/ticket-enum-value.model';
import utc from 'dayjs/plugin/utc';
import DateTimeInput from '@components/date-time-input/date-time-input';
import TagInput from '@components/tag-input/tag-input';
import './ticket-filter.scss';
import {setTicketListQueryType} from '../store/tickets.slice';
import {authenticationSelector} from '@shared/store/app-user/appuser.selectors';
import {TicketListQueryType} from '../models/ticket-list-type';

const TicketFilter = () => {
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const allKey = '0';
    const timePeriod_DateRange = '4';
    const paging = useSelector(selectTicketsPaging);
    const ticketQueryFilter = useSelector(selectTicketFilter);
    const departments = useSelector((state) => selectLookupValues(state, 'Department'));
    const tags = useSelector((state) => selectLookupValues(state, 'TicketTags'));
    const userList = useSelector(selectUserOptions);
    const ticketChannels = useSelector((state => selectEnumValues(state, 'TicketChannel')));
    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')));
    const statesFilter = useSelector((state => selectEnumValues(state, 'TicketStateFilter')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const offices = useSelector(selectDepartmentList);
    const {username} = useSelector(authenticationSelector);
    const searchTerm: string = useSelector(selectSearchTerm);
    const { control, handleSubmit, watch, setValue } = useForm({});

    const watchTimePeriod = watch('timePeriod');

    useEffect(() => {
        dispatch(getContacts());
        dispatch(getDepartments());
        dispatch(getUserList());
        dispatch(getEnumByType('TicketChannel'));
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketStateFilter'));
        dispatch(getEnumByType('TicketType'));
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketTags'));
    }, [dispatch]);

    const [formVisible, setformVisible] = useState(true);
    const getSelectedFromCheckbox = (items: CheckboxCheckEvent[]): string[] => {
        if (items) {
            const isAll = items.find(a => a && parseInt(a.value) === parseInt(allKey) && a.checked);
            if (!isAll) {
                return items.filter((a: CheckboxCheckEvent) => a.checked).map((b: CheckboxCheckEvent) => b.value);
            }
        }
        return [];
    }

    const fetchTickets = (values: any) => {
        const query: TicketQuery = {
            ...paging,
            ...ticketQueryFilter
        };
        query.statuses = getSelectedFromCheckbox(values.statuses).map((a: string) => parseInt(a));
        query.channels = getSelectedFromCheckbox(values.channels).map((a: string) => parseInt(a));
        query.ticketTypes = getSelectedFromCheckbox(values.ticketTypes).map((a: string) => parseInt(a));
        query.locations = getSelectedFromCheckbox(values.offices);
        query.states = getSelectedFromCheckbox(values.states).map((a: string) => parseInt(a));
        if (values.priority) {
            query.priority = values.priority;
        }
        if (values.tags) {
            query.tags = values.tags;
        }
        if (values.department) {
            query.departments = [];
            if (values.department !== allKey) {
                query.departments.push(values.department);
            }
        }

        if (values.timePeriod) {
            if (values.timePeriod === timePeriod_DateRange) {
                if (values.fromDate) {
                    query.fromDate = dayjs(values.fromDate).utc(true).format('YYYY-MM-DD');
                }

                if (values.toDate) {
                    query.toDate = dayjs(values.toDate).utc(true).format('YYYY-MM-DD');
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
                query.fromDate = date.format('YYYY-MM-DD');
            }
        }

        query.assignedTo = [];
        if (values.assignedTo)
        {
            query.assignedTo.push(values.assignedTo);
        }

        if (searchTerm) {
            query.searchTerm = searchTerm;
        }

        dispatch(getList(query, true));

        if (query.assignedTo && query.assignedTo.length === 1 && query.assignedTo[0] === username) {
            dispatch(setTicketListQueryType(TicketListQueryType.MyTicket));
        } else {
            dispatch(setTicketListQueryType(TicketListQueryType.AllTicket));
        }

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

    const convertEnumToOptions = (items: TicketEnumValue[]): TicketOptionsBase[] => {
        if (items && items.length > 0) {
            return items.map(item => {
                return {
                    key: item.key.toString(),
                    value: item.value
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

    const GetCollapsibleCheckboxControl = (title: string, name: string, items: TicketOptionsBase[]) => {
        return <Collapsible title={title}>
            {
                items.map((item) => {
                    return <Controller
                        control={control}
                        name={`${name}[${item.key}]`}
                        defaultValue=''
                        key={item.key}
                        render={(props) => (
                            <Checkbox
                                name={`${name}[${item.key}]`}
                                ref={props.ref}
                                truncate={true}
                                label={item.value}
                                data-test-id={`${name}-checkbox-' + ${item.key}`}
                                value={item.key}
                                onChange={(e: CheckboxCheckEvent) => {
                                    props.onChange(e);
                                }}
                            />
                        )}
                    />
                })
            }
        </Collapsible>
    }

    const GetRadioCollapsibleControl = (title: string, name: string, items: TicketOptionsBase[]) => {
        return <Collapsible title={title}>
            <Controller
                control={control}
                defaultValue=''
                name={name}
                render={(props) => (<Radio
                        name={name}
                        truncate={true}
                        ref={props.ref}
                        data-test-id={`${name}-radio`}
                        labelClassName='ticket-filter-radio'
                        items={convertOptionsToRadio(items)}
                        onChange={(e: string) => {
                            props.onChange(e);
                        }}
                    />
                )}
            />
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
        setformVisible(false);
        setTimeout(() => {
            setformVisible(true);
            fetchTickets({});
        }, 0);
    }

    const dateFilters = () => {
        if (watchTimePeriod === timePeriod_DateRange) {
            return (<div>
                <Controller
                    control={control}
                    defaultValue=''
                    data-test-id='ticket-filter-from-date'
                    name='fromDate'
                    type='date'
                    as={DateTimeInput}
                    label={'tickets.filter.from_date'}
                />
                <Controller
                    control={control}
                    defaultValue=''
                    name='toDate'
                    data-test-id='ticket-filter-to-date'
                    type='date'
                    as={DateTimeInput}
                    label={'tickets.filter.to_date'}
                />
            </div>);
        } else {
            return <span/>;
        }
    }

    const setSelectedTags = (tags: string[]) => {
        setValue('tags', tags);
    }

    return <div className='bg-secondary-100 pb-20 min-h-full px-6'>
        <div className='flex flex-row justify-between pt-7'>
            <div className='subtitle pb-8 h7'>{t('tickets.filter.filter_tickets')}</div>
            <div className='cursor-pointer'
                 onClick={() => handleSubmit(fetchTickets)()}>{t('tickets.filter.fetch')}</div>
            <div className='cursor-pointer' onClick={() => resetForm()}>{t('tickets.filter.clear_all')}</div>
        </div>
        {formVisible && <form>
            {GetCollapsibleCheckboxControl('tickets.filter.statuses', 'statuses', addAllOption(convertEnumToOptions(ticketStatuses)))}
            {GetCollapsibleCheckboxControl('tickets.filter.state', 'states', addAllOption(convertEnumToOptions(statesFilter)))}
            {GetRadioCollapsibleControl('tickets.filter.time_period', 'timePeriod', timePeriodList)}
            {dateFilters()}
            {GetRadioCollapsibleControl('tickets.filter.priority', 'priority', addAllOption(convertEnumToOptions([...ticketPriorities].reverse())))}
            {GetCollapsibleCheckboxControl('tickets.filter.channel', 'channels', addAllOption(convertEnumToOptions(ticketChannels)))}
            {GetCollapsibleCheckboxControl('tickets.filter.ticket_type', 'ticketTypes', addAllOption(convertEnumToOptions(ticketTypes)))}
            {GetRadioCollapsibleControl('tickets.filter.department', 'department', addAllOption(convertDepartmentsToOptions()))}
            {GetCollapsibleCheckboxControl('tickets.filter.office_location', 'offices', addAllOption(convertOfficesToOptions()))}
            <Collapsible title={'tickets.filter.assigned_to'}>
                <div>
                    <Controller
                        name='assignedTo'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'assigned-to-user-list'}
                                options={getUserOptions()}
                                value={props.value}
                                onSelect={(option?: Option) => {
                                    if (option) {
                                        props.onChange(option?.value);
                                    }
                                }}
                            />
                        )}
                    />
                </div>
            </Collapsible>
            <Collapsible title={'tickets.filter.tags'}>
                <Controller
                    name='tags'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <TagInput
                            {...props}
                            tagOptions={tags}
                            data-test-id='ticket-new-tag-input'
                            className={'w-full border-none h-14'}
                            setSelectedTags={setSelectedTags}
                            initialIsListVisible={true}
                        />
                    )}
                />
            </Collapsible>
        </form>}
    </div>;
}

export default withErrorLogging(TicketFilter);
