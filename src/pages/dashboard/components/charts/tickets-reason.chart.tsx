import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import { getLookupValues } from '@shared/services/lookups.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import DashboardPieChart from '@pages/dashboard/components/charts/dashboard-pie-chart';
import './tickets-reason.chart.scss';
import {getPieChartColor} from '@pages/dashboard/utils/dashboard-utils';
import Spinner from '@components/spinner/Spinner';

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

    if (!ticketLookupValuesReason || ticketLookupValuesReason.length === 0) {
        return <div className='tickets-reason-body'><Spinner fullScreen/></div> 
    }

    if (!data || data.length === 0) {
        return <div
            className='w-full px-6 tickets-reason-body space-y-4 justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    }

    const GetLabel = (id: string): string => {
        if (id === "Others") {
            return t('dashboard.by_reason.label_others').toString();
        }

        return ticketLookupValuesReason.find(a => a.value === id)?.label ||  t('dashboard.by_reason.removed_reason').toString();
    }

    const convertedData = data.map((item, index) => {
        const label = GetLabel(item.label.toString());
        return {
            id: label,
            label: label,
            value: item.value,
            percentage: item.percentage,
            index
        }
    });

    const ChartItem = ({item, index}: { item: BasicStatistic, index: number }) => {
        return <div className='px-20  grid grid-cols-12 gap-1 items-center'>
            <div className='col-start-2 flex justify-center'>
                <div className='h-2.5 w-2.5 rounded-xl' style={{backgroundColor: getPieChartColor(index)}}/>
            </div>
            <div className='col-span-7'>{item.label}</div>
            <div className='col-span-1'>{item.value}</div>
            <div className='col-span-2'>{Math.round(item.percentage * 100) / 100}%</div>
        </div>
    }

    return <div>
        <div className='h-48'>
            <DashboardPieChart data={convertedData} tooltipTitle='dashboard.by_reason.tooltip_title'/>
        </div>
        <div className='pb-4 tickets-reason-table flex flex-col space-y-3 pt-10 body2'>
            {convertedData.map((item, i) => <ChartItem key={item.label} item={item} index={i}/>)}
        </div>
    </div>;
}

export default TicketsReasonChart;
