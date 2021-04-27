import './tickets-by-channels-widget.scss';
import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import {useTranslation} from 'react-i18next';

export interface TicketsByChannelsWidgetProps {
    data: BasicStatistic[];
}

const TicketsByChannelsWidget = ({data}: TicketsByChannelsWidgetProps) => {
    const {t} = useTranslation();

    const Item = (item: BasicStatistic) => {
        const maxPercentage = Number(data[0].percentage);
        const top = ((maxPercentage / 10) + 1) * 10;
        const width = `${item.percentage * 100 / top}%`;
        return <div className='flex flex-col h-14'>
            <div className='flex flex-row justify-between'>
                <div>{item.label}</div>
                <div className='flex flex-row'>
                    <div className='pr-6'>{item.value}</div>
                    <div className='w-10 flex justify-end'>{`${item.percentage}%`}</div>
                </div>
            </div>
            <div>
                <div className='h-2 tickets-by-channel-row rounded' style={{width: width}}/>
                <div className='h-2 tickets-by-channel-row-bg rounded'/>
            </div>
        </div>
    }
    if (!data || data.length === 0) {
        return <div
            className='w-full px-6 space-y-4 tickets-by-channel-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
    }

    return <div className='w-full px-6 tickets-by-channel-body pt-4'>{
        data.map(item => <Item key={item.label.toString()} label={item.label} percentage={item.percentage}
                               value={item.value}/>)
    }</div>
}

export default TicketsByChannelsWidget;
