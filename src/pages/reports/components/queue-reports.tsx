import { useTranslation } from 'react-i18next';
import HorizontalStatisticWidget from './horizontal-statistic-widget';
import { QueueReport } from '../models/queue-report.model';
import { useEffect, useRef, useState } from 'react';
import { ChannelTypes } from '@shared/models';
import Dropdown, { DropdownModel } from '@components/dropdown';
import { customHooks } from '@shared/hooks';
import SvgIcon, { Icon } from '@components/svg-icon';
import ReportPieChart from './report-pie.chart';
import QueueReportsTable from './queue-reports-table';

export interface QueueReportsProps {
    data: QueueReport[],
    title?: string
}

interface BasicStatistic {
    label: string | number | Date;
    percentage: number;
    value?: number;
}

const QueueReports = ({data, title}: QueueReportsProps) => {
    const {t} = useTranslation();
    const maxEdgeValue = 95;
    const [widgetType, setWidgetType] = useState<ChannelTypes>(ChannelTypes.PhoneCall);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const [voiceAbandoned, setVoiceAbandoned] = useState<BasicStatistic[]>([]);
    const [chatAbandoned, setChatAbandoned] = useState<BasicStatistic[]>([]);
    const [voiceInbound, setVoiceInbound] = useState<BasicStatistic[]>([]);
    const [chatInbound, setChatInbound] = useState<BasicStatistic[]>([]);
    const [voiceAverageWaitTime, setVoiceAverageWaitTime] = useState<BasicStatistic[]>([]);
    const [chatAverageWaitTime, setChatAverageWaitTime] = useState<BasicStatistic[]>([]);
    const [displayTypeDropdown, setDisplayTypeDropdown] = useState<boolean>(false);
    const dropdownItems=[{ label: "reports.voice", value: ChannelTypes.PhoneCall.toString()}, { label: "reports.chat", value: ChannelTypes.Chat.toString()}]
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<string | undefined>(dropdownItems && dropdownItems[0].label);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState<string | undefined>(dropdownItems && dropdownItems[0].value);
    const dropdownModel: DropdownModel = {
        defaultValue: selectedDropdownValue,
        onClick: (id) => onDropdownSelected(id),
        items: dropdownItems,
        itemsWrapperClass: 'w-28'
    };
    useEffect(() => {
        if(data && data.length > 0){
            setVoiceAbandoned(data.sort(({abandonedCallsPercent:a}, {abandonedCallsPercent:b}) => b-a).slice(0,5).map((obj) => ({
                label: obj.queueName,
                percentage: obj.abandonedCallsPercent
            })));
            setChatAbandoned(data.sort(({abandonedChatsPercent:a}, {abandonedChatsPercent:b}) => b-a).slice(0,5).map((obj) => ({
                label: obj.queueName,
                percentage: obj.abandonedChatsPercent
            })));
            setVoiceInbound(data.sort(({totalInboundCalls:a}, {totalInboundCalls:b}) => b-a).slice(0,5).map((obj) => ({
                label: obj.queueName,
                percentage: obj.totalInboundCalls === 0 ? 0 : obj.totalInboundCalls * 100 / (data.reduce((n, {totalInboundCalls}) => n + totalInboundCalls, 0)),
                value: obj.totalInboundCalls
            })));
            setChatInbound(data.sort(({totalNumberOfIncomingChats:a}, {totalNumberOfIncomingChats:b}) => b-a).slice(0,5).map((obj) => ({
                label: obj.queueName,
                percentage: obj.totalNumberOfIncomingChats === 0 ? 0 : obj.totalNumberOfIncomingChats * 100 / (data.reduce((n, {totalNumberOfIncomingChats}) => n + totalNumberOfIncomingChats, 0)),
                value: obj.totalNumberOfIncomingChats
            })));
            setVoiceAverageWaitTime(data.sort(({averageInboundCallWaitTime:a}, {averageInboundCallWaitTime:b}) => b-a).slice(0,5).map((obj, i) => ({
                label: obj.queueName,
                value: obj.averageInboundCallWaitTime,
                percentage: i === 0 ? (data[0].averageInboundCallWaitTime === 0 ? 0 : maxEdgeValue) : (obj.averageInboundCallWaitTime === 0 || data[0].averageInboundCallWaitTime === 0  ? 0 : obj.averageInboundCallWaitTime * maxEdgeValue / data[0].averageInboundCallWaitTime),
            })));
            setChatAverageWaitTime(data.sort(({averageIncomingChatWaitTime:a}, {averageIncomingChatWaitTime:b}) => b-a).slice(0,5).map((obj, i) => ({
                label: obj.queueName,
                value: obj.averageIncomingChatWaitTime,
                percentage: i === 0 ? (data[0].averageIncomingChatWaitTime === 0 ? 0 : maxEdgeValue) : (obj.averageIncomingChatWaitTime === 0 || data[0].averageIncomingChatWaitTime === 0  ? 0 : obj.averageIncomingChatWaitTime * maxEdgeValue / data[0].averageIncomingChatWaitTime),
            })));
        } else {
            setVoiceAbandoned([]);
            setChatAbandoned([]);
            setVoiceInbound([]);
            setChatInbound([]);
            setVoiceAverageWaitTime([]);
            setChatAverageWaitTime([]);
        }
    }, [data]);

    const onDropdownSelected = (id: string) => {
        setWidgetType(Number(id) as ChannelTypes);
        setSelectedDropdownItem(dropdownItems?.find(x => x.value === id)?.label);
        setSelectedDropdownValue(id);
        setDisplayTypeDropdown(false);
    }

    customHooks.useOutsideClick([typeDropdownRef], () => {
        setDisplayTypeDropdown(false);
    });

    return (
        <div>
            <h6 className='my-7'>{t('reports.report_for', { title })}</h6>
            <div className='px-6 pt-4 bg-white rounded-lg'>
                <div className='pb-4 flex justify-between'>
                    <div className='h7'>{t("reports.queues_performance")}</div>
                    <div className='relative z-10' ref={typeDropdownRef}>
                        <div onClick={() => setDisplayTypeDropdown(!displayTypeDropdown)}
                            className='flex flex-row items-center cursor-pointer'>
                            <div>{selectedDropdownItem && t(selectedDropdownItem)}</div>
                            <div className='pl-2'>
                                <SvgIcon type={displayTypeDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                    className='icon-medium' fillClass='dashboard-dropdown-arrows' />
                            </div>
                        </div>
                        {displayTypeDropdown &&
                            <div className='absolute'>
                                <Dropdown model={dropdownModel} />
                            </div>}
                    </div>
                </div>
                <div className='flex gap-8'>
                    <ReportPieChart wrapperClass='w-1/3 horizontal-statistic-widget-wrapper' title={'reports.top_5_queues_by_inbound_volume'} data={widgetType === ChannelTypes.PhoneCall ? voiceInbound : chatInbound}/>
                    <HorizontalStatisticWidget wrapperClass='w-1/3 horizontal-statistic-widget-wrapper' title={'reports.most_abandoned_queues'} data={widgetType === ChannelTypes.PhoneCall ? voiceAbandoned : chatAbandoned}/>
                    <HorizontalStatisticWidget wrapperClass='w-1/3 horizontal-statistic-widget-wrapper' title={'reports.queues_with_highest_average_wait_time'} data={widgetType === ChannelTypes.PhoneCall ? voiceAverageWaitTime : chatAverageWaitTime}/>
                </div>
            </div>
            <QueueReportsTable data={data} title={"reports.queues_report"}/>
        </div>
    );
}

export default QueueReports;
