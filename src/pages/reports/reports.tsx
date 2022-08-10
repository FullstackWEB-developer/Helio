import Button from '@components/button/button';
import { ControlledSelect } from '@components/controllers';
import { Icon } from '@components/svg-icon';
import Tabs, { Tab } from '@components/tab';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import './reports.scss';
import { reportTypes, viewTypes } from './utils/constants';
import { TabTypes } from './models/tab-types.enum';
import { ViewTypes } from './models/view-types.enum';
import { ReportTypes } from './models/report-types.enum';
import { useQuery } from 'react-query';
import { exportAgentReport, exportQueueReport, getAgentReport, getQueueReport } from '@pages/tickets/services/tickets.service';
import { useDispatch } from 'react-redux';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import AgentReports from './components/agent-reports';
import Spinner from '@components/spinner/Spinner';
import dayjs from 'dayjs';
import { ExportAgentReport, ExportQueueReport, GetAgentReport, GetQueueReport } from '@constants/react-query-constants';
import QueueReports from './components/queue-reports';
var weekday = require('dayjs/plugin/weekday')
const Reports = () => {
    const {t} = useTranslation();
    const [selectedView, setSelectedView] = useState<ViewTypes>(ViewTypes.Last7Days);
    const [selectedReport, setSelectedReport] = useState<ReportTypes>(ReportTypes.AgentReports);
    const [selectedReportForView, setSelectedReportForView] = useState<ReportTypes>(ReportTypes.AgentReports);
    const [selectedTab, setSelectedTab] = useState<TabTypes>(TabTypes.Reports);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [reportTitle, setReportTitle] = useState<string>();
    const dispatch = useDispatch();
    const {control, handleSubmit} = useForm({
        mode: 'all'
    });
    dayjs.extend(weekday)

    useEffect(() => {
        refetchAgentData();
        changeReportTitle();
    }, []);
    

    const {isLoading: getAgentReportIsLoading, isFetching: getAgentReportIsFetching, refetch: refetchAgentData, data: agentData} = useQuery([GetAgentReport], () => getAgentReport(selectedView),{
        enabled: false,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_agent_report.error'
            }));
        }
    });

    const {isLoading: getQueueReportIsLoading, isFetching: getQueueReportIsFetching, refetch: refetchQueueData, data: queueData} = useQuery([GetQueueReport], () => getQueueReport(selectedView),{
        enabled: false,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_queue_report.error'
            }));
        }
    });
        
    const {isLoading: downloadAgentReportIsLoading, refetch: downloadAgentReport} = useQuery([ExportAgentReport, selectedView, selectedMonths], () => exportAgentReport(selectedView, selectedMonths),{
        enabled: false,
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'reports.download_agent_report.success'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.download_agent_report.error'
            }));
        }
    });

    const {isLoading: downloadQueueReportIsLoading, refetch: downloadQueueReport} = useQuery([ExportQueueReport, selectedView, selectedMonths], () => exportQueueReport(selectedView, selectedMonths),{
        enabled: false,
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'reports.download_queue_report.success'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.download_queue_report.error'
            }));
        }
    });

    const onSubmit = () => {
        if(selectedReport === ReportTypes.AgentReports && selectedView !== ViewTypes.MonthlyReports)
        {
            refetchAgentData();
        }
        else if(selectedReport === ReportTypes.QueueReports && selectedView !== ViewTypes.MonthlyReports)
        {
            refetchQueueData();
        }
        setSelectedReportForView(selectedReport);
        changeReportTitle();
    }

    const changeReportTitle = () => {
        const now = dayjs().utc();
        if(selectedView === ViewTypes.Yesterday){
            setReportTitle(now.subtract(1, 'd').format('MMMM DD, YYYY'));
        }else if(selectedView === ViewTypes.Last7Days){
            setReportTitle(`${now.subtract(8, 'd').format('MMMM DD, YYYY')} - ${now.subtract(1, 'd').format('MMMM DD, YYYY')}`);
        }else if(selectedView === ViewTypes.LastWeek){
            setReportTitle(`${dayjs().weekday(-7).format('MMMM DD, YYYY')} - ${dayjs().weekday(-1).format('MMMM DD, YYYY')}`);
        }else if(selectedView === ViewTypes.LastMonth){
            setReportTitle(now.subtract(1, 'M').format('MMMM, YYYY'));
        }
    }

    const onDownload = () => {
        if(selectedReport === ReportTypes.AgentReports && selectedView !== ViewTypes.MonthlyReports)
        {
            downloadAgentReport();
        }
        else if(selectedReport === ReportTypes.QueueReports && selectedView !== ViewTypes.MonthlyReports)
        {
            downloadQueueReport();
        }
    }

    const onTabChange = (tab: number) => {
        setSelectedTab(tab);
        setSelectedView(ViewTypes.Last7Days);
    }

    const isLoading = () => {
        return getAgentReportIsLoading || getAgentReportIsFetching || getQueueReportIsLoading || getQueueReportIsFetching
    }
    
    const settings = () => {
        return <div className='my-6'>
            {selectedView === ViewTypes.MonthlyReports && <h6 className='pt-3 mb-1'>{t('reports.view_options.monthly_reports')}</h6>}
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-1 flex-col group'>
                <div className='flex flex-row mt-5 gap-8'>
                    {
                        selectedTab === TabTypes.Reports && <div className='reports-select h-14'>
                            <ControlledSelect
                                defaultValue={selectedReport.toString()}
                                name='report-type'
                                control={control}
                                label='reports.report'
                                options={reportTypes}
                                onSelect={(option) => setSelectedReport(Number(option?.value) as ReportTypes)}
                            />
                        </div>
                    }
                    <div className='w-48 h-14'>
                        <ControlledSelect
                            defaultValue={selectedView.toString()}
                            name='view-type'
                            control={control}
                            label='reports.view'
                            options={viewTypes}
                            onSelect={(option) => setSelectedView(Number(option?.value) as ViewTypes)}
                        />
                    </div>
                    {
                        selectedTab === TabTypes.Reports && <div className='w-2/4 h-14 flex items-center'>
                            <Button label='reports.view' type='submit' buttonType='medium' />
                            {
                                selectedView !== ViewTypes.MonthlyReports && <Button label='reports.download' isLoading={downloadAgentReportIsLoading || downloadQueueReportIsLoading} className='mx-6' buttonType='secondary-medium' icon={Icon.Download} onClick={() => onDownload()}/>
                            }
                        </div>
                    }
                </div>
            </form>
        </div>
    };
    
    return (
        <div className='reports w-full h-full overflow-y-auto p-6'>
            <h5>{t('reports.reports')}</h5>
            <div className='mt-6'>
                <Tabs onSelect={(tab) => onTabChange(tab)}>
                    <Tab key={TabTypes.Reports} title={t('reports.reports')}>
                        {settings()}
                        {
                            isLoading() && <Spinner size='large-40' className='pt-2' />
                        }
                        {
                            (selectedReportForView === ReportTypes.AgentReports && selectedView !== ViewTypes.MonthlyReports && !isLoading()) && <AgentReports title={reportTitle} data={agentData}/>
                        }
                        {
                            (selectedReportForView === ReportTypes.QueueReports && selectedView !== ViewTypes.MonthlyReports && !isLoading()) && <QueueReports title={reportTitle} data={queueData}/>
                        }
                    </Tab>
                    <Tab key={TabTypes.PerformanceCharts} title={t('reports.performance_charts')}>
                        {settings()}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
export default Reports;
