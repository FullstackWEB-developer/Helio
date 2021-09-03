import {useQuery} from 'react-query';
import {QueueMetric} from '@shared/models/queue-metric.model';
import { QueryQueueMetrics} from '@constants/react-query-constants';
import {getQueueStatus} from '@shared/services/lookups.service';
import {MetricGrouping} from '@shared/models/metric-grouping.enum';
import SvgIcon, {Icon} from '@components/svg-icon';
import Card from '@components/card/card';
import {useTranslation} from 'react-i18next';
import './realtime-status-summary.scss';
import WallboardBasicStatistic from '@pages/dashboard/components/wallboard/wallboard-basic-statistic';
import React, {useEffect, useState} from 'react';
import {RealTimeStatusSummaryData} from '@pages/dashboard/models/real-time-status-summary-data.model';
import utils from '@shared/utils/utils';
import classnames from 'classnames';
import dayjs from 'dayjs';

export interface RealtimeStatusSummaryProps {
    lastUpdateTime: Date;
}

const RealtimeStatusSummary = ({lastUpdateTime}: RealtimeStatusSummaryProps) => {

    const {t} = useTranslation();
    const [callStatistics, setCallStatistics] = useState<RealTimeStatusSummaryData>();
    const [chatStatistics, setChatStatistics] = useState<RealTimeStatusSummaryData>();

    const {isLoading, refetch, isFetching} = useQuery<QueueMetric[], Error>([QueryQueueMetrics], () => getQueueStatus({
        grouping: MetricGrouping.Channel
    }), {
        enabled: false,
        onSuccess: (data: QueueMetric[]) => {
            setChatStatistics(CalculateSummaryData(data, 'CHAT'));
            setCallStatistics(CalculateSummaryData(data, 'VOICE'));
        }
    });

    useEffect(() => {
        refetch().then();
    }, [lastUpdateTime, refetch]);

    const CalculateSummaryData = (data: QueueMetric[], type: string) => {
        const groupedByChannel = utils.groupBy(data, a => a.channel);
        return {
            available: getMetricCount(groupedByChannel, "SLOTS_AVAILABLE", type),
            unAvailable: getMetricCount(groupedByChannel, "AGENTS_NON_PRODUCTIVE", type),
            lwt: getMetricCount(groupedByChannel, "OLDEST_CONTACT_AGE", type),
            onContact: getMetricCount(groupedByChannel, "AGENTS_ON_CONTACT", type),
            inQueue: getMetricCount(groupedByChannel, "CONTACTS_IN_QUEUE", type),
        };
    }

    const getMetricCount = (data: Map<string, QueueMetric[]>, metricName: string, type: string) : number => {
        if (!data) {
            return 0;
        }
        const metricInfo = data.get(type);
        if (metricInfo) {
            return metricInfo.filter(a => a.metric === metricName).reduce((a, b) => +a + +b.channelSummaryCount, 0);
        }
        return 0;
    }
    const mainWrapperClassName =classnames({
        'opacity-40' : isFetching || isLoading
    });

    const formatTime = (time: number) => {
        return dayjs.duration(time, 'seconds').format('mm:ss');
    }

    return <div className={mainWrapperClassName}>
        <Card title={t('wallboard.realtime_status_summary.title')}>
                <div className='flex flex-col'>
                    <div className='flex flex-col md:flex-row border-t'>
                        <div className='flex items-center justify-center w-full md:w-16 realtime-status-summary-call-icon-background'>
                            <SvgIcon type={Icon.Phone} fillClass='white-icon' />
                        </div>
                        <div className='flex flex-col md:flex-row w-full'>
                            {callStatistics && <>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.on_contact')} data={callStatistics.onContact}/>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.in_queue')} data={callStatistics.inQueue}/>
                            <WallboardBasicStatistic dataClassName={callStatistics.lwt >0 ? 'text-danger' : ''} title={t('wallboard.realtime_status_summary.lwt')} data={formatTime(callStatistics.lwt)}/>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.unavailable')} data={callStatistics.unAvailable}/>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.available')} data={callStatistics.available}/>
                            </>
                            }
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row border-t'>
                        <div className='flex items-center justify-center w-full md:w-16 realtime-status-summary-chat-icon-background'>
                            <SvgIcon type={Icon.Chat} fillClass='white-icon' />
                        </div>
                        <div className='flex flex-col md:flex-row w-full '>
                            {chatStatistics && <>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.on_contact')} data={chatStatistics.onContact}/>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.in_queue')} data={chatStatistics.inQueue}/>
                            <WallboardBasicStatistic dataClassName={chatStatistics.lwt >0 ? 'text-danger' : ''} title={t('wallboard.realtime_status_summary.lwt')} data={formatTime(chatStatistics.lwt)}/>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.unavailable')} data={chatStatistics.unAvailable}/>
                            <WallboardBasicStatistic title={t('wallboard.realtime_status_summary.available')} data={chatStatistics.available}/>
                            </>
                            }
                        </div>
                    </div>
                </div>
        </Card>
    </div>
}

export default RealtimeStatusSummary;
