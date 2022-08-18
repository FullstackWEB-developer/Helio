import { AgentReport } from '../models/agent-report.model';
import { TableModel } from '@components/table/table.models';
import classnames from 'classnames';
import TableAgentInfo from '../components/table-agent-info';
import { SortDirection } from '@shared/models/sort-direction';
import { useTranslation } from 'react-i18next';
import { AgentReportTableType } from '@shared/models/agent-report-table-type.enum';
import { getFormattedTime } from './constants';
var dayjs = require("dayjs")
var duration = require('dayjs/plugin/duration')

export interface AgentReportsTableProps {
    data: AgentReport[],
    type: AgentReportTableType,
    onSort: (sortField: string | undefined, sortDirection: SortDirection) => void
}

export function useAgentReportsTableModel({data, type, onSort}: AgentReportsTableProps){
    const {t} = useTranslation();
    dayjs.extend(duration);

    let defaultTableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: data,
        headerClassName: 'px-6 h-12 gap-8',
        rowClass: 'px-6 h-14 gap-8',
        pageable: false,
        allowMultiSort: false,
        columns: []
    }

    const getMutatedModel = (columns: any[]) => {
        defaultTableModel.columns = columns;
        return defaultTableModel;
    }

    const voiceAndChatModelColumns = [
        {
            title: 'reports.agent_reports.column_names.agent_name',
            field: 'userFullName',
            widthClass: 'w-5/24',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (userFullName: string, row: AgentReport) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        <TableAgentInfo agentId={row.userId}/>
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.total_calls_and_chats',
            field: 'totalCalls',
            widthClass: 'w-3/24',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (totalCalls: string, row: AgentReport) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {totalCalls || row.totalChats ? (totalCalls + row.totalChats) : "0"}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.utilization',
            field: 'utilizationPercent',
            widthClass: 'w-3/24',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (utilizationPercent: string) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {utilizationPercent ? `${utilizationPercent}%` : "0%"}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.avg_idle_time',
            field: 'averageIdleTime',
            widthClass: 'w-3/24',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (averageIdleTime: number) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {getFormattedTime(averageIdleTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.answer_rate',
            field: 'answerRate',
            widthClass: 'w-3/24',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (answerRate: string) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {answerRate ? `${answerRate}%` : "0%"}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.missed_contact',
            field: 'missedContacts',
            widthClass: 'w-3/24',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (missedContacts: string) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {missedContacts ? missedContacts : "0"}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.acwt',
            field: 'avgAfterContactWorkTime',
            widthClass: 'w-3/24',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (avgAfterContactWorkTime: number) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {getFormattedTime(avgAfterContactWorkTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}
                    </div>
                </div>)
            }
        },
        
    ]

    switch(type) {
        case AgentReportTableType.VoiceAndChat:
            return getMutatedModel(voiceAndChatModelColumns);
        default:
            return getMutatedModel([]);
    }
}
