import {useTranslation} from 'react-i18next';
import { PerformanceChartDisplayUnit } from '../models/performance-chart.model';
import PerformanceVolumeChart from './performance-volume.chart';
import {ViewTypes} from '@pages/reports/models/view-types.enum';
import PerformanceChartQueueDropdown from '@pages/reports/components/performance-chart-queue-dropdown';
import {useEffect, useState} from 'react';
export interface PerformanceChartsGraphicProps {
    data: { queueName: string; queueData: PerformanceChartDisplayUnit[]; }[]
    title: string,
    wrapperClass?: string;
    selectedView: ViewTypes;
    type: 'voice' | 'chat'
}

export interface QueueLabels {
    queueName: string
    queueValue: number,
}

const PerformanceChartsGraphic = ({data, title, wrapperClass, selectedView, type}: PerformanceChartsGraphicProps) => {
    const {t} = useTranslation();
    const [selectedQueueNames, setSelectedQueueNames] = useState<string[] | null >([]);
    const [queueLabels, setQueueLabels] = useState<QueueLabels[] | undefined>(undefined);

    useEffect(() => {
        setQueueLabels(data.map(item => {
            return {
                queueName: item.queueName,
                queueValue: item.queueData.reduce((n, {value}) => n + value, 0)
            }
        }))
    }, [data]);

    const getNumberBadge = (item: any) => {
        return <div className='items-center justify-center' key={item.queueName}>
            <div className='body3-small flex items-center justify-center'>
                {item.queueName}
            </div>
            <h4 className='flex items-center justify-center mt-2'>
                {item.queueValue}
            </h4>
        </div>
    }

    if (!data || data.length === 0) {
        return <div className={`${wrapperClass} p-4 bg-white rounded-lg`}>
        <div className='h7'>{t(title)}</div>
        <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    </div>
    }

    return <div className={`${wrapperClass} p-4 bg-white rounded-lg`}>
        <div className='flex justify-between'>
                <div className='h7'>{t(title)}</div>
                <PerformanceChartQueueDropdown type={type} queueLabels={queueLabels} onQueuesSelected= {setSelectedQueueNames}/>
            </div>
        <div className='mt-12 ml-12 mb-4 subtitle2'>{t(title)}</div>
        <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>
            <PerformanceVolumeChart selectedView={selectedView} data={data} selectedQueues={selectedQueueNames}/>
        </div>
        <div className='w-full px-16 space-y-4 justify-around items-center flex'>
            {
                selectedQueueNames && selectedQueueNames.length > 0 ? queueLabels?.filter(x => selectedQueueNames?.includes(x.queueName)).map(item => { return getNumberBadge(item) }) : queueLabels?.map(item => { return getNumberBadge(item) })
            }
        </div>
    </div>;
}

export default PerformanceChartsGraphic;
