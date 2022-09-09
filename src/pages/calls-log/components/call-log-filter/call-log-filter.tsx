import classnames from 'classnames';
import { useMemo, useState, useEffect, useCallback, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Collapsible from '@components/collapsible/collapsible';
import { ContactStatus } from '@pages/calls-log/models/call-log.model';
import { ControlledCheckbox, ControlledDateInput, ControlledSelect } from '@components/controllers';
import { Option } from '@components/option/option';
import Radio from '@components/radio/radio';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { selectLookupValues } from '@pages/tickets/store/tickets.selectors';
import utils from '@shared/utils/utils';
import { TicketLogRequestModel } from '@shared/models/ticket-log.model';
import { CommunicationDirection } from '@shared/models';
import { setIsCallsLogFiltered } from '@pages/calls-log/store/calls-log.slice';
import { setIsChatLogFiltered } from '@pages/chat-log/store/chat-log.slice';
import { getLookupValues } from '@shared/services/lookups.service';
import Button from '@components/button/button';
import { CallsLogContext } from '@pages/calls-log/context/calls-log-context';
import {DEFAULT_PAGING} from '@shared/constants/table-constants';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import CheckboxList from '@components/checkbox-list/checkbox-list';
const TIME_PERIOD_DATE_RANGE_OPTION = '3';
const ALL_KEY = 0;
const DEFAULT_ALL_OPTION = { key: 'all', value: ALL_KEY };
const DEFAULT_ANY_KEY = '';

interface CallsLogFilterProps {
    value?: any;
    isOpen: boolean;
    logType: 'Chat' | 'Call';
    isCallTypeHide?: boolean;
    onSubmit?: (filter: TicketLogRequestModel) => void;
}
const CallsLogFilter = ({ isOpen, value: propsValue, logType, ...props }: CallsLogFilterProps) => {
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const { control, handleSubmit, watch, getValues, reset } = useForm({});
    const [fromDateField, setFromDateField] = useState<Date | undefined>(propsValue?.fromDate ? dayjs(propsValue.fromDate).utc().toDate() : undefined);
    const { t } = useTranslation();
    const [collapsibleState, setCollapsibleState] = useState<{ [key: string]: boolean }>({});
    const watchTimePeriod = watch('timePeriod');
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const isDefaultTeam = useCheckPermission('Calls.DefaultToTeamView');
    const appUser = useSelector(selectAppUserDetails);
    const {setSearchTerm, setCallsLogFilter} = useContext(CallsLogContext)!;
    const addAnyOption = useCallback((list: any[]): Option[] => [
        {
            value: DEFAULT_ANY_KEY,
            label: t('common.any')
        },
        ...list
    ], [t]);

    const reasonOptions = useMemo(() =>
        addAnyOption(
            utils.parseOptions(ticketLookupValuesReason,
                (item) => item.label,
                (item) => item.value
            )
        ), [addAnyOption, ticketLookupValuesReason]);

    const getClassNames = useMemo(() => classnames({
        'transition-width transition-slowest ease top-0 bg-secondary-100 overflow-y-auto': isOpen,
        'hidden': !isOpen
    }), [isOpen]);

    const enumToArray = <T extends any>(enumValue: { [s: string]: T }, exludes: number[] = []) => Object.entries(enumValue)
        .filter(([_, value]) => !isNaN(Number(value)) && !exludes.includes(Number(value)))
        .map(([key, value]) => {
            const underscoredKey = utils.spaceBetweenCamelCaseWords(key).toLowerCase().replaceAll(' ', '_');
            return { key, value, underscoredKey }
        });

    const contactStatusItem = useMemo(() => {
        let options = [...enumToArray(ContactStatus, logType === 'Chat' ? [2, 3, 4, 5, 6, 7] : [])];
        if(logType === 'Chat'){
            options.push({key: t('ticket_log.handled_by_bot'), value: "5", underscoredKey: 'handled_by_bot'})
        }
        return options;
    }, [logType]);

    const callLogDirectionItem = useMemo(() => [...enumToArray(CommunicationDirection, [3])], []);

    const getTimePeriodOptions = (): Option[] => (
        [
            { value: '0', label: 'common.time_periods.today' },
            { value: '1', label: 'common.time_periods.last_7_days' },
            { value: '2', label: 'common.time_periods.last_30_days' },
            { value: '3', label: 'common.time_periods.date_range' },
        ]
    )

    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
    }, [dispatch])


    const getFormDate = (formData: any): { fromDate?: Date, toDate?: Date } => {
        let fromDate: Date | undefined;
        let toDate: Date | undefined;

        if (formData.timePeriod) {
            if (formData.timePeriod === TIME_PERIOD_DATE_RANGE_OPTION) {
                if (formData.fromDate) {
                    fromDate = formData.fromDate;
                }

                if (formData.toDate) {
                    toDate = formData.toDate;
                }
            } else {
                let date = dayjs();
                switch (formData.timePeriod) {
                    case '0':
                        date = date.startOf('day');
                        break;
                    case '1':
                        date = date.subtract(7, 'day');
                        break;
                    case '2':
                        date = date.subtract(30, 'day').startOf('day');
                        break;
                }
                fromDate = date.toDate();
            }
        }
        return { fromDate: fromDate, toDate: toDate };
    }

    const resetForm = () => {
        const fieldsValue = getValues();
        const clearCheckboxValue = (values: any) => {
            const cloned = { ...values };
            Object.keys(cloned)
                .filter(p => !!cloned[p])
                .forEach(p => {
                    cloned[p].checked = false;
                });
            return cloned;
        }
        const defaults = {
            status: clearCheckboxValue(fieldsValue.status),
            callType: clearCheckboxValue(fieldsValue.callType),
            reason: '',
            fromDate: undefined,
            toDate: undefined,
            timePeriod: '',
            searchTerm: ''
        }
        reset(defaults);
        onSubmit(defaults);
        setSearchTerm("");
        setCallsLogFilter({
            ...DEFAULT_PAGING,
            assignedTo: !isDefaultTeam ? appUser?.id : '',
            sorts: ['createdOn Desc']
        });
    }

    const onSubmit = (formData: any) => {
        const filter: TicketLogRequestModel = {};

        const formDate = getFormDate(formData);
        if (formDate.fromDate) {
            filter.fromDate = utils.toShortISOLocalString(formDate.fromDate);
        } else {
            filter.fromDate = undefined;
        }

        if (formDate.toDate) {
            filter.toDate = utils.toShortISOLocalString(formDate.toDate);
        } else {
            filter.toDate = undefined;
        }
        filter.reason = formData.reason;

        if (formData.status) {
            const statuses: number[] = [];
            Object.keys(formData.status)
                .map(p => formData.status[p])
                .filter(status => !!status?.value)
                .forEach(status => {
                    if (status && status.checked) {
                        statuses.push(Number(status.value));
                    }
                });
            if (statuses.map(a => a.toString()).includes(ALL_KEY.toString())) {
                filter.contactStatus = [];
            } else {
                filter.contactStatus = statuses;
            }
        }

        if (formData.callType) {
            const callTypes: number[] = [];
            Object.keys(formData.callType)
                .map(p => formData.callType[p])
                .filter(callType => !!callType?.value)
                .forEach(callType => {
                    if (callType && callType.checked) {
                        callTypes.push(callType.value);
                    }
                });
            if (callTypes.map(a => a.toString()).includes(ALL_KEY.toString())) {
                filter.communicationDirections = [];
            } else {
                filter.communicationDirections = callTypes;
            }

        }

        if (logType === 'Call') {
            if (filter.fromDate || filter.toDate || filter.reason || filter.communicationDirections?.length || filter.contactStatus?.length) {
                dispatch(setIsCallsLogFiltered(true));
            } else {
                dispatch(setIsCallsLogFiltered(false));
            }
        } else if (logType === 'Chat') {
            if (filter.fromDate || filter.toDate || filter.reason || filter.communicationDirections?.length || filter.contactStatus?.length) {
                dispatch(setIsChatLogFiltered(true));
            } else {
                dispatch(setIsChatLogFiltered(false));
            }
        }

        props.onSubmit?.(filter);
    };

    const GetCollapsibleCheckboxControl = (title: string, name: string, items: { key: string; value: any, underscoredKey?: string }[]) => {
        return <Collapsible
            title={title}
            isOpen={collapsibleState[name]}
            onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, [name]: isCollapsed })}>
            <CheckboxList items={items} name={name} control={control} label={(key) => {return (t(`ticket_log.${items.filter(x => x.key === key)[0].underscoredKey ?? items.filter(x => x.key === key)[0].key.toLocaleLowerCase()}`))}}/>
        </Collapsible>
    }

    const GetCollapsibleReason = (title: string, name: string, items: Option[]) => {
        return <Collapsible
            title={title}
            isOpen={collapsibleState[name]}
            onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, [name]: isCollapsed })}>
            <ControlledSelect
                name={name}
                label='ticket_new.reason'
                options={items}
                control={control}
            />
        </Collapsible>
    }

    const GetCollapsibleDateTime = (title: string, name: string) => (
        <Collapsible title={title}
            isOpen={collapsibleState[name]}
            onClick={(isCollapsed) => setCollapsibleState({ ...collapsibleState, [name]: isCollapsed })}
            headerClassName='h-10 mb-1.5'>
            <Controller
                control={control}
                name={name}
                defaultValue=''
                render={(radioProps) => {
                    return (<Radio
                        name={name}
                        truncate={true}
                        ref={radioProps.ref}
                        data-test-id='timePeriod-radio'
                        value={radioProps.value}
                        items={getTimePeriodOptions()}
                        onChange={radioProps.onChange}
                    />
                    )
                }}
            />
            {watchTimePeriod === TIME_PERIOD_DATE_RANGE_OPTION &&
                <div>
                    <ControlledDateInput
                        control={control}
                        type='date'
                        label='tickets.filter.from_date'
                        name='fromDate'
                        max={new Date(new Date().toDateString())}
                        min={dayjs().subtract(6, 'month').toDate()}
                        dataTestId='filter-from-date'
                        isCalendarPositionComputed
                        onChange={setFromDateField}
                        isSmallSize={true}
                    />
                    <ControlledDateInput
                        control={control}
                        type='date'
                        max={new Date(new Date().toDateString())}
                        isCalendarPositionComputed
                        min={fromDateField}
                        disabled={!fromDateField}
                        label='tickets.filter.to_date'
                        name='toDate'
                        dataTestId='filter-to-date'
                        isSmallSize={true}
                    />
                </div>
            }
        </Collapsible>
    )

    return (
        <div className={getClassNames}>
            <div className='min-h-full px-6 pb-20 bg-secondary-100 pt-4'>
                <div className='py-4 subtitle'>{t('common.filters')}</div>
                <div className='flex flex-row pb-3'>
                    <Button data-test-id='apply-button' className='cursor-pointer mr-4' label='common.apply' buttonType='small' onClick={() => handleSubmit(onSubmit)()} ></Button>
                    <Button data-test-id='reset-all-button' className='cursor-pointer' label='common.reset_all' buttonType='secondary' onClick={() => resetForm()}></Button>
                </div>
                <form>
                    {GetCollapsibleCheckboxControl('common.statuses', 'status', contactStatusItem)}
                    {logType === 'Call' && GetCollapsibleCheckboxControl('ticket_log.call_type', 'callType', callLogDirectionItem)}
                    {GetCollapsibleDateTime('common.time_period', 'timePeriod')}
                    {GetCollapsibleReason('ticket_new.reason', 'reason', reasonOptions)}
                </form>
            </div>
        </div>
    )

}

export default CallsLogFilter;
