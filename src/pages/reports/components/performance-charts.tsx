import { useTranslation } from 'react-i18next';
import { PerformanceChartResponse } from '../models/performance-chart.model';
import PerformanceChartsGraphic from './performance-charts-graphic';

export interface PerformanceChartsProps {
    title?: string,
    data: PerformanceChartResponse[] | null
}

const PerformanceCharts = ({title, data}: PerformanceChartsProps) => {
    const {t} = useTranslation();
    return (
        <div>
            <h6 className='my-7'>{title}</h6>
            <PerformanceChartsGraphic data={data ? data?.map(function(a) {return { queueName: a.queueName, queueData: a.queueData.queueChat};}) : []} title={t('reports.performance_charts_page.queues_inbound_volume_over_time_chat')}/>
        </div>
    );
}

export default PerformanceCharts;
