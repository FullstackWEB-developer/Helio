import {Point} from '@nivo/line';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
export interface ChartTooltipProps {
    point: Point;
    label: string;
}
const ChartTooltip = ({point, label}: ChartTooltipProps) => {

    const {t} = useTranslation();

    return <div className='flex flex-col bg-white border rounded-md px-2 py-2 shadow-md line-chart-tool-tip'>
        <div className='body3'>
            {dayjs(point.data.x).format('MMM D')}
        </div>
        <div>
            <div key={point.id} className='flex flex-row items-center'>
                <div style={{backgroundColor: point.serieColor}} className='rounded-md w-2 h-2'/>
                <div className='body3-medium pl-2'>{t(label.toLowerCase())}</div>
                <div className='body2 pl-2'>{point.data.y}</div>
            </div>
        </div>
    </div>
}

export default ChartTooltip;
