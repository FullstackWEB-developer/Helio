import {PerformanceMetric} from '@pages/dashboard/models/performance-metric.model';
import Tab from '@components/tab/Tab';
import Tabs from '@components/tab/Tabs';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
import {useQuery} from 'react-query';
import {GetTodaysPerformanceMetricsRequest} from '@constants/react-query-constants';
import {GetTodaysPerformanceMetrics} from '@shared/services/lookups.service';
import Card from '@components/card/card';
import './performance-today.scss';
import WallboardBasicStatistic from '@pages/dashboard/components/wallboard/wallboard-basic-statistic';

export interface PerformanceTodayProps {
    data? : PerformanceMetric[]
}
const ChannelPerformance = ({data, channel}: {data?: PerformanceMetric, channel: string}) => {
    const {t} = useTranslation();
    if (!data) {
        data = {
            channel,
            missed:0,
            answered:0,
            abandoned:0,
            answerTime:'00:00',
            holdTime:'00:00',
            inbound:0,
            outbound:0,
            callbacks:0,
            handledTime:'00:00',
            total:0
        };
    }
    const missedClassName = classnames({'text-danger': data.missed > 0});
    return <div className='flex flex-col'>
        <div className='flex flex-col xl:flex-row'>
            <WallboardBasicStatistic title={t('wallboard.performance_today.total')} data={data.total}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.inbound')} data={data.inbound}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.outbound')} data={data.outbound}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.callbacks')} data={data.callbacks}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.aht')} data={data.handledTime}/>
        </div>
        <div className='flex flex-col xl:flex-row border-t'>
            <WallboardBasicStatistic title={t('wallboard.performance_today.answered')} data={data.answered}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.missed')} data={data.missed} dataClassName={missedClassName}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.abandoned')} data={data.abandoned}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.awt')} data={data.answerTime}/>
            <WallboardBasicStatistic title={t('wallboard.performance_today.hold_time')} data={data.holdTime}/>
        </div>
    </div>
}

export interface PerformanceTodayProps {
    lastUpdateTime: Date;
}

const PerformanceToday = ({lastUpdateTime}: PerformanceTodayProps) => {
    const {t} = useTranslation();

    const {data, isLoading, refetch, isFetching} = useQuery<PerformanceMetric[], Error>([GetTodaysPerformanceMetricsRequest], () => GetTodaysPerformanceMetrics());

    useEffect(() => {
        refetch().then();
    }, [lastUpdateTime, refetch]);

    const mainWrapperClassName =classnames({
        'opacity-40' : isFetching || isLoading
    });

    return <div className={mainWrapperClassName}>
        <Card>
            <Tabs asCard titleClass='pl-6' title={t('wallboard.performance_today.title')}>
                <Tab title={t('wallboard.performance_today.call_tab_title')}>
                    <ChannelPerformance data={data?.find(a => a.channel === 'VOICE')} channel='VOICE'/>
                </Tab>
                <Tab title={t('wallboard.performance_today.chat_tab_title')}>
                    <ChannelPerformance data={data?.find(a => a.channel === 'CHAT')} channel='CHAT' />
                </Tab>
            </Tabs>
        </Card>
    </div>

}

export default PerformanceToday;
