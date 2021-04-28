import {HandleAndResponseTimes} from '@pages/dashboard/models/handle-and-response-time.model';
import {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import './ticket-response-time-widget.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

export interface TicketResponseTimeWidgetProps {
    data: HandleAndResponseTimes;
}

const TicketResponseTimeWidget = ({data}: TicketResponseTimeWidgetProps) => {
    dayjs.extend(duration);
    const {t} = useTranslation();

    const convertSeconds = (seconds: number) => {
        const duration = dayjs.duration(seconds, 'seconds');
        return duration.format('HH:mm:ss')
    }

    const calculatePercentage = (currentSeconds: number, previousSeconds: number) => {
        if (previousSeconds === 0 || currentSeconds === 0) {
            return 0;
        }
        const diff = currentSeconds - previousSeconds;
        const percentage = 100 * diff / currentSeconds;
        const result = Math.abs(Math.round(percentage));
        if (!result || isNaN(result)) {
            return 0;
        }
        return result;
    }

    const createWidget = (label: string, time: number, previousTime: number): ReactNode => {

        return <div className='ticket-response-times-inner-widget flex flex-col items-center'>
            <div className='body3-medium pb-2.5'>{t(label)}</div>
            <div><h5>{convertSeconds(time)}</h5></div>
            <div className='flex flex-row items-center'>
                <div>
                    <SvgIcon type={previousTime > time ? Icon.ArrowTrendUp : Icon.ArrowTrendDown}
                             fillClass={previousTime > time ? 'ticket-response-times-fill-success' : 'ticket-response-times-fill-danger'}/>
                </div>
                <div className='body3'>
                    {`${calculatePercentage(time, previousTime)}%`}
                </div>
            </div>
        </div>;
    }

    return <div className='flex flex-row px-6 justify-evenly pt-2.5'>
        {createWidget('dashboard.response_time.average_response_time', data.responseTime, data.previousResponseTime)}
        {createWidget('dashboard.response_time.average_handle_time', data.handleTime, data.previousHandleTime)}
    </div>
}
export default TicketResponseTimeWidget;
