import {DashboardColors} from '@pages/dashboard/utils/dashboard-utils';
import {ResponsiveLine, Serie} from '@nivo/line'
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import PerformanceVolumeChartTooltip from '@pages/reports/components/performance-volume-chart-tooltip';
import ReportResponsiveLineCustomTick from '@pages/reports/components/report-responsive-line-custom-tick';
import {ViewTypes} from '@pages/reports/models/view-types.enum';

export interface ReportResponsiveLineProps {
    data: Serie[],
    selectedView: ViewTypes
}
const ReportResponsiveLine = ({data, selectedView} : ReportResponsiveLineProps) => {

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

    return <ResponsiveLine
        data={data}
        enableSlices={false}
        useMesh={true}
        margin={{top: 10, right: 48, bottom: 100, left: 48}}
        yFormat=" >-.0f"
        enableCrosshair={false}
        curve='linear'
        pointSize={10}
        colors={DashboardColors()}
        pointColor={{from: 'color'}}
        areaOpacity={0.3}
        pointBorderWidth={2.2}
        pointBorderColor='white'
        lineWidth={3}
        tooltip={({ point }) => <PerformanceVolumeChartTooltip point={point} />}
        theme={{
            fontSize: Number(style.getPropertyValue('--dashboard-volume-chart-axis-label-fontSize')),
            fontFamily: style.getPropertyValue('--dashboard-volume-chart-axis-label-fontFamily'),
            textColor: style.getPropertyValue('--dashboard-volume-chart-axis-label-color')
        }}
        enableGridX={false}
        pointLabelYOffset={-12}
        enableArea={false}
        axisBottom={{
            tickValues: 'every 1 day',
            legendPosition: "middle",
            renderTick: (tick) =>  <ReportResponsiveLineCustomTick isTime={selectedView === ViewTypes.Yesterday} tick={tick} />
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
                itemsSpacing: 24,
                symbolSize: 11,
                symbolShape: 'circle',
                itemDirection: 'left-to-right',
                itemTextColor: '#777',
            }
        ]}
    />
}

export default ReportResponsiveLine;
