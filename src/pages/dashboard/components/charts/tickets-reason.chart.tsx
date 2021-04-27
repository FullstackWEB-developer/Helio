import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {getLookupValues} from '@pages/tickets/services/tickets.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import DashboardPieChart from '@pages/dashboard/components/charts/dashboard-pie-chart';
import './tickets-reason.chart.scss';
import {getPieChartColor} from '@pages/dashboard/utils/dashboard-utils';

export interface TicketsReasonChartProps {
    data: BasicStatistic[]
}

const TicketsReasonChart = ({data}: TicketsReasonChartProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
    }, [dispatch]);

    if (!ticketLookupValuesReason) {
        return <ThreeDots/>
    }

    if (!data || data.length === 0) {
        return <div
            className='w-full px-6 tickets-reason-body space-y-4 justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    }

    const GetLabel = (id: string): string => {
        if (id === "Others") {
            return t('dashboard.by_reason.label_others').toString();
        }

        return ticketLookupValuesReason.find(a => a.value === id)?.label || '';
    }

    const convertedData = data.map(item => {
        const label = GetLabel(item.label.toString());
        return {
            id: label,
            label: label,
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
            {convertedData.map(item => <ChartItem key={item.label} label={item.label} value={item.value}
                                                  percentage={item.percentage}/>)}
        </div>
    </div>;
}

export default TicketsReasonChart;
