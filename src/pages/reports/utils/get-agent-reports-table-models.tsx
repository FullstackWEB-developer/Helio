import {AgentReport} from '../models/agent-report.model';
import {TableModel} from '@components/table/table.models';
import classnames from 'classnames';
import TableAgentInfo from '../components/table-agent-info';
import {SortDirection} from '@shared/models/sort-direction';
import {useTranslation} from 'react-i18next';
import {AgentReportTableType} from '@shared/models/agent-report-table-type.enum';
import {getFormattedTime} from './constants';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import SvgIcon, {Icon} from '@components/svg-icon';
import {TicketRate} from '../models/ticket-rate.enum';

export interface AgentReportsTableProps {
    data: AgentReport[],
    type: AgentReportTableType,
    onSort: (sortField: string | undefined, sortDirection: SortDirection) => void
}

export function useAgentReportsTableModel({data, type, onSort}: AgentReportsTableProps) {
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

    const displayPatientRating = (ratio: number) => {
        if(ratio === 0){
            return <SvgIcon
                    className='icon-medium'
                    fillClass='rating-widget-neutral'
                    wrapperClassName='cursor-pointer'
                    type={Icon.RatingSatisfied} />;
        }else if(ratio > 0 && ratio < 40){
            return <SvgIcon
                    className='icon-medium'
                    fillClass='rating-widget-unsatisfied'
                    wrapperClassName='cursor-pointer'
                    type={Icon.RatingDissatisfied} />;
        }else if(ratio >= 40 && ratio < 60){
            return <SvgIcon
                    className='icon-medium'
                    fillClass='rating-widget-neutral'
                    wrapperClassName='cursor-pointer'
                    type={Icon.RatingSatisfied} />;
        }else{
            return <SvgIcon
                    className='icon-medium'
                    fillClass='rating-widget-satisfied'
                    wrapperClassName='cursor-pointer'
                    type={Icon.RatingVerySatisfied} />;
        }
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
                        <TableAgentInfo agentId={row.userId} />
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

    ];

    const chatModelColumns = [
        {
            title: 'reports.agent_reports.column_names.agent_name',
            field: 'userId',
            widthClass: 'w-1/5',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (userId: string) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        <TableAgentInfo agentId={userId} />
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.total_chats',
            field: 'totalChats',
            widthClass: 'w-1/5',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (totalChats: string) => {
                return (<div className='flex items-center h-full'>
                    <div data-testid='agent-rpt-total-chats' className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {totalChats ?? "0"}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.average_chat_handle_time',
            field: 'avgChatHandleTime',
            widthClass: 'w-1/5',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (avgChatHandleTime: string) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {avgChatHandleTime ? getFormattedTime(avgChatHandleTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days')) : "0"}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.average_chat_duration',
            field: 'avgChatDuration',
            widthClass: 'w-1/5',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (avgChatDuration: string) => {
                return (<div className='flex items-center h-full'>
                    <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {avgChatDuration ? getFormattedTime(avgChatDuration, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days')) : "0"}
                    </div>
                </div>)
            }
        },
        {
            title: 'reports.agent_reports.column_names.rating',
            field: 'chatRatingCount',
            widthClass: 'w-1/5',
            rowClassname: 'body2',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (_, row: AgentReport) => {
                if(!row.chatRatingCount) return null;
                return (<span className='h-full flex items-center'>
                    {
                        displayPatientRating(row.chatRatingCount)
                    }
                    <span data-testid="average-chat-rating-percentage" className='px-5'>{`${row.avgChatRating}%`}</span>
                    <span>{row.chatRatingCount}</span>
                </span>)
            }
        }  
    ];

    switch (type) {
        case AgentReportTableType.VoiceAndChat:
            return getMutatedModel(voiceAndChatModelColumns);
        case AgentReportTableType.Chat:
            return getMutatedModel(chatModelColumns);
        default:
            return getMutatedModel([]);
    }
}
