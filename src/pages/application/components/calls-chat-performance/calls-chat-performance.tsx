import {useQuery} from 'react-query';
import {GetContactPerformanceForUser} from '@constants/react-query-constants';
import {getContactPerformanceForUser} from '@pages/tickets/services/tickets.service';
import React, {useMemo, useState} from 'react';
import {Serie} from '@nivo/line';
import Spinner from '@components/spinner/Spinner';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import './calls-chat-performance.scss';
import {AgentContactPerformanceResponse} from '@pages/application/models/agent-contact-performance-response';
import {ChannelTypes} from '@shared/models';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import SvgIcon, {Icon} from '@components/svg-icon';
import utils from '@shared/utils/utils';
import {AgentContactHandlesByChannel} from '@pages/application/models/agent-contact-handles-by-channel';
import {BasicStatistic, HelioResponsiveLine} from '@components/dashboard';

export interface CallsChatPerformanceProps {
    userId?: string;
}

const CallsChatPerformance = ({userId}: CallsChatPerformanceProps) => {

    const [data, setData] = useState<Serie[]>([]);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {isLoading, data: response, isError} = useQuery([GetContactPerformanceForUser, userId], () => {
        return getContactPerformanceForUser(userId);
    }, {
        onSuccess: (data) => handleData(data),
        onError: () => {
            dispatch(addSnackbarMessage({
                message:'my_stats.calls_chats.could_not_fetch_contact_performance',
                type: SnackbarType.Error
            }))
        }
    });
    
    const tickRotation = useMemo(() => {
        if (response) {
            let dates = response?.agentContactHandlesByChannel.map((x: AgentContactHandlesByChannel) => new Date(x.startInterval!).getTime());
            dates = dates.concat(response?.agentContactHandlesByChannel.map((x: AgentContactHandlesByChannel) => new Date(x.startInterval!).getTime()));

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

    const handleData = (response: AgentContactPerformanceResponse) => {
        setData([
            {
                id: t('my_stats.calls_chats.calls') as string,
                data: response.agentContactHandlesByChannel.filter(a => a.channel === ChannelTypes.PhoneCall).map(item => {
                    return {
                        x: dayjs(item.startInterval).format('YYYY-MM-DD'),
                        y: item.contactsHandled
                    }
                })
            },
            {
                id: t('my_stats.calls_chats.chats') as string,
                data: response.agentContactHandlesByChannel.filter(a => a.channel === ChannelTypes.Chat).map(item => {
                    return {
                        x: dayjs(item.startInterval).format('YYYY-MM-DD'),
                        y: item.contactsHandled
                    }
                })
            }
        ]);
    }




    if (isLoading) {
        return <div className='h-80'><Spinner fullScreen={true} /></div>;
    }

    if (isError) {
        return <div className='h-80 text-danger flex justify-center items-center'>
            {t('my_stats.could_not_fetch_contact_performance')}
        </div>
    }

    const tableModel: TableModel = {
        columns: [{
            title:'my_stats.calls_chats.category',
            render:(field:number) => <div className='flex items-center h-full pl-4'><SvgIcon className='icon-small' type={field === ChannelTypes.Chat ? Icon.Chat : Icon.Phone} fillClass='rgba-038-fill' /></div>,
            field:'channel',
            widthClass:'w-1/6'
        }, {
            title:'my_stats.calls_chats.contacts_handled',
            field:'contactsHandled',
            widthClass: 'w-1/6 flex justify-start',
            headerClassName: 'w-1/6 flex justify-start'
        }, {
            title:'my_stats.calls_chats.avg_handle_time',
            field:'averageHandleTime',
            widthClass:'w-1/6 flex justify-start',
            render:(field:number) => <div className='body2 flex start flex items-center'>{utils.formatSeconds(field)}</div>,
            headerClassName: 'w-1/6 flex justify-start'
        }, {
            title:'my_stats.calls_chats.avg_hold_time',
            field:'averageCustomerHoldTime',
            widthClass:'w-1/6 flex justify-start',
            render:(field:number) => <div className='body2 flex items-center'>{utils.formatSeconds(field)}</div>,
            headerClassName: 'w-1/6 flex justify-start'
        }, {
            title:'my_stats.calls_chats.avg_interaction_time',
            field:'averageAgentInteractionTime',
            widthClass:'w-1/6 flex justify-start',
            render:(field:number) => <div className='body2 flex items-center'>{utils.formatSeconds(field)}</div>,
            headerClassName: 'w-1/6 flex justify-start'
        }, {
            title:'my_stats.calls_chats.avg_after_contact_work',
            field:'averageAfterContactWorkTime',
            widthClass:'w-1/6 flex justify-start',
            render:(field:number) => <div className='body2 flex items-center'>{utils.formatSeconds(field)}</div>,
            headerClassName: 'w-1/6 flex justify-start'
        }],
        rows:response?.agentPerformanceByChannel || [],
        hasRowsBottomBorder: true,
        rowClass:'h-12',
        size: 'large'
    }

    return <div className='flex flex-col'>
        <div className='subtitle2 pl-8'>{t('my_stats.calls_chats.calls_and_chats_volume')}</div>
        <div className='h-80 calls-chat-performance-chart-wrapper'>
            <HelioResponsiveLine data={data} tickRotation={tickRotation} toolTipLabelGenerator={(point) => `my_stats.calls_chats.${point.serieId}`} />
        </div>
        <div className='flex flex-row h-full justify-between px-12 pb-12'>
                <BasicStatistic title='my_stats.calls_chats.total_calls_and_chats'
                            value={response?.agentPerformance[0].contactsHandled || 0}/>
                <BasicStatistic title='my_stats.calls_chats.occupancy'
                            isPercentage={true}
                            value={response?.agentPerformance[0].occupancy || 0}/>
                <BasicStatistic title='my_stats.calls_chats.answer_rate'
                            isPercentage={true}
                            value={response?.agentPerformance[0].agentAnswerRate || 0}/>
                <BasicStatistic title='my_stats.calls_chats.on_contact_time'
                            value={response?.agentPerformance[0].agentOnContactTime || 0}/>
                <BasicStatistic title='my_stats.calls_chats.idle_time'
                            value={response?.agentPerformance[0].agentIdleTime || 0}/>
                <BasicStatistic title='my_stats.calls_chats.non_productive_time'
                            value={response?.agentPerformance[0].nonProductiveTime || 0}/>
        </div>
        <div className='w-full px-6 pb-12'>
            <Table model={tableModel} />
        </div>
    </div>
}

export default CallsChatPerformance;
