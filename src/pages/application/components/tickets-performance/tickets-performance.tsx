import {useQuery} from 'react-query';
import {GetTicketsPerformanceForUser} from '@constants/react-query-constants';
import {getTicketPerformanceForUser} from '@pages/tickets/services/tickets.service';
import {AgentPerformanceRequest} from '@pages/application/models/agent-performance-request';
import React, {useMemo, useState} from 'react';
import {Serie} from '@nivo/line';
import {AgentPerformanceResponse} from '@pages/application/models/agent-performance-response';
import Spinner from '@components/spinner/Spinner';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {TicketPerformance} from '@pages/application/models/ticket-performance';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import './tickets-performance.scss';
import {HelioResponsiveLine, BasicStatistic} from '@components/dashboard';

export interface TicketsPerformanceProps {
    userId?: string;
    date?: Date;
}

const TicketsPerformance = ({userId, date}: TicketsPerformanceProps) => {

    const [data, setData] = useState<Serie[]>([]);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {isLoading, data: response, isError} = useQuery([GetTicketsPerformanceForUser, userId, date], () => {
        if (userId) {
            const request: AgentPerformanceRequest = {
                userId: userId
            }
            if (date) {
                request.startDate = date;
            }

            return getTicketPerformanceForUser(request);
        } else {
            return getTicketPerformanceForUser();
        }
    }, {
        onSuccess: (data) => handleData(data),
        onError: () => {
            dispatch(addSnackbarMessage({
                message:'my_stats.tickets_performance.could_not_fetch_ticket_performance',
                type: SnackbarType.Error
            }))
        }
    });

    const tickRotation = useMemo(() => {
        if (response) {
            let dates = response?.dailyPerformance.map((x: TicketPerformance) => new Date(x.day).getTime());
            dates = dates.concat(response?.dailyPerformance.map((x: TicketPerformance) => new Date(x.day).getTime()));
            const earliest = new Date(Math.min.apply(null, dates));
            const latest = new Date(Math.max.apply(null, dates));
            const differenceInDays = dayjs(latest).diff(earliest, 'day');
            let tickRotation = 0;
            if (differenceInDays > 10) {
                tickRotation = 45;
            }
            return tickRotation;
        }
        return 0;
    }, [response])

    const handleData = (response: AgentPerformanceResponse) => {
            setData([

                {
                    id: t('my_stats.tickets_performance.closed') as string,
                    data: response.dailyPerformance.map(item => {
                        return {
                            x: dayjs(item.day).format('YYYY-MM-DD'),
                            y: item.closed
                        }
                    })
                },
                {
                    id: t('my_stats.tickets_performance.received') as string,
                    data: response.dailyPerformance.map(item => {
                        return {
                            x: dayjs(item.day).format('YYYY-MM-DD'),
                            y: item.received
                        }
                    })
                }
            ]);
    }

    if (isLoading) {
        return <div className='h-80'><Spinner /></div>;
    }

    if (isError) {
        return <div className='h-80'>
            {t('my_stats.tickets_performance.could_not_fetch_ticket_performance')}
        </div>
    }

    return <div className='flex flex-col'>
                <div className='subtitle2 pl-8'>{t('my_stats.tickets_performance.received_and_closed_tickets')}</div>
        <div className='h-80 tickets-performance-chart-wrapper'>
            <HelioResponsiveLine data={data} tickRotation={tickRotation} toolTipLabelGenerator={(point) => `my_stats.tickets_performance.${point.serieId}_tickets`} />
        </div>
        <div className='flex flex-row h-full justify-evenly'>
            <BasicStatistic title='my_stats.tickets_performance.received'
                            value={response?.totalReceived || 0}/>
            <BasicStatistic title='my_stats.tickets_performance.closed'
                            value={response?.totalClosed || 0}/>
            <BasicStatistic title='my_stats.tickets_performance.resolution_rate'
                            isPercentage={true}
                            value={response?.resolutionRate || 0}/>
        </div>
    </div>
}

export default TicketsPerformance;
