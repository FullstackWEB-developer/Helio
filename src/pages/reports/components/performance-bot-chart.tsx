import {ResponsiveBar} from '@nivo/bar';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PerformanceChartResponse} from '../models/performance-chart.model';
import {ViewTypes} from '../models/view-types.enum';

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
                    'xAxisData': selectedView != ViewTypes.Yesterday ? dayjs(chatAggregatedVolume[i].label, 'MMMM D').format('MMM D') : chatAggregatedVolume[i].label,
                    'Chats': chatAggregatedVolume[i].value,
                    'Calls': callsAggregatedVolume[i].value
                })
        }
        setGraphData(graphDataCombined);
    }, [data]);
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
                    padding={0.3}
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
