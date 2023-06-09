import {DashboardColors} from '@pages/dashboard/utils/dashboard-utils';
import {ChartTooltip, CustomTick} from '@components/dashboard';
import {Point, ResponsiveLine, Serie} from '@nivo/line'
import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TicketVolumeDataType} from '@pages/dashboard/models/ticket-volume-data-type.enum';

export interface HelioResponsiveLineProps {
    data: Serie[];
    tickRotation : number;
    volumeDataType?: TicketVolumeDataType
    tickValues?: string | Date[];
    toolTipLabelGenerator: (point: Point) => string;
}
const HelioResponsiveLine = ({data, tickRotation, tickValues = 'every 1 day', toolTipLabelGenerator, volumeDataType = TicketVolumeDataType.Daily} : HelioResponsiveLineProps) => {

    const [hasData, setHasData] = useState<boolean>(false);
    const {t} = useTranslation();

    useEffect(() => {
        data.forEach(series => {
           if (series.data.length > 0) {
               setHasData(true);
           }
        });
    }, [data]);

    const style = useMemo(() => {
        return getComputedStyle(document.body);
    }, []);

    if (!hasData) {
        return <div className='flex h-full w-full items-center justify-center body3-medium'>{t('my_stats.calls_chats.no_data')}</div>
    }

    const scaleFormat = volumeDataType === TicketVolumeDataType.SingleDay ? "%Y-%m-%d %H:%M:%S" : "%Y-%m-%d";
    const xFormat = volumeDataType === TicketVolumeDataType.SingleDay ? "time:%Y-%m-%d %H:%M:%S" : "time:%Y-%m-%d";
    return <ResponsiveLine
        data={data}
        enableSlices={false}
        useMesh={true}
        margin={{top: 10, right: 110, bottom: 100, left: 60}}
        xScale={{format: scaleFormat, type: "time"}}
        xFormat={xFormat}
        yFormat=" >-.0f"
        enableCrosshair={false}
        curve='linear'
        pointSize={14}
        colors={DashboardColors()}
        pointColor={{from: 'color'}}
        areaOpacity={0.3}
        pointBorderWidth={2.2}
        pointBorderColor='white'
        lineWidth={4}
        theme={{
            fontSize: Number(style.getPropertyValue('--dashboard-volume-chart-axis-label-fontSizeInPx')),
            fontFamily: style.getPropertyValue('--dashboard-volume-chart-axis-label-fontFamily'),
            textColor: style.getPropertyValue('--dashboard-volume-chart-axis-label-color')
        }}

        enableGridX={false}
        animate={false}
        axisLeft={{
            tickPadding: 20,
        }}
        pointLabelYOffset={-12}
        tooltip={({ point }) => <ChartTooltip data={data} volumeDataType={volumeDataType} label={toolTipLabelGenerator(point)} point={point}/>}
        enableArea={true}
        axisBottom={{
            tickValues,
            legendPosition: "middle",
            renderTick: (tick) =>  <CustomTick data={data} volumeDataType={volumeDataType} tick={tick} tickRotation={tickRotation} />,
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

export default HelioResponsiveLine;
