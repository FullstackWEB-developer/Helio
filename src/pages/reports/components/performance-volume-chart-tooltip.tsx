import React from 'react';
import {Point} from '@nivo/line';

const PerformanceVolumeChartTooltip = ({point}: {point: Point}) => {
    return  <div className='flex flex-col bg-white border rounded-md px-2 py-2 shadow-md line-chart-tool-tip'>
        <div>
            <div key={point.id} className='flex flex-row items-center'>
                <div style={{backgroundColor: point.serieColor}} className='rounded-md w-2 h-2'/>
                <div className='body3-medium pl-2'>{point.serieId} : </div>
                <div className='body2 pl-2'>{point.data.y}</div>
            </div>
        </div>
    </div>
}

export default PerformanceVolumeChartTooltip;
