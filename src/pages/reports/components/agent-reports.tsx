import { useTranslation } from 'react-i18next';
import HorizontalStatisticWidget from './horizontal-statistic-widget';
import { AgentReport } from '../models/agent-report.model';
import { useEffect, useState } from 'react';
import { ChannelTypes } from '@shared/models';
import AgentReportsTable from './agent-reports-table';
import { SortDirection } from '@shared/models/sort-direction';
import { useDispatch } from 'react-redux';
import { getUserList } from '@shared/services/lookups.service';

export interface AgentReportsProps {
    data: AgentReport[],
    title?: string,
    onSort: (sortField: string | undefined, sortDirection: SortDirection) => void
}

interface BasicStatistic {
    label: string | number | Date;
    percentage: number;
    value?: number;
}

const AgentReports = ({data, title, onSort}: AgentReportsProps) => {
    const {t} = useTranslation();
    const [widgetType, setWidgetType] = useState<ChannelTypes>(ChannelTypes.PhoneCall);
    const [utilization, setUtilization] = useState<BasicStatistic[]>([]);
    const [voiceAverageHandleTime, setVoiceAverageHandleTime] = useState<BasicStatistic[]>([]);
    const [chatAverageHandleTime, setChatAverageHandleTime] = useState<BasicStatistic[]>([]);
    const [voiceAverageHoldTime, setVoiceAverageHoldTime] = useState<BasicStatistic[]>([]);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);
    
    useEffect(() => {
        if(data && data.length > 0){
            setUtilization(data.sort(({utilizationPercent:a}, {utilizationPercent:b}) => a-b).slice(0,5).map((obj) => ({
                label: obj.userFullName,
                percentage: obj.utilizationPercent
            })));
            setVoiceAverageHoldTime(data.sort(({avgVoiceHoldTime:a}, {avgVoiceHoldTime:b}) => b-a).slice(0,5).map((obj, i) => ({
                label: obj.userFullName,
                percentage: i === 0 ? (data[0].avgVoiceHoldTime === 0 ? 0 : 80) : (obj.avgVoiceHoldTime === 0 || data[0].avgVoiceHoldTime === 0  ? 0 : obj.avgVoiceHoldTime * 80 / data[0].avgVoiceHoldTime),
                value: obj.avgVoiceHoldTime
            })));
            setChatAverageHandleTime(data.sort(({avgChatHandleTime:a}, {avgChatHandleTime:b}) => b-a).slice(0,5).map((obj, i) => ({
                label: obj.userFullName,
                percentage: i === 0 ? (data[0].avgChatHandleTime === 0 ? 0 : 80) : (obj.avgChatHandleTime === 0 || data[0].avgChatHandleTime === 0  ? 0 : obj.avgChatHandleTime * 80 / data[0].avgChatHandleTime),
                value: obj.avgChatHandleTime
            })));
            setVoiceAverageHandleTime(data.sort(({avgVoiceHandleTime:a}, {avgVoiceHandleTime:b}) => b-a).slice(0,5).map((obj, i) => ({
                label: obj.userFullName,
                percentage: i === 0 ? (data[0].avgVoiceHandleTime === 0 ? 0 : 80) : (obj.avgVoiceHandleTime === 0 || data[0].avgVoiceHandleTime === 0  ? 0 : obj.avgVoiceHandleTime * 80 / data[0].avgVoiceHandleTime),
                value: obj.avgVoiceHandleTime
            })));
        } else {
            setUtilization([]);
            setVoiceAverageHoldTime([]);
            setVoiceAverageHandleTime([]);
            setChatAverageHandleTime([]);
        }
    }, [data]);

    return (
        <div>
            <h6 className='my-7'>{t('reports.report_for', { title })}</h6>
            <div className='flex gap-8'>
                <HorizontalStatisticWidget wrapperClass='w-1/3 h-96 px-6' title={'reports.utilization'} description={'reports.bottom_5_performers'} data={utilization}/>
                <HorizontalStatisticWidget dropdownItems={[{ label: "reports.voice", value: ChannelTypes.PhoneCall.toString()}, { label: "reports.chat", value: ChannelTypes.Chat.toString()}]} dropdownSelected={(id) => setWidgetType(Number(id) as ChannelTypes)} wrapperClass='w-1/3 h-96 px-6' title={'reports.average_handle_time'} description={'reports.bottom_5_performers'} data={widgetType === ChannelTypes.PhoneCall ? voiceAverageHandleTime : chatAverageHandleTime}/>
                <HorizontalStatisticWidget wrapperClass='w-1/3 h-96 px-6' title={'reports.voice_average_hold_time'} description={'reports.bottom_5_performers'} data={voiceAverageHoldTime}/>
            </div>
            <AgentReportsTable data={data} title={"reports.agent_report"} onSort={onSort}/>
        </div>
    );
}

export default AgentReports;
