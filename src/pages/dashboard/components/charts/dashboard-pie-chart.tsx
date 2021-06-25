import {ComputedDatum, ResponsivePie} from '@nivo/pie';
import {getPieChartColor} from '@pages/dashboard/utils/dashboard-utils';
import {useTranslation} from 'react-i18next';

export interface DashboardPieChartProps {
    data: any[];
    tooltipTitle: string;
}


const DashboardPieChart = ({data, tooltipTitle}: DashboardPieChartProps) => {
    const {t} = useTranslation()

    const ChartTooltip = ({datum}: {datum: ComputedDatum<any>}) => {
        return <div className='flex flex-col bg-white border rounded-md px-2 py-2 shadow-md'>
            <div className='body3'>
                {t(tooltipTitle)}
            </div>
            <div>
                <div key={datum.id} className='flex flex-row items-center'>
                    <div style={{backgroundColor: datum.color}} className='rounded-md w-2 h-2'/>
                    <div className='body3-medium pl-2'>{`${datum.label}:`}</div>
                    <div className='body2 pl-2'>{`${datum.value} (${Math.round(datum.data.percentage * 100) / 100}%)`}</div>
                </div>
            </div>
        </div>
    }

    return <ResponsivePie
        data={data}
        margin={{top: 32, bottom: 12}}
        innerRadius={0.50}
        colors={d => getPieChartColor(d.data.index)}
        enableArcLabels={false}
        tooltip={({ datum }) => <ChartTooltip datum={datum}/>}
        motionConfig="wobbly"
        transitionMode="pushOut"
        isInteractive={true}
        activeOuterRadiusOffset={10}
        enableArcLinkLabels={false}
    />
}

export default DashboardPieChart
