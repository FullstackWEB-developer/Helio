import {Point, ResponsiveLine, Serie} from '@nivo/line'
import {useTranslation} from 'react-i18next';
import {TicketVolumeData} from '@pages/dashboard/models/ticket-volume-data.model';
import dayjs from 'dayjs';
import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import {DashboardColors} from '@pages/dashboard/utils/dashboard-utils';
import './tickets-volume-chart.scss';
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
    const differenceInDays = dayjs().diff(earliest, 'day');
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

    const ChartTooltip = ({point}: {point: Point}) => {
        return <div className='flex flex-col bg-white border rounded-md px-2 py-2 shadow-md line-chart-tool-tip'>
            <div className='body3'>
                {dayjs(point.data.x).format('MMM D')}
            </div>
            <div>
                <div key={point.id} className='flex flex-row items-center'>
                    <div style={{backgroundColor: point.serieColor}} className='rounded-md w-2 h-2'/>
                    <div className='body3-medium pl-2'>{t(`dashboard.tickets_volume.${point.serieId}_tickets`)}</div>
                    <div className='body2 pl-2'>{point.data.y}</div>
                </div>
            </div>
        </div>
    }

    return <ResponsiveLine
        data={convertedData}
        enableSlices={false}
        useMesh={true}
        margin={{top: 10, right: 110, bottom: 100, left: 60}}
        xScale={{format: "%Y-%m-%d", type: "time"}}
        xFormat="time:%Y-%m-%d"
        yFormat=" >-.0f"
        enableCrosshair={false}
        curve='catmullRom'
        pointSize={14}
        colors={DashboardColors()}
        pointColor={{from: 'color'}}
        areaOpacity={0.2}
        pointBorderWidth={2.2}
        pointBorderColor='white'
        lineWidth={4}
        enableGridX={false}
        pointLabelYOffset={-12}
        tooltip={({ point }) => <ChartTooltip point={point}/>}
        enableArea={true}
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
