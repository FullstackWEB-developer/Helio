import { ReportTypes } from '../models/report-types.enum'
import { ViewTypes } from '../models/view-types.enum'

export const viewTypes = [
    {
        label: 'reports.view_options.yesterday',
        value: ViewTypes.Yesterday
    },
    {
        label: 'reports.view_options.last_7_days',
        value: ViewTypes.Last7Days
    },
    {
        label: 'reports.view_options.last_week',
        value: ViewTypes.LastWeek
    },
    {
        label: 'reports.view_options.last_month',
        value: ViewTypes.LastMonth
    },
    {
        label: 'reports.view_options.monthly_reports',
        value: ViewTypes.MonthlyReports
    }
]

export const reportTypes = [
    {
        label: 'reports.report_options.agent_reports',
        value: ReportTypes.AgentReports
    },
    {
        label: 'reports.report_options.bot_reports',
        value: ReportTypes.BotReports
    },
    {
        label: 'reports.report_options.system_reports',
        value: ReportTypes.SystemReports
    },
    {
        label: 'reports.report_options.queue_reports',
        value: ReportTypes.QueueReports
    }
]
