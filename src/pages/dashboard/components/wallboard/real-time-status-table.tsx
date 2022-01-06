import {useQuery} from 'react-query';
import {QueueMetric} from '@shared/models/queue-metric.model';
import {QueryQueueMetrics} from '@constants/react-query-constants';
import Tab from '@components/tab/Tab';
import Tabs from '@components/tab/Tabs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {QueueRealtimeStatus} from '@pages/dashboard/models/queue-realtime-status.model';
import {TableModel} from '@components/table/table.models';
import Table from '@components/table/table';
import Card from '@components/card/card';
import dayjs from 'dayjs';
import {MetricGrouping} from '@shared/models/metric-grouping.enum';
import utils from '@shared/utils/utils';
import {getQueueStatus} from '@pages/tickets/services/tickets.service';

export interface RealTimeStatusTableProps {
    lastUpdateTime: Date;
}
const RealTimeStatusTable = ({lastUpdateTime}:RealTimeStatusTableProps) => {
    enum MetricType {
        All,
        Voice,
        Chat
    }

    const {t} = useTranslation();
    const [selectedMetricType, setSelectedMetricType] = useState(MetricType.Chat);
    const {data, refetch, isFetching} = useQuery<QueueMetric[], Error>([QueryQueueMetrics, selectedMetricType], () => getQueueStatus(
        {
            grouping: selectedMetricType === MetricType.All ? MetricGrouping.Summary : MetricGrouping.ChannelAndQueue
        }
    ));

    useEffect(() => {
        refetch().then();
    }, [lastUpdateTime]);

    const selectedMetricTypeChanged =(type: MetricType) => {
        setSelectedMetricType(type);
        if (type !== selectedMetricType) {
            refetch().then();
        }
    }

    const getDataByMetricName = (data: QueueMetric[], metricName: string) => {
        const metric = data.find(a => a.metric === metricName);
        if (!metric) {
            return 0;
        }
        switch (selectedMetricType) {
            case MetricType.Chat:
                return metric.chatCount;
                case MetricType.Voice:
                return metric.voiceCount;
                case MetricType.All:
                return metric.channelSummaryCount;
        }
    }

    const getTransformedData = () : QueueRealtimeStatus[] => {
        if (!data) {
            return [];
        }
        const groupedData = utils.groupBy(data, a => a.queueName);
        const result : QueueRealtimeStatus[] = [];
        groupedData.forEach((data, key) => {
            const item: QueueRealtimeStatus = {
                queueName: key,
                agentsAvailable: getDataByMetricName(data, "AGENTS_AVAILABLE"),
                acw: getDataByMetricName(data, "AGENTS_AFTER_CONTACT_WORK"),
                awt: getDataByMetricName(data, "AGENTS_AFTER_CONTACT_WORK").toString(),
                lwt: getDataByMetricName(data, "OLDEST_CONTACT_AGE").toString(),
                agentsOnline: getDataByMetricName(data, "AGENTS_ONLINE"),
                inQueue: getDataByMetricName(data, "CONTACTS_IN_QUEUE"),
                npt: getDataByMetricName(data, "AGENTS_NON_PRODUCTIVE"),
                onContact: getDataByMetricName(data, "AGENTS_ON_CONTACT")
            };
            result.push(item);
        });
        return result.sort((a,b) => (a.queueName > b.queueName) ? 1 : ((b.queueName > a.queueName) ? -1 : 0));
    }

    const formatTime = (time: string) => {
        return <div className='flex justify-center body2'>{dayjs.duration(parseInt(time), 'seconds').format('HH:mm:ss')}</div>;
    }

    const tableModel: TableModel = {
        columns: [
            {
                title:t('wallboard.realtime_status.queue'),
                field:'queueName',
                widthClass:'w-1/6 pl-2'
            }, {
                title:t('wallboard.realtime_status.on_contact'),
                field:'onContact',
                widthClass:'w-1/12',
                alignment:'center'
            }, {
                title:t('wallboard.realtime_status.in_queue'),
                field:'inQueue',
                widthClass:'w-1/12',
                alignment:'center'
            }, {
                title:t('wallboard.realtime_status.lwt'),
                field:'lwt',
                widthClass:'w-1/6',
                alignment:'center',
                render:(field, record: QueueRealtimeStatus) => formatTime(record.lwt)
            }, {
                title:t('wallboard.realtime_status.awt'),
                field:'awt',
                widthClass:'w-1/6',
                alignment:'center',
                render:(field, record: QueueRealtimeStatus) => formatTime(record.awt)
            }, {
                title:t('wallboard.realtime_status.agents_online'),
                field:'agentsOnline',
                widthClass:'w-1/12',
                alignment:'center'
            }, {
                title:t('wallboard.realtime_status.agents_available'),
                field:'agentsAvailable',
                widthClass:'w-1/12',
                alignment:'center'
            }, {
                title:t('wallboard.realtime_status.npt'),
                field:'npt',
                widthClass:'w-1/12',
                alignment:'center'
            }, {
                title:t('wallboard.realtime_status.acw'),
                field:'acw',
                widthClass:'w-1/12',
                alignment:'center'
            }
        ],
        rows: getTransformedData(),
        hasRowsBottomBorder: true,
        headerClassName:'h-12',
    }

    return <div>

        <Card>
            <Tabs asCard titleClass='pl-6'  onSelect={(index)=> selectedMetricTypeChanged(index)} title={t('wallboard.realtime_status.title')}>
                <Tab title={t('wallboard.realtime_status.all_channels_tab_title')}>
                    <Table model={tableModel} />
                    <div className='bg-white h-8'/>
                </Tab>
                <Tab title={t('wallboard.realtime_status.call_tab_title')}>
                    <Table model={tableModel} />
                    <div className='bg-white h-8'/>
                </Tab>
                    <Tab title={t('wallboard.realtime_status.chats_tab_title')}>
                        <Table model={tableModel} />
                        <div className='bg-white h-8'/>
                    </Tab>
            </Tabs>
        </Card>
        {isFetching}
    </div>
}

export default RealTimeStatusTable;
