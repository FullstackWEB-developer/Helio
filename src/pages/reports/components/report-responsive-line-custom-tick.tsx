import dayjs from 'dayjs';
import React from 'react';

export interface ReportResponsiveLineCustomTickProps {
    tick: any;
    isTime: boolean
}

const ReportResponsiveLineCustomTick = ({tick, isTime} : ReportResponsiveLineCustomTickProps) => {
    const date = dayjs.utc(tick.value, isTime ? 'h:ss A' : 'MMM DD');


    return <svg>
        <g transform={`translate(${tick.x},${tick.y + 20})`}>
        <text
            textAnchor='middle'
            dominantBaseline="middle"
            className='helio-responsive-tick'
        >
            {isTime ? date.format('h A') : date.format('MMM DD')}
        </text>
    </g>
    </svg>
}

export default ReportResponsiveLineCustomTick;
