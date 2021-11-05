import {Serie} from '@nivo/line'
import {useTranslation} from 'react-i18next';
import {TicketVolumeData} from '@pages/dashboard/models/ticket-volume-data.model';
import dayjs from 'dayjs';
import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import './tickets-volume-chart.scss';
import { HelioResponsiveLine} from '@components/dashboard';
export interface TicketsVolumeChartProps {
    data: TicketVolumeData;
}

const TicketsVolumeChart = ({data}: TicketsVolumeChartProps) => {

    const {t} = useTranslation();

    if (!data.closedTotal) {
        data.closedTotal = [];
    }

    if (!data.createdTotal) {
        data.createdTotal = [];
    }

    const convertedData: Serie[] = [
        {
            id: t('dashboard.tickets_volume.open') as string,
            data: data.createdTotal.map(item => {
                return {
                    x: dayjs(item.label).format('YYYY-MM-DD'),
                    y: item.value
                }
            })
        },
        {
            id: t('dashboard.tickets_volume.closed') as string,
            data: data.closedTotal.map(item => {
                return {
                    x: dayjs(item.label).format('YYYY-MM-DD'),
                    y: item.value
                }
            })
        }
    ]

    let dates = data.createdTotal.map((x: BasicStatistic) => new Date(x.label).getTime());
    dates = dates.concat(data.closedTotal.map((x: BasicStatistic) => new Date(x.label).getTime()));
    const earliest = new Date(Math.min.apply(null, dates));
    const latest = new Date(Math.max.apply(null, dates));
    const differenceInDays = dayjs(latest).diff(earliest, 'day');
    let tickRotation = 0;
    if (differenceInDays > 10) {
        tickRotation = 45;
    }

    let hasData = false;
    if (!convertedData || convertedData.length > 0) {
        for (let i = 0; i < convertedData.length; i++) {
            if (convertedData[i].data.length > 0) {
                hasData = true;
                break;
            }
        }
    }

    if (!hasData) {
        return <div
            className='w-full px-6 space-y-4 tickets-by-channel-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    }

    return <HelioResponsiveLine data={convertedData} tickRotation={tickRotation} toolTipLabelGenerator={(point) => `dashboard.tickets_volume.${point.serieId}_tickets`} />
}
export default TicketsVolumeChart;
