import {DashboardColors} from '@pages/dashboard/utils/dashboard-utils';
import {ChartTooltip, CustomTick} from '@components/dashboard';
import {Point, ResponsiveLine, Serie} from '@nivo/line'
import {useMemo} from 'react';

export interface HelioResponsiveLineProps {
    data: Serie[];
    tickRotation : number;
    toolTipLabelGenerator: (point: Point) => string;
}
const HelioResponsiveLine = ({data, tickRotation, toolTipLabelGenerator} : HelioResponsiveLineProps) => {

    const style = useMemo(() => {
        return getComputedStyle(document.body);
    }, []);

    return <ResponsiveLine
        data={data}
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
        areaOpacity={0.3}
        pointBorderWidth={2.2}
        pointBorderColor='white'
        lineWidth={4}
        theme={{
            fontSize: Number(style.getPropertyValue('--dashboard-volume-chart-axis-label-fontSize')),
            fontFamily: style.getPropertyValue('--dashboard-volume-chart-axis-label-fontFamily'),
            textColor: style.getPropertyValue('--dashboard-volume-chart-axis-label-color')
        }}
        enableGridX={false}
        pointLabelYOffset={-12}
        tooltip={({ point }) => <ChartTooltip label={toolTipLabelGenerator(point)} point={point}/>}
        enableArea={true}
        axisBottom={{
            tickValues: "every 1 day",
            legendOffset: 36,
            legendPosition: "middle",
            tickRotation: tickRotation,
            renderTick: (tick) =>  <CustomTick tick={tick} tickRotation={tickRotation} />,
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
