import {useTranslation} from 'react-i18next';
import {PerformanceChartResponse} from '../models/performance-chart.model';
import PerformanceChartsGraphic from './performance-charts-graphic';
import {ViewTypes} from '@pages/reports/models/view-types.enum';
import PerformanceBotChart from './performance-bot-chart';

export interface PerformanceChartsProps {
    title?: string;
    data: PerformanceChartResponse[] | null;
    selectedView: ViewTypes;
}

const PerformanceCharts = ({title, data, selectedView}: PerformanceChartsProps) => {
    const {t} = useTranslation();
    return (
        <div>
            <h6 className='my-7'>{title}</h6>
            <div className='flex flex-col space-y-10'>
                <PerformanceChartsGraphic type='voice' selectedView={selectedView} data={data ? data?.map(function (a) {return {queueName: a.queueName, queueData: a.queueData.queueVoice};}) : []} title={t('reports.performance_charts_page.queues_inbound_volume_over_time_voice')} />
                <PerformanceChartsGraphic type='chat' selectedView={selectedView} data={data ? data?.map(function (a) {return {queueName: a.queueName, queueData: a.queueData.queueChat};}) : []} title={t('reports.performance_charts_page.queues_inbound_volume_over_time_chat')} />
                {data && data.length > 0 && <PerformanceBotChart data={data} selectedView={selectedView} />}
            </div>
        </div>
    );
}

export default PerformanceCharts;
