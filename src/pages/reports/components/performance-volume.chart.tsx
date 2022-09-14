import {Serie} from '@nivo/line'
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import './performance-volume.chart.scss';
import utc from 'dayjs/plugin/utc';
import {PerformanceChartDisplayUnit} from '../models/performance-chart.model';
import ReportResponsiveLine from './report-responsive-line';
import {ViewTypes} from '@pages/reports/models/view-types.enum';

export interface PerformanceVolumeChartProps {
    data: { queueName: string; queueData: PerformanceChartDisplayUnit[]; }[];
    selectedQueues: string[] | null;
    selectedView: ViewTypes;
}

const PerformanceVolumeChart = ({data, selectedQueues, selectedView}: PerformanceVolumeChartProps) => {

    const {t} = useTranslation();
    dayjs.extend(utc);

    const getConvertedData = () => {
        let convertedData: Serie[];
        if(selectedQueues && selectedQueues.length > 0){
            convertedData = data.filter(x => selectedQueues.includes(x.queueName)).map(item => {
                return {
                    id: item.queueName as string,
                    data: item.queueData.map(item => {
                        return {
                            x: selectedView === ViewTypes.Yesterday ? item.label : dayjs(item.label).format('MMM DD'),
                            y: item.value
                        }
                    })
                }
            }) as Serie[];
        }else{
            convertedData = data.slice(0,5).map(item => {
                return {
                    id: item.queueName as string,
                    data: item.queueData.map(item => {
                        return {
                            x:  selectedView === ViewTypes.Yesterday ? item.label : dayjs(item.label).format('MMM DD'),
                            y: item.value
                        }
                    })
                }
            }) as Serie[];
        }
        return convertedData;
    }

    const hasData = () => {
        let hasData = false;
        let convertedData = getConvertedData();
        if (!convertedData || convertedData.length > 0) {
            for (let i = 0; i < convertedData.length; i++) {
                if (convertedData[i].data.length > 0) {
                    hasData = true;
                    break;
                }
            }
        }
        return hasData
    }

    if (!hasData()) {
        return <div
            className='w-full px-6 space-y-4 tickets-by-channel-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    }

    return <ReportResponsiveLine data={getConvertedData()} selectedView={selectedView} />
}
export default PerformanceVolumeChart;
