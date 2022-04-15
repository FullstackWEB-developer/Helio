import {Serie} from '@nivo/line'
import {useTranslation} from 'react-i18next';
import {TicketVolumeData} from '@pages/dashboard/models/ticket-volume-data.model';
import dayjs from 'dayjs';
import './tickets-volume-chart.scss';
import {HelioResponsiveLine} from '@components/dashboard';
import utc from 'dayjs/plugin/utc';
import {useMemo} from 'react';
import {TicketVolumeDataType} from '@pages/dashboard/models/ticket-volume-data-type.enum';

export interface TicketsVolumeChartProps {
    data: TicketVolumeData;
}

const TicketsVolumeChart = ({data}: TicketsVolumeChartProps) => {

    const {t} = useTranslation();
    dayjs.extend(utc);
    if (!data.closedTotal) {
        data.closedTotal = [];
    }

    if (!data.createdTotal) {
        data.createdTotal = [];
    }

    const convertedData: Serie[] = [
        {
            id: t('dashboard.tickets_volume.closed') as string,
            data: data.closedTotal.map(item => {
                return {
                    x: dayjs(item.label).format(data.volumeDataType === TicketVolumeDataType.SingleDay ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'),
                    y: item.value
                }
            })
        },
        {
            id: t('dashboard.tickets_volume.open') as string,
            data: data.createdTotal.map(item => {
                return {
                    x: dayjs(item.label).format(data.volumeDataType === TicketVolumeDataType.SingleDay ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'),
                    y: item.value
                }
            })
        }
    ]


    const tickValues = useMemo(() => {
        const values: Date[] = [];
        data.createdTotal.forEach(a => {
            values.push(dayjs.utc(a.label).toDate());
        });

        data.closedTotal.forEach(a => {
            if (!values.map(a => a.toTimeString()).includes(dayjs.utc(a.label).toDate().toTimeString())) {
                values.push(dayjs.utc(a.label).toDate());
            }
        });

        return values;
    }, [data]);


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


    return <HelioResponsiveLine volumeDataType={data.volumeDataType} tickValues={tickValues} data={convertedData} tickRotation={0} toolTipLabelGenerator={(point) => `dashboard.tickets_volume.${point.serieId}_tickets`} />
}
export default TicketsVolumeChart;
