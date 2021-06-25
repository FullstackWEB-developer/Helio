import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import {useTranslation} from 'react-i18next';
import DashboardPieChart from '@pages/dashboard/components/charts/dashboard-pie-chart';
import './tickets-priority.chart.scss';
import {getPieChartColor} from '@pages/dashboard/utils/dashboard-utils';

export interface TicketsPriorityChartProps {
    data: BasicStatistic[]
}

const TicketsPriorityChart = ({data}: TicketsPriorityChartProps) => {
    const {t} = useTranslation();

    if (!data || data.length === 0) {
        return <div
            className='w-full px-6 space-y-4 tickets-priority-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    }

    const convertedData = data.map((item, index) => {
        return {
            id: item.label,
            label: item.label,
            value: item.value,
            percentage: item.percentage,
            index
        }
    });
    const ChartItem = ({item, index}: { item: BasicStatistic, index: number }) => {
        return <div key={item.label.toString()} className='px-20  grid grid-cols-12 gap-2 items-center'>
            <div className='col-start-3 h-2.5 w-2.5 rounded-xl' style={{backgroundColor: getPieChartColor(index)}}/>
            <div className='col-span-4'>{item.label}</div>
            <div className='col-span-2'>{item.value}</div>
            <div className='col-span-2'>{Math.round(item.percentage * 100) / 100}%</div>
        </div>
    }

    return <div>
        <div className='h-48'>
            <DashboardPieChart data={convertedData} tooltipTitle='dashboard.by_priority.tooltip_title'/>
        </div>
        <div className='h-72 flex flex-col space-y-4 pt-10'>
            {convertedData.map((item, i) => <ChartItem key={item.label.toString()} item={item} index={i}/>)}
        </div>
    </div>;
}

export default TicketsPriorityChart;
