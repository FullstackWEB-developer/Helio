import {ResponsiveBar} from '@nivo/bar';
import dayjs from 'dayjs';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PerformanceChartResponse} from '../models/performance-chart.model';
import {ViewTypes} from '../models/view-types.enum';
import {performanceChartViewTypes} from '../utils/constants';
import './performance-bot-chart.scss';

const PerformanceBotChart = ({data, selectedView}: {data: PerformanceChartResponse[], selectedView: ViewTypes}) => {
    const {t} = useTranslation();
    const [totalCalls, setTotalCalls] = useState(0);
    const [totalChats, setTotalChats] = useState(0);
    const [graphData, setGraphData] = useState<any[]>([]);

    useEffect(() => {
        let chatAggregatedVolume = [...data[0].queueData.botChat];
        let callsAggregatedVolume = [...data[0].queueData.botVoice];
        for (let i = 1; i < data.length; i++) {
            const voiceBotDataOfQueue = [...data[i].queueData.botVoice];
            const chatBotDataOfQueue = [...data[i].queueData.botChat];
            for (let j = 0; j < chatAggregatedVolume.length; j++) {
                callsAggregatedVolume[j].value += voiceBotDataOfQueue[j].value;
                chatAggregatedVolume[j].value += chatBotDataOfQueue[j].value;
            }
        }
        setTotalCalls(callsAggregatedVolume.reduce((sum, current) => sum + current.value, 0));
        setTotalChats(chatAggregatedVolume.reduce((sum, current) => sum + current.value, 0));

        let graphDataCombined: any[] = [];
        for (let i = 0; i < chatAggregatedVolume.length; i++) {
            graphDataCombined.push(
                {
                    'xAxisData': determineXAxisLabelFormat(chatAggregatedVolume[i].label),
                    'Chats': chatAggregatedVolume[i].value,
                    'Calls': callsAggregatedVolume[i].value,
                    'Month': [ViewTypes.LastMonth, Number(performanceChartViewTypes[3].value)].includes(selectedView) ?
                        dayjs(chatAggregatedVolume[i].label, 'MMMM D').format('MMM') : ''
                })
        }
        setGraphData(graphDataCombined);
    }, [data]);

    const determineXAxisLabelFormat = (date: string) => {
        switch (selectedView) {
            case ViewTypes.Yesterday:
                return dayjs(date, 'hh:mm A').format('hh A');
            case ViewTypes.LastMonth:
            case Number(performanceChartViewTypes[3].value):
                return dayjs(date, 'MMMM D').format('D');
            default:
                return dayjs(date, 'MMMM D').format('MMM D');
        }
    }

    const style = useMemo(() => {
        return getComputedStyle(document.body);
    }, []);

    return (
        <div data-testid='bot-performance-report-container' className="bg-white rounded-lg w-full">
            <div className="h7 pl-6 pt-5 pb-4">
                {t('reports.performance_charts_page.bot_performance_chart_title')}
            </div>

            <div className='h-64 flex flex-col'>
                <div className="subtitle2 pl-11">{t('reports.performance_charts_page.bot_performance_chart_title')}</div>
                <ResponsiveBar
                    data={graphData}
                    keys={[t('reports.performance_charts_page.bot_calls_key'), t('reports.performance_charts_page.bot_chats_key')]}
                    indexBy="xAxisData"
                    valueScale={{type: 'linear'}}
                    indexScale={{type: 'band', round: true}}
                    margin={{top: 30, right: 50, bottom: 65, left: 60}}
                    padding={0.75}
                    enableLabel={false}
                    groupMode="grouped"
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            itemWidth: 75,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            translateY: 60,
                            symbolSize: 8,
                            symbolShape: 'circle'
                        }
                    ]}
                    colors={['hsl(160, 100%, 40%)', 'hsl(219, 100%, 40%)']}
                    theme={{
                        fontSize: Number(style.getPropertyValue('--dashboard-volume-chart-axis-label-fontSizeInPx')),
                        fontFamily: style.getPropertyValue('--dashboard-volume-chart-axis-label-fontFamily'),
                        textColor: style.getPropertyValue('--dashboard-volume-chart-axis-label-color')
                    }}
                    tooltip={({id, value, color}) => (
                        <div key={`bot-chart-tooltip-${id}${value}`} className='flex flex-col bg-white border rounded-md shadow-md bar-chart-tooltip'>
                            <div className='flex items-center px-1 py-2'>
                                <div className='body3-medium' style={{color}}>
                                    {id}:
                                </div>
                                <div className='pl-2 body2'>
                                    {value}
                                </div>
                            </div>
                        </div>
                    )}
                    axisLeft={{
                        format: (e) => Math.floor(e) === e && e
                    }}
                    axisBottom={{
                        legendPosition: 'start',
                        legendOffset: 18,
                        legend: graphData && graphData[0] && graphData[0]['Month'] ? graphData[0]['Month'] : ''
                    }}
                />
            </div>
            <div className='flex justify-center items-center pt-8 pb-7'>
                <div className='flex flex-col items-center w-2/12'>
                    <span>{t('reports.performance_charts_page.total_calls')}</span>
                    <h4>{totalCalls}</h4>
                </div>

                <div className='flex flex-col items-center w-2/12'>
                    <span>{t('reports.performance_charts_page.total_chats')}</span>
                    <h4>{totalChats}</h4>
                </div>
            </div>
        </div>
    )
}

export default PerformanceBotChart;
