import {Option} from '@components/option/option';

export const TimePeriodToday = '0';
export const TimePeriodLast7Days = '1';
export const TimePeriodLast30Days = '2';
export const TimePeriodDateRange = '3';
export const TimePeriodOptions: Option[] =
    [
        {value: TimePeriodToday, label: 'common.time_periods.today'},
        {value: TimePeriodLast7Days, label: 'common.time_periods.last_7_days'},
        {value: TimePeriodLast30Days, label: 'common.time_periods.last_30_days'},
        {value: TimePeriodDateRange, label: 'common.time_periods.date_range'},
    ]

export const GetTimePeriodLabel = (value: string) => {
    return TimePeriodOptions.find(a => a.value === value)?.label || '';
}
