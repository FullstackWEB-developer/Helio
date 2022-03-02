import SvgIcon, {Icon} from '@components/svg-icon';
import Collapsible from '@components/collapsible';
import {Controller, useForm} from 'react-hook-form';
import Radio from '@components/radio/radio';
import {Option} from '@components/option/option';
import ControlledSelect from '@components/controllers/controlled-select';
import {useEffect, useState} from 'react';
import {getUserList} from '@shared/services/lookups.service';
import {selectUserOptions} from '@shared/store/lookups/lookups.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import classNames from 'classnames';
import {EmailFilterModel} from '@pages/email/components/email-filter/email-filter.model';
import {
    TimePeriodDateRange,
    TimePeriodLast30Days,
    TimePeriodLast7Days,
    TimePeriodOptions,
    TimePeriodToday
} from '@shared/models/email-sms-time-period-options';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {setEmailHasFilter} from '@pages/email/store/email-slice';
import { DEFAULT_FILTER_VALUE } from '@pages/email/constants';

interface EmailFilterProps {
    className?: string;
    value?: EmailFilterModel;
    onCloseClick?: () => void;
    onFilterClick?: (param: EmailFilterModel) => void;
    isUserFilterEnabled?: boolean;
}
const EmailFilter = ({className, isUserFilterEnabled, value, ...props}: EmailFilterProps) => {

    dayjs.extend(utc);
    const dispatch = useDispatch();
    const [displayFilters, setDisplayFilters] = useState<boolean>(true);
    const isDefaultTeamView = useCheckPermission('Email.DefaultToTeamView');
    const {id} = useSelector(selectAppUserDetails);
    const {t} = useTranslation();
    const userList = useSelector(selectUserOptions);
    const [fromDateField, setFromDateField] = useState<Date | undefined>(value?.fromDate ? dayjs(value.fromDate).utc().toDate() : undefined);
    const {control, handleSubmit, watch, setValue, reset} = useForm<EmailFilterModel>();
    const watchTimePeriod = watch('timePeriod');

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    useEffect(() => {
        if (value) {
            setValue('timePeriod', value.timePeriod);
            if (value.timePeriod === TimePeriodDateRange) {
                if (value.fromDate) {
                    setValue('fromDate', value.fromDate);
                }
                if (value.toDate) {
                    setValue('toDate', value.toDate);
                }
            }
            setValue('assignedTo', value.assignedTo);
        }

    }, [setValue, value]);



    const getUserOptions = (): Option[] => {
        const cloned = [...userList];
        cloned.unshift({
            label: t('common.all'),
            value: ''
        });
        return cloned;
    }

    const getFormDate = (formData: any): {fromDate?: Date, toDate?: Date} => {
        let fromDate: Date | undefined;
        let toDate: Date | undefined;

        if (formData.timePeriod) {
            if (formData.timePeriod === TimePeriodDateRange) {
                if (formData.fromDate) {
                    fromDate = formData.fromDate;
                }

                if (formData.toDate) {
                    toDate = formData.toDate;
                }
            } else {
                let date = dayjs().utc();
                switch (formData.timePeriod) {
                    case TimePeriodToday:
                        date = date.startOf('day');
                        break;
                    case TimePeriodLast7Days:
                        date = date.subtract(7, 'day');
                        break;
                    case TimePeriodLast30Days:
                        date = date.subtract(30, 'day').startOf('day');
                        break;
                }
                fromDate = date.toDate();
            }

            if (formData.timePeriod !== TimePeriodLast7Days) {
                dispatch(setEmailHasFilter(true));
            }
        }
        return {fromDate: fromDate, toDate: toDate};
    }

    const onFilterClick = (formData: any) => {
        const filter: EmailFilterModel = {
            timePeriod: formData.timePeriod
        };

        if (!!formData.assignedTo && isUserFilterEnabled) {
            dispatch(setEmailHasFilter(true));
            filter.assignedTo = formData.assignedTo;
        } else if (!isUserFilterEnabled) {
            filter.assignedTo = value?.assignedTo;
        }

        const formDate = getFormDate(formData)
        filter.fromDate = formDate.fromDate;
        filter.toDate = formDate.toDate;

        if (props.onFilterClick) {
            props.onFilterClick(filter);
        }
    }

    const onClearFilter = () => {
        const defaults = {
            timePeriod: DEFAULT_FILTER_VALUE.timePeriod,
            assignedTo: isDefaultTeamView ? '': id
        }
        reset(defaults);
        dispatch(setEmailHasFilter(false));
        setDisplayFilters(false);
        setTimeout(() => {
            setDisplayFilters(true);
        }, 0)
        onFilterClick(defaults);
    }

    if (!displayFilters) {
        return null;
    }

    return (<div className={className}>
        <div className='flex justify-between py-4 border-b flew-row'>
            <div className="pl-5 subtitle">{t("common.filters")}</div>
            <div className="flex flex-row items-center justify-between">
                <div className='cursor-pointer body2-primary' onClick={() => handleSubmit(onFilterClick)()}>{t('common.apply')}</div>
                <div className='pl-5 cursor-pointer body2' onClick={onClearFilter} >{t('common.clear_all')}</div>
                <div>
                    <SvgIcon
                        type={Icon.Close}
                        onClick={props.onCloseClick}
                        className='icon-small'
                        wrapperClassName='pl-7 pr-4 cursor-pointer'
                    />
                </div>
            </div>
        </div>
        <div className="flex flex-col pt-4 pl-5 pr-4">
            <Collapsible title={t('email.filter.time_section')} isOpen headerClassName='h-10 mb-1.5'>
                <Controller
                    control={control}
                    name='timePeriod'
                    defaultValue=''
                    render={(radioProps) => {
                        return (<Radio
                                name='timePeriod'
                                truncate={true}
                                ref={radioProps.ref}
                                data-test-id='timePeriod-radio'
                                value={radioProps.value}
                                items={TimePeriodOptions}
                                onChange={radioProps.onChange}
                            />
                        )
                    }}
                />
                <div className={classNames({'hidden': watchTimePeriod !== TimePeriodDateRange})}>
                    <ControlledDateInput
                        control={control}
                        type='date'
                        label='tickets.filter.from_date'
                        name='fromDate'
                        defaultValue={null}
                        max={new Date(new Date().toDateString())}
                        min={dayjs().subtract(6, 'month').toDate()}
                        dataTestId='ticket-filter-from-date'
                        isCalendarPositionComputed
                        onChange={setFromDateField}
                    />
                    <ControlledDateInput
                        control={control}
                        type='date'
                        isCalendarPositionComputed
                        defaultValue={null}
                        min={fromDateField}
                        max={new Date(new Date().toDateString())}
                        disabled={!fromDateField}
                        label='tickets.filter.to_date'
                        name='toDate'
                        dataTestId='ticket-filter-to-date'
                    />
                </div>
            </Collapsible>
            {isUserFilterEnabled &&
                <Collapsible title={t('email.filter.team_section')} isOpen className='pt-4' headerClassName='h-10 mb-1.5'>
                    <ControlledSelect
                        control={control}
                        name='assignedTo'
                        defaultValue=''
                        options={getUserOptions()}
                    />
                </Collapsible>
            }
        </div>
    </div>);
}

export default EmailFilter;
