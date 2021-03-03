import withErrorLogging from '../../../shared/HOC/with-error-logging';
import Collapsible from '../../../shared/components/collapsible/collapsible';
import React, {useEffect} from 'react';
import {getContacts} from '../../../shared/services/contacts.service';
import {getDepartments, getUserList} from '../../../shared/services/lookups.service';
import {getEnumByType, getList, getLookupValues} from '../services/tickets.service';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Checkbox, {CheckboxCheckEvent} from '../../../shared/components/checkbox/checkbox';
import {selectEnumValues, selectLookupValues, selectTicketsPaging} from '../store/tickets.selectors';
import Radio, {RadioItem} from '../../../shared/components/radio/radio';
import {TicketOptionsBase} from '../models/ticket-options-base.model';
import {Controller, useForm} from 'react-hook-form';
import Button from '../../../shared/components/button/button';
import Select, {Option} from '../../../shared/components/select/select';
import {selectDepartmentList, selectUserList} from '../../../shared/store/lookups/lookups.selectors';
import {User} from '../../../shared/models/user';
import {TicketQuery} from '../models/ticket-query';
import dayjs from 'dayjs';
import {TicketEnumValue} from '../models/ticket-enum-value.model';
import utc from 'dayjs/plugin/utc';

const TicketFilter = () => {
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const anyKey = '0';
    const paging = useSelector(selectTicketsPaging);
    const departments = useSelector((state) => selectLookupValues(state, 'Department'));
    const userList = useSelector(selectUserList);
    const ticketChannels = useSelector((state => selectEnumValues(state, 'TicketChannel')));
    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const offices = useSelector(selectDepartmentList);
    useEffect(() => {
        dispatch(getContacts());
        dispatch(getDepartments());
        dispatch(getUserList());
        dispatch(getEnumByType('TicketChannel'));
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketType'));
        dispatch(getLookupValues('Department'));
    }, [dispatch]);

    const { handleSubmit, control, reset } = useForm();


    const getSelectedFromCheckbox =(items: CheckboxCheckEvent[]):  string[] => {
        if (items) {
            const isAny = items.find(a => a && parseInt(a.value) === parseInt(anyKey) && a.checked);
            if (!isAny) {
                return items.filter((a: CheckboxCheckEvent) => a.checked).map((b: CheckboxCheckEvent) => b.value);
            }
        }
        return [];
    }

    const onSubmit = (values :any) => {
        const query : TicketQuery = {
            ...paging
        };
        query.statuses = getSelectedFromCheckbox(values.statuses).map((a: string) => parseInt(a));
        query.channels = getSelectedFromCheckbox(values.channels).map((a: string) => parseInt(a));
        query.ticketTypes = getSelectedFromCheckbox(values.ticketTypes).map((a: string) => parseInt(a));
        query.locations = getSelectedFromCheckbox(values.offices);
        query.priority = values.priority;
        if (values.department) {
            query.departments = [];
            query.departments.push(values.department);
        }
        if (values.timePeriod) {
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
            query.fromDate = date.toDate();
        }
        if (values.assignedTo) {
            query.assignedTo = [];
            query.assignedTo.push(values.assignedTo);
        }
        dispatch(getList(query));
    }

    const convertOfficesToOptions = () : TicketOptionsBase[] =>{
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

    const convertDepartmentsToOptions = () : TicketOptionsBase[] =>{
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

    const convertEnumToOptions = (items: TicketEnumValue[]) : TicketOptionsBase[] =>{
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

    const convertOptionsToRadio = (items: TicketOptionsBase[]) : RadioItem[] => {
        return items.map(item => {
            return {
                value: item.key,
                label: item.value
            } as RadioItem
        })
    }

    const timePeriodList : TicketOptionsBase[] = [
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

    const addAnyOption =(list: any[]) : TicketOptionsBase[] => {
        return [{
            key: anyKey,
            value:t('common.any')
        }, ...list];
    }

    const GetCollapsibleCheckboxControl = (title:string, name:string, items : TicketOptionsBase[]) => {
        return  <Collapsible title={title}>
                    {
                        items.map((item) => {
                            return <Controller
                            control={control}
                            name={`${name}[${item.key}]`}
                            defaultValue=''
                            key = {item.key}
                            render={(props) => (
                                <Checkbox
                                    {...props}
                                    truncate={true}
                                    label={item.value}
                                    data-test-id={`${name}-checkbox-' + ${item.key}`}
                                    value={item.key}
                                    onChange={(e: CheckboxCheckEvent) => {
                                        props.onChange(e)
                                    }}
                                />
                            )}
                        />
                        })
                    }
        </Collapsible>
    }

    const GetRadioCollapsibleControl = (title: string, name: string, items : TicketOptionsBase[]) => {
        return <Collapsible title={title}>
            <Controller
            control={control}
            defaultValue=''
            name={name}
            render={(props) => (
                <Radio
                    {...props}
                    truncate
                    data-test-id={`${name}-radio`}
                    items={convertOptionsToRadio(items)}
                    onChange={(e: string) => {
                        props.onChange(e)
                    }}
                />
            )}
        />
        </Collapsible>
    }

    const userOptions: Option[] = userList ? userList.map((item: User) => {
        return {
            value: item.id,
            label: item.id
        };
    }) : [];

    return <div className='bg-secondary-100 pb-20 min-h-full px-6'>
                <div className='flex flex-row justify-between pt-7'>
                    <div className='font-medium-16 pb-8'>{t('tickets.filter.filter_tickets')}</div>
                    <div className='cursor-pointer' onClick={() => reset()}>{t('tickets.filter.clear_all')}</div>
                </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {GetCollapsibleCheckboxControl(t('tickets.filter.statuses'), 'statuses', addAnyOption(convertEnumToOptions(ticketStatuses)))}
                        {GetRadioCollapsibleControl(t('tickets.filter.time_period'), 'timePeriod', timePeriodList)}
                        {GetRadioCollapsibleControl(t('tickets.filter.priority'), 'priority', addAnyOption(convertEnumToOptions([...ticketPriorities].reverse())))}
                        {GetCollapsibleCheckboxControl(t('tickets.filter.channel'), 'channels', addAnyOption(convertEnumToOptions(ticketChannels)))}
                        {GetCollapsibleCheckboxControl(t('tickets.filter.ticket_type'), 'ticketTypes', addAnyOption(convertEnumToOptions(ticketTypes)))}
                        {GetRadioCollapsibleControl(t('tickets.filter.department'), 'department', addAnyOption(convertDepartmentsToOptions()))}
                        {GetCollapsibleCheckboxControl(t('tickets.filter.office_location'), 'offices', addAnyOption(convertOfficesToOptions()))}
                        <Collapsible title={t('tickets.filter.assigned_to')}>
                            <div>
                                <Controller
                                    name='assignedTo'
                                    control={control}
                                    defaultValue=''
                                    render={(props) => (
                                        <Select
                                            {...props}
                                            data-test-id={'assigned-to-user-list'}
                                            className={'w-full border-none h-14'}
                                            options={userOptions}
                                            value={props.value}
                                        />
                                    )}
                                />
                            </div>
                        </Collapsible>
                        <Collapsible title={t('tickets.filter.tags')}>
                            <div/>
                        </Collapsible>
                        <Button data-test-id='filter-tickets-button' type={'submit'} label={t('common.ok')} />
                    </form>
            </div>;}

export default withErrorLogging(TicketFilter);
