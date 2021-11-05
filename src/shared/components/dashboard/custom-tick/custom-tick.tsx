import dayjs from 'dayjs';
import React from 'react';

export interface CustomTickProps {
    tick: any;
    tickRotation: number;

}

const CustomTick = ({tick, tickRotation}: CustomTickProps) => {
    const style = getComputedStyle(document.body);

    return (
        <g transform={`translate(${tick.x  + (tickRotation ? 4 : -4) },${tick.y})` + (tickRotation ? ' rotate(45)' : '')}>
            <text
                dominantBaseline="middle"
                style={{
                    fontSize: Number(style.getPropertyValue('--dashboard-volume-chart-axis-label-fontSize')),
                    fontFamily: style.getPropertyValue('--dashboard-volume-chart-axis-label-fontFamily'),
                    fill: style.getPropertyValue('--dashboard-volume-chart-axis-label-color')
                }}
            >
                {tickRotation ? <tspan x="0" dy="1.2em">{dayjs(tick.value).format('ddd, MMM DD')}</tspan>
                    :
                    <>
                        <tspan  x="-6" dy="1.2em">{dayjs(tick.value).format('MMM DD')}</tspan>
                    </>
                }
            </text>
        </g>
    );
};

export default CustomTick;
