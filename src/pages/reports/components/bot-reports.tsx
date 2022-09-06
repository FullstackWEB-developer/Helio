import {useTranslation} from 'react-i18next';
import Spinner from '@components/spinner/Spinner';
import {BotReport} from '@pages/reports/models/bot-report.model';
import Card from '@components/card/card';
import {BasicStatistic} from '@components/dashboard';
import React, {useEffect, useState} from 'react';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import dayjs from 'dayjs';
import SvgIcon, {Icon} from '@components/svg-icon';
import {TicketRate} from '@pages/reports/models/ticket-rate.enum';

export interface BotReports {
    title?: string;
    data?: BotReport
}

const BotReports = ({title,  data} : BotReports) => {
    const {t} = useTranslation();
    const [botKpiData, setBotKpiData] = useState<any[]>([]);
    const [appStatisticData, setAppStatisticData] = useState<any[]>([]);

    useEffect(() => {
        if (!data) {
            setAppStatisticData([]);
            setBotKpiData([]);
            return;
        }

        const kpiData = [

            {
                "channel": "reports.bot_reports.voice",
                "total_serviced": data.totalCalls,
                "average_duration": data.averageVoiceDuration,
                "bot_rating": data.voiceRating
            },
            {
                "channel": "reports.bot_reports.chat",
                "total_serviced": data.totalChats,
                "average_duration": data.averageChatDuration,
                "bot_rating": data.chatRating
            },
            {
                "channel": "",
                "total_serviced": "",
                "average_duration": "",
                "bot_rating": undefined
            }
        ];
        setBotKpiData(kpiData);

        const appData = [
            {
                "kpi":"reports.bot_reports.appointments_scheduled",
                "value": data.appointmentsScheduled
            },{
                "kpi":"reports.bot_reports.appointments_rescheduled",
                "value": data.appointmentsRescheduled
            },{
                "kpi":"reports.bot_reports.appointments_canceled",
                "value": data.appointmentsCanceled
            },{
                "kpi":"reports.bot_reports.appointment_information_requests",
                "value": data.appointmentsInformationRequests
            },{
                "kpi":"reports.bot_reports.medication_refill_requests",
                "value": data.medicationRefillRequests
            },{
                "kpi":"reports.bot_reports.new_patients_registered",
                "value": data.patientsRegistered
            },{
                "kpi":"reports.bot_reports.test_results_requests",
                "value": data.testResultsRequests
            },{
                "kpi":"reports.bot_reports.medical_history_requests",
                "value": data.medicalHistoryRequests
            },{
                "kpi":"",
                "value": ""
            }
        ];

        setAppStatisticData(appData);

    }, [data]);
    if (!data) {
        return <Spinner size='large-40' className='pt-2' />;
    }


    const formatTime = (time: string) => {
        if (!time) {
            return '';
        }
        return <div className='flex justify-center body2'>{dayjs.duration(parseInt(time), 'seconds').format('HH:mm:ss')}</div>;
    }

    const botKpiTableModel : TableModel = {
        columns: [{
            title: 'reports.bot_reports.channel' ,
            alignment: 'start',
            field: 'channel',
            widthClass: 'w-1/4',
            render: (field) => <span className='subtitle2 flex items-center h-full'>{t(field)}</span>
        },{
            title: 'reports.bot_reports.total_serviced',
            alignment: 'start',
            field: 'total_serviced',
            widthClass: 'w-1/4'
        },{
            title: 'reports.bot_reports.average_duration',
            alignment: 'start',
            field: 'average_duration',
            widthClass: 'w-1/4',
            render: (field) => <span className='flex flex-start'>{formatTime(field)}</span>
        },{
            title: 'reports.bot_reports.bot_ratings',
            alignment: 'start',
            field: 'bot_rating',
            widthClass: 'w-1/4',
            render: (field: TicketRate) => field !== undefined ? <span className='flex items-center h-full'><SvgIcon
                type={field === TicketRate.Negative ? Icon.RatingDissatisfied : (field === TicketRate.Positive ? Icon.RatingVerySatisfied : Icon.RatingSatisfied)}
                fillClass={field === TicketRate.Negative ? 'rating-widget-unsatisfied' : (field === TicketRate.Positive ? 'rating-widget-satisfied' : 'rating-widget-neutral')}
            /></span> : null
        }],
        rows: botKpiData,
        size: 'large',
        hasRowsBottomBorder: true,
        rowClass: 'h-8'
    }

    const appStatisticDataTableModel: TableModel = {
        columns: [{
            title: 'reports.bot_reports.kpi',
            widthClass: 'w-1/2',
            field: 'kpi',
            render: (field) => <span className='subtitle2 flex items-center h-full'>{t(field)}</span>
        },{
            title: 'reports.bot_reports.value',
            widthClass: 'w-1/2',
            field: 'value'
        }],
        rows: appStatisticData,
        size: 'large',
        hasRowsBottomBorder: true,
        rowClass: 'h-8'
    }



    return <div>
        <h6 className='my-7'>{t('reports.report_for', { title })}</h6>
        <div className='space-y-8 pb-10'>
            <Card title='reports.bot_reports.key_kpis' hasBorderRadius={true} >
                <div className='flex flex-row justify-between px-6 pb-4'>
                    <BasicStatistic title='reports.bot_reports.total_calls'
                                    wrapperClass='w-72'
                                    value={data.totalCalls}/>
                    <BasicStatistic title='reports.bot_reports.total_chats'
                                    wrapperClass='w-72'
                                    value={data.totalChats}/>
                    <BasicStatistic title='reports.bot_reports.appointments_scheduled'
                                    wrapperClass='w-72'
                                    value={data.appointmentsScheduled}/>
                    <BasicStatistic title='reports.bot_reports.new_patients_registered'
                                    wrapperClass='w-72'
                                    value={data.patientsRegistered}/>
                </div>
            </Card>

            <Card title='reports.bot_reports.bot_kpis' hasBorderRadius={true}>
                <Table model={botKpiTableModel} />
            </Card>

            <Card title='reports.bot_reports.results' hasBorderRadius={true}>
                <Table model={appStatisticDataTableModel} />
            </Card>
        </div>
    </div>
}
export default BotReports
