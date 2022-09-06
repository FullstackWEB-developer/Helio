import {useTranslation} from 'react-i18next';
import {SystemReport} from '@pages/reports/models/system-report.model';
import Spinner from '@components/spinner/Spinner';
import Card from '@components/card/card';
import {BasicStatistic} from '@components/dashboard';
import SystemReportTable from './system-reports-table';

export interface BotReports {
    title?: string;
    data?: SystemReport[]
}

const SystemReports = ({title, data}: BotReports) => {
    const {t} = useTranslation();

    if (!data || !data[0]) {
        return <Spinner size='large-40' className='pt-2' />;
    }

    return <div>
        <h6 className='my-7'>{t('reports.report_for', {title})}</h6>
        <div className='space-y-8 pb-4'>
            <Card title='reports.system_reports.key_kpis' hasBorderRadius={true} >
                <div className='flex flex-row justify-between px-8 pb-4'>
                    <BasicStatistic title='reports.system_reports.total_tickets_created'
                        wrapperClass='w-56'
                        value={data[0].totalTickets.toLocaleString()} />
                    <BasicStatistic title='reports.system_reports.total_incoming_calls'
                        wrapperClass='w-56'
                        value={data[0].totalInboundCalls.toLocaleString()} />
                    <BasicStatistic title='reports.system_reports.total_incoming_chats'
                        wrapperClass='w-56'
                        value={data[0].totalInboundChats.toLocaleString()} />
                    <BasicStatistic title='reports.system_reports.total_incoming_sms'
                        wrapperClass='w-56'
                        value={data[0].totalIncomingSms.toLocaleString()} />
                    <BasicStatistic title='reports.system_reports.total_incoming_email'
                        wrapperClass='w-56'
                        value={data[0].totalInboundEmails.toLocaleString()} />
                </div>
            </Card>
        </div>
        {
            data && data.length > 0 ?
                <SystemReportTable data={data} /> :
                <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
        }
    </div>
}
export default SystemReports
