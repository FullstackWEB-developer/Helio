import {useTranslation} from 'react-i18next';
import DashboardPieChart from '@pages/dashboard/components/charts/dashboard-pie-chart';
import {getPieChartColor} from '@pages/dashboard/utils/dashboard-utils';
import classnames from 'classnames';
interface BasicStatistic {
    label: string | number | Date;
    percentage: number;
    value?: number;
}

export interface PieChartProps {
    data: BasicStatistic[],
    title: string,
    wrapperClass?: string
}

const ReportPieChart = ({data, title, wrapperClass}: PieChartProps) => {
    const {t} = useTranslation();
    if (!data || data.length === 0) {
        return <div className={`${wrapperClass} pt-4 bg-white rounded-lg`}>
        <div className='h7'>{t(title)}</div>
        <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    </div>
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
        return <div className='px-10 grid grid-cols-12 gap-1 items-center'>
            <div className='col-start-4 flex justify-center'>
                <div className='h-2.5 w-2.5 rounded-xl' style={{backgroundColor: getPieChartColor(index)}}/>
            </div>
            <div className='col-span-4'>{item.label}</div>
            <div className='col-span-2'>{item.value}</div>
        </div>
    }

    return <div className={classnames('pt-4 bg-white rounded-lg', wrapperClass)}>
        <div className='h-48'>
            <DashboardPieChart data={convertedData} tooltipTitle={title}/>
        </div>
        <div className='h-72 flex flex-col space-y-4 pt-10'>
            {convertedData.map((item, i) => <ChartItem key={item.label.toString()} item={item} index={i}/>)}
        </div>
    </div>;
}

export default ReportPieChart;
