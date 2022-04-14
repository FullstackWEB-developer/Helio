import {Point} from '@nivo/line';
import dayjs from 'dayjs';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {TicketVolumeDataType} from '@pages/dashboard/models/ticket-volume-data-type.enum';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';

export interface ChartTooltipProps {
    point: Point;
    label: string;
    volumeDataType?: TicketVolumeDataType;
}
const ChartTooltip = ({point, label, volumeDataType = TicketVolumeDataType.Daily}: ChartTooltipProps) => {

    dayjs.extend(utc);
    dayjs.extend(weekday);
    const {t} = useTranslation();

    const headerLabel = useMemo(() => {
        const date = dayjs.utc(point.data.x);
        switch (volumeDataType) {
            case TicketVolumeDataType.Daily:
                return date.format('MMM D');
            case TicketVolumeDataType.SingleDay:
                return date.format('HH:mm') + " - " + date.add(2, 'hour').format('HH:mm');
            case TicketVolumeDataType.Weekly:
                return date.format('MMM D') + " - " + date.weekday(7).format('MMM D');
            case TicketVolumeDataType.Quarterly:
                return date.format('MMM D') + " - " + date.add(3, 'month').format('MMM D');
            case TicketVolumeDataType.Monthly:
                return date.format('MMM');
            case TicketVolumeDataType.Annually:
                return date.format('yyyy');
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
