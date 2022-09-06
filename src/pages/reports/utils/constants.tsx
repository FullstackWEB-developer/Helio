import {ReportTypes} from '../models/report-types.enum'
import {ViewTypes} from '../models/view-types.enum'
import dayjs from 'dayjs';

export const viewTypes = [
    {
        label: 'reports.view_options.yesterday',
        value: ViewTypes.Yesterday.toString()
    },
    {
        label: 'reports.view_options.last_week',
        value: ViewTypes.LastWeek.toString()
    },
    {
        label: 'reports.view_options.last_7_days',
        value: ViewTypes.Last7Days.toString()
    },
    {
        label: 'reports.view_options.last_month',
        value: ViewTypes.LastMonth.toString()
    },
    {
        label: 'reports.view_options.monthly_reports',
        value: ViewTypes.MonthlyReports.toString()
    },
    {
        label: 'reports.view_options.custom_date_range',
        value: ViewTypes.CustomDates.toString()
    }
]

export const performanceChartViewTypes = [
    {
        label: 'reports.view_options.yesterday',
        value: ViewTypes.Yesterday.toString()
    },
    {
        label: 'reports.view_options.current_week',
        value: "7"
    },
    {
        label: 'reports.view_options.last_week',
        value: ViewTypes.LastWeek.toString()
    },
    {
        label: 'reports.view_options.current_month',
        value: "6"
    },
    {
        label: 'reports.view_options.last_month',
        value: ViewTypes.LastMonth.toString()
    }
];

export const reportTypes = [
    {
        label: 'reports.report_options.agent_reports',
        value: ReportTypes.AgentReports.toString()
    },
    {
        label: 'reports.report_options.bot_reports',
        value: ReportTypes.BotReports.toString()
    },
    {
        label: 'reports.report_options.system_reports',
        value: ReportTypes.SystemReports.toString()
    },
    {
        label: 'reports.report_options.queue_reports',
        value: ReportTypes.QueueReports.toString()
    }
]

const ONE_DAY_AS_SECOND = 86400;
const TWO_DAY_AS_SECOND = ONE_DAY_AS_SECOND * 2;
const TIME_FORMAT = 'HH:mm:ss'

export const getFormattedTime = (time, day, days) => {
    let innerText = "-";
    if (time) {
        let duration = dayjs.duration(time, 'seconds');
        if (time < ONE_DAY_AS_SECOND) {
            innerText = duration.format(TIME_FORMAT);
        } else if (time >= ONE_DAY_AS_SECOND && time < TWO_DAY_AS_SECOND) {
            innerText = `${duration.format('D')} ${day} ${duration.format(TIME_FORMAT)}`
        } else {
            innerText = `${duration.format('D')} ${days} ${duration.format(TIME_FORMAT)}`
        }
    }
    return innerText;
}
