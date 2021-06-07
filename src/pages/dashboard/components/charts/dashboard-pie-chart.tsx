import {ResponsivePie} from '@nivo/pie';
import {getPieChartColor} from '@pages/dashboard/utils/dashboard-utils';

export interface DashboardPieChartProps {
    data: any[];
}


const DashboardPieChart = ({data}: DashboardPieChartProps) => {
    return <ResponsivePie
        data={data}
        margin={{top: 32}}
        innerRadius={0.60}
        colors={d => getPieChartColor(d.data.index)}
        enableArcLabels={false}
        animate={true}
        motionConfig="wobbly"
        transitionMode="pushOut"
        isInteractive={true}
        enableArcLinkLabels={false}
    />
}

export default DashboardPieChart
