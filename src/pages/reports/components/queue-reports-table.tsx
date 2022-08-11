import { useTranslation } from 'react-i18next';
import { QueueReport } from '../models/queue-report.model';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import classnames from 'classnames';

var dayjs = require("dayjs")
var duration = require('dayjs/plugin/duration')

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
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
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
                render: (averageCallLength: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {averageCallLength ? `${dayjs.duration(averageCallLength, 'seconds').format('HH:mm:ss')}` : "-"}
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
                            {averageInboundCallWaitTime ? `${dayjs.duration(averageInboundCallWaitTime, 'seconds').format('HH:mm:ss')}` : "-"}
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
                render: (averageChatLength: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {averageChatLength ? `${dayjs.duration(averageChatLength, 'seconds').format('HH:mm:ss')}` : "-"}
                        </div>
                    </div>)
                }
            },
            {
                field: 'averageIncomingChatWaitTime',
                widthClass: 'w-1/12',
                rowClassname: 'body2',
                render: (averageIncomingChatWaitTime: string) => {
                    return (<div className='flex items-center h-full'>
                        <div className={classnames('overflow-hidden overflow-ellipsis ellipsis-row body2')}>
                            {averageIncomingChatWaitTime ? `${dayjs.duration(averageIncomingChatWaitTime, 'seconds').format('HH:mm:ss')}` : "-"}
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
                data.length > 0 ? <Table model={tableModel} /> : <div className='w-full h-72 px-6 space-y-4 horizantal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
            }
        </div>
    );
}

export default QueueReportsTable;
