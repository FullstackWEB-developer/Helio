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

    const convertedData = data.map(item => {
        return {
            id: item.label,
            label: item.label,
            value: item.value,
            percentage: item.percentage
        }
    });
    const ChartItem = (item: BasicStatistic) => {
        return <div className='flex flex-row w-full items-center justify-center' key={item.label.toString()}>
            <div className='h-2 w-2 rounded-xl' style={{backgroundColor: getPieChartColor(item)}}/>
            <div className='pl-2.5 w-32 truncate'>{item.label}</div>
            <div className='w-10'>{item.value}</div>
            <div className='w-10'>{Math.round(item.percentage * 100) / 100}%</div>
        </div>
    }
    return <div>
        <div className='h-40'>
            <DashboardPieChart data={convertedData}/>
        </div>
        <div className='h-72 flex flex-col space-y-4 pt-10'>
            {convertedData.map(item => <ChartItem key={item.label.toString()} label={item.label} value={item.value}
                                                  percentage={item.percentage}/>)}
        </div>
    </div>;
}

export default TicketsPriorityChart;
