import { useTranslation } from 'react-i18next';
import { QueueReport } from '../models/queue-report.model';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import classnames from 'classnames';
import { getFormattedTime } from '../utils/constants';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

export interface QueueReportsTableProps {
    data: QueueReport[],
    title: string
}

const QueueReportsTable = ({data, title}: QueueReportsTableProps) => {
    const {t} = useTranslation();
    dayjs.extend(duration);

    const tableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: data,
        headerClassName: 'h-12',
        rowClass: 'h-14',
        pageable: false,
        columns: [
            {
                title: 'reports.queue_reports.column_names.queue',
                field: 'queueName',
                widthClass: 'w-4/12',
                rowClassname: 'body2',
                render: (queueName: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row subtitle2')}>
                            {queueName ? queueName : "-"}
                        </div>
                    </div>)
                }
            },
            {
                title: 'reports.queue_reports.column_names.channel',
                field: 'queueName',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: () => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {t('common.voice')}
                        </div>
                    </div>)
                }
            },
            {
                title: 'reports.queue_reports.column_names.inbound',
                field: 'totalInboundCalls',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (totalInboundCalls: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {totalInboundCalls ? totalInboundCalls : "0"}
                        </div>
                    </div>)
                }
            },
            {
                title: 'reports.queue_reports.column_names.answered',
                field: 'totalInboundCallsAnswered',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (totalInboundCallsAnswered: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {totalInboundCallsAnswered ? totalInboundCallsAnswered : "0"}
                        </div>
                    </div>)
                }
            },
            {
                title: 'reports.queue_reports.column_names.pertence_answered',
                field: 'answeredCallsPercent',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (answeredCallsPercent: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {answeredCallsPercent ? `${answeredCallsPercent}%` : "0%"}
                        </div>
                    </div>)
                }
            },
            {
                title: 'reports.queue_reports.column_names.abandoned',
                field: 'totalInboundCallsAbandoned',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (totalInboundCallsAbandoned: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {totalInboundCallsAbandoned ? totalInboundCallsAbandoned : "0"}
                        </div>
                    </div>)
                }
            },
            {
                title: 'reports.queue_reports.column_names.pertence_abandoned',
                field: 'abandonedCallsPercent',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (abandonedCallsPercent: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {abandonedCallsPercent ? `${abandonedCallsPercent}%` : "0%"}
                        </div>
                    </div>)
                }
            },
            {
                title: 'reports.queue_reports.column_names.avg_duration',
                field: 'averageCallLength',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (averageCallLength: number) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {getFormattedTime(averageCallLength, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}
                        </div>
                    </div>)
                    }
            },
            {
                title: 'reports.queue_reports.column_names.awt',
                field: 'averageInboundCallWaitTime',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (averageInboundCallWaitTime: number) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                        {getFormattedTime(averageInboundCallWaitTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}
                        </div>
                    </div>)
                    }
            },
        ],
        subColumns: [
            {
                field: 'queueName',
                widthClass: 'w-4/12',
                rowClassname: 'body2',
                render: () => {
                    return ("")
                }
            },
            {
                field: 'queueName',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: () => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {t('common.chat')}
                        </div>
                    </div>)
                }
            },
            {
                field: 'totalNumberOfIncomingChats',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (totalNumberOfIncomingChats: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {totalNumberOfIncomingChats ? totalNumberOfIncomingChats : "0"}
                        </div>
                    </div>)
                }
            },
            {
                field: 'totalNumberOfServicedChats',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (totalNumberOfServicedChats: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {totalNumberOfServicedChats ? totalNumberOfServicedChats : "0"}
                        </div>
                    </div>)
                }
            },
            {
                field: 'servicedChatsPercent',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (servicedChatsPercent: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {servicedChatsPercent ? `${servicedChatsPercent}%` : "0%"}
                        </div>
                    </div>)
                }
            },
            {
                field: 'totalIncomingChatAbandoned',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (totalIncomingChatAbandoned: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {totalIncomingChatAbandoned ? totalIncomingChatAbandoned : "0"}
                        </div>
                    </div>)
                }
            },
            {
                field: 'abandonedChatsPercent',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (abandonedChatsPercent: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {abandonedChatsPercent ? `${abandonedChatsPercent}%` : "0%"}
                        </div>
                    </div>)
                }
            },
            {
                field: 'averageChatLength',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (averageChatLength: number) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {getFormattedTime(averageChatLength, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}
                        </div>
                    </div>)
                }
            },
            {
                field: 'averageIncomingChatWaitTime',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (averageIncomingChatWaitTime: number) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {getFormattedTime(averageIncomingChatWaitTime, t('reports.agent_reports.column_postfixes.day'), t('reports.agent_reports.column_postfixes.days'))}
                        </div>
                    </div>)
                }
            },
        ]
    }
    return (
        <div className='mt-6 pt-4 bg-white rounded-lg'>
            <div className='px-6 pb-4 flex justify-between'>
                <div className='h7'>{t(title)}</div>
            </div>
            {
                data && data.length > 0 ? <Table model={tableModel} /> : <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
            }
        </div>
    );
}

export default QueueReportsTable;
