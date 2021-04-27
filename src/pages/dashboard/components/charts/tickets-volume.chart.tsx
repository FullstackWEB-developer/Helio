import {ResponsiveLine, Serie} from '@nivo/line'
import {useTranslation} from 'react-i18next';
import {TicketVolumeData} from '@pages/dashboard/models/ticket-volume-data.model';
import dayjs from 'dayjs';

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
                    y: item.value | 0
                }
            })
        },
        {
            id: t('dashboard.tickets_volume.closed') as string,
            data: data.closedTotal.map(item => {
                return {
                    x: dayjs(item.label).format('YYYY-MM-DD'),
                    y: item.value | 0
                }
            })
        }
    ]
    let tickRotation = 0;
    convertedData.forEach(item => {
        if (item.data.length > 20) {
            tickRotation = 45;
        }
    });

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
    return <ResponsiveLine
        data={convertedData}
        margin={{top: 10, right: 110, bottom: 100, left: 60}}
        xScale={{format: "%Y-%m-%d", type: "time"}}
        xFormat="time:%Y-%m-%d"
        yFormat=" >-.0f"
        pointSize={6}
        colors={{scheme: 'pastel2'}}
        pointColor={{theme: 'background'}}
        pointBorderWidth={5}
        pointBorderColor={{from: 'serieColor'}}
        enableGridX={false}
        pointLabelYOffset={-12}
        useMesh={true}
        axisBottom={{
            tickValues: "every 1 day",
            format: function (value) {
                return dayjs(value) ? dayjs(value).format('ddd, MMM DD') : "";
            },
            legendOffset: 36,
            legendPosition: "middle",
            tickRotation: tickRotation
        }}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 13,
                translateY: 75,
                itemWidth: 80,
                itemHeight: 10,
                itemsSpacing: 13,
                symbolSize: 11,
                symbolShape: 'circle',
                itemDirection: 'left-to-right',
                itemTextColor: '#777'
            }
        ]}
    />
}
export default TicketsVolumeChart;
