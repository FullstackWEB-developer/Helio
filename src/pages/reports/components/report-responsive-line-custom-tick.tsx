import dayjs from 'dayjs';
import React, {useMemo} from 'react';

export interface ReportResponsiveLineCustomTickProps {
    tick: any;
    isTime: boolean
}

const ReportResponsiveLineCustomTick = ({tick, isTime} : ReportResponsiveLineCustomTickProps) => {
    const date = dayjs.utc(tick.value, isTime ? 'h:ss A' : 'MMM DD');

    const style = useMemo(() => {
        return getComputedStyle(document.body);
    }, []);


    return <svg>
        <g transform={`translate(${tick.x},${tick.y + 20})`}>
        <text
            textAnchor='middle'
            dominantBaseline="middle"
            style={{
                fontSize: Number(style.getPropertyValue('--dashboard-volume-chart-axis-label-fontSize')),
                fontFamily: style.getPropertyValue('--dashboard-volume-chart-axis-label-fontFamily'),
                fill: style.getPropertyValue('--dashboard-volume-chart-axis-label-color')
            }}
        >
            {isTime ? date.format('h A') : date.format('MMM DD')}
        </text>
    </g>
    </svg>
}

export default ReportResponsiveLineCustomTick;
