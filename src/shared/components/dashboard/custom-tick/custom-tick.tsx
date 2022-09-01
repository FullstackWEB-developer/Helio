import dayjs from 'dayjs';
import React, {useMemo} from 'react';
import {TicketVolumeDataType} from '@pages/dashboard/models/ticket-volume-data-type.enum';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import {useSelector} from 'react-redux';
import {selectDashboardFilterEndDate} from '@shared/store/app/app.selectors';
import { Serie } from '@nivo/line';
import './custom-tick.scss';

export interface CustomTickProps {
    data?: Serie[];
    tick: any;
    tickRotation: number;
    volumeDataType: TicketVolumeDataType;
}

const CustomTick = ({tick, tickRotation, volumeDataType, data = []}: CustomTickProps) => {
    dayjs.extend(utc);
    const dashboardFilterEndDate = useSelector(selectDashboardFilterEndDate);
    dayjs.extend(weekday);

    const findPoint = (point, date) => {
        return point.x == date.format('YYYY-MM-DD');
    }

    const getEndDate = (date: dayjs.Dayjs) => {
        if(data && data.length > 1){
            let currentIndex = data[0].data.findIndex( x => findPoint(x, date));
            if(currentIndex > -1 && data[0].data[currentIndex + 1]){
                if(data[0].data[currentIndex + 1].x){
                    return dayjs(data[0].data[currentIndex + 1].x).add(-1, 'd');
                }
            }
        }

        if(date.endOf('week').add(-1, 'd').isBefore(dayjs(dashboardFilterEndDate)) && dayjs(dashboardFilterEndDate).get('d') !== 0){
            return date.endOf('week').add(-1, 'd');
        } else {
            return dayjs(dashboardFilterEndDate);
        }
    }

    const calculatedLabel = useMemo(() => {
        const date = dayjs.utc(tick.value);
        if (tickRotation) {
            return <tspan x="0" dy="1.2em">{date.format('ddd, MMM DD')}</tspan>
        }

        switch (volumeDataType) {
            case TicketVolumeDataType.Daily:
                return <>
                    <tspan x={"0"} dy="1.8em">{date.format('ddd')}</tspan>
                    <tspan x={"0"} dy="1.2em">{date.format('MMM D')}</tspan>
                </>;
            case TicketVolumeDataType.SingleDay:
                return <>
                    <tspan x={"6"} dy="1.2em">{date.add(2, 'hour').format('hh:mm A')}</tspan>
                </>
            case TicketVolumeDataType.Weekly:
                return <>
                    <tspan x={"6"} dy="1.2em">{getEndDate(date).format('MMM DD')}</tspan>
                </>;
            case TicketVolumeDataType.Monthly:
                return <tspan x="0" dy="1.2em">{date.format('MMM')}</tspan>;
            case TicketVolumeDataType.Quarterly:
                return <>
                    <tspan x={"6"} dy="1.2em">{date.add(3, 'month').format('MMM')}</tspan>
                </>;
            case TicketVolumeDataType.Annually:
                return <tspan x="0" dy="1.2em">{date.format('YYYY')}</tspan>;
        }
    }, [tickRotation, tick, volumeDataType]);

    return (
        <g transform={`translate(${tick.x  + (tickRotation ? 4 : -4) },${tick.y})` + (tickRotation ? ' rotate(45)' : '')}>
            <text
                textAnchor='middle'
                dominantBaseline="middle"
                className='helio-responsive-tick'
            >
                {calculatedLabel}
            </text>
        </g>
    );
};

export default CustomTick;
