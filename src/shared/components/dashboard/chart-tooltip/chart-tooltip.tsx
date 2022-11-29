import {Point, Serie} from '@nivo/line';
import dayjs from 'dayjs';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {TicketVolumeDataType} from '@pages/dashboard/models/ticket-volume-data-type.enum';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import {useSelector} from 'react-redux';
import {selectDashboardFilterEndDate} from '@shared/store/app/app.selectors';

export interface ChartTooltipProps {
    data?: Serie[];
    point: Point;
    label: string;
    volumeDataType?: TicketVolumeDataType;
}
const ChartTooltip = ({point, label, volumeDataType = TicketVolumeDataType.Daily, data = []}: ChartTooltipProps) => {

    dayjs.extend(utc);
    const dashboardFilterEndDate = useSelector(selectDashboardFilterEndDate);
    dayjs.extend(weekday);
    const {t} = useTranslation();

    const findPoint = (point, date) => {
        return point.x === date.format('YYYY-MM-DD');
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

    const headerLabel = useMemo(() => {
        const date = dayjs.utc(point.data.x);
        switch (volumeDataType) {
            case TicketVolumeDataType.Daily:
                return date.format('MMM D');
            case TicketVolumeDataType.SingleDay:
                return date.format('hh:mm A') + " - " + date.add(2, 'hour').format('hh:mm A');
            case TicketVolumeDataType.Weekly:
                return date.format('MMM D') + " - " + getEndDate(date).format('MMM DD');
            case TicketVolumeDataType.Quarterly:
                return date.format('MMM D, YYYY') + " - " + date.add(3, 'month').format('MMM D, YYYY');
            case TicketVolumeDataType.Monthly:
                return date.format('MMM, YYYY');
            case TicketVolumeDataType.Annually:
                return date.format('YYYY');
        }
    }, [volumeDataType, point]);

    return <div className='flex flex-col bg-white border rounded-md px-2 py-2 shadow-md line-chart-tool-tip'>
        <div className='body3'>
            {headerLabel}
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
