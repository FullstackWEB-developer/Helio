import Button from '@components/button/button';
import {ControlledDateInput, ControlledSelect} from '@components/controllers';
import {Icon} from '@components/svg-icon';
import Tabs, {Tab} from '@components/tab';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import './reports.scss';
import {reportTypes, viewTypes} from './utils/constants';
import {TabTypes} from './models/tab-types.enum';
import {ViewTypes} from './models/view-types.enum';
import {ReportTypes} from './models/report-types.enum';
import {useMutation, useQuery} from 'react-query';
import {
    exportAgentReport,
    exportBotReport,
    exportQueueReport,
    exportSystemReport,
    getAgentReport,
    getAvailableMonths,
    getBotReport,
    getPerformanceChart,
    getQueueReport,
    getSystemReport
} from '@pages/tickets/services/tickets.service';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import AgentReports from './components/agent-reports';
import Spinner from '@components/spinner/Spinner';
import dayjs from 'dayjs';
import {
    GetAgentReport,
    GetBotReport,
    GetPerformanceChart,
    GetQueueReport,
    GetSystemReport
} from '@constants/react-query-constants';
import QueueReports from './components/queue-reports';
import MonthList from './components/month-list';
import {SortDirection} from '@shared/models/sort-direction';
import {AgentReport} from './models/agent-report.model';
import utils from '@shared/utils/utils';
import {BotReport} from '@pages/reports/models/bot-report.model';
import {AxiosError} from 'axios';
import BotReports from '@pages/reports/components/bot-reports';
import {Option} from '@components/option/option';
import weekday from 'dayjs/plugin/weekday';
import PerformanceCharts from './components/performance-charts';
import {PerformanceChartResponse} from './models/performance-chart.model';
import SystemReports from '@pages/reports/components/system-reports';
import {SystemReport} from '@pages/reports/models/system-report.model';

const Reports = () => {
    const {t} = useTranslation();
    const [selectedView, setSelectedView] = useState<ViewTypes>(ViewTypes.Last7Days);
    const [selectedReport, setSelectedReport] = useState<ReportTypes>(ReportTypes.AgentReports);
    const [selectedReportForView, setSelectedReportForView] = useState<ReportTypes>(ReportTypes.AgentReports);
    const [selectedViewForView, setSelectedViewForView] = useState<ViewTypes>(ViewTypes.Last7Days);
    const [selectedTab, setSelectedTab] = useState<TabTypes>(TabTypes.Reports);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
    const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();
    const [agentReportData, setAgentReportData] = useState<AgentReport[]>([]);
    const [viewSelectOptions, setViewSelectOptions] = useState<Option[]>([]);
    const [performanceChartData, setPerformanceChartData] = useState<PerformanceChartResponse[] | null>(null);
    const [reportTitle, setReportTitle] = useState<string>();
    const [reportTitleForView, setReportTitleForView] = useState<string>();
    const [_, setOrderDate] = useState<Date | undefined>();
    const dispatch = useDispatch();
    const {control, handleSubmit, setValue} = useForm({
        mode: 'all',
        defaultValues: {
            "view-type": ViewTypes.Last7Days.toString(),
            "report-type" :ReportTypes.AgentReports.toString(),
            "endDate" : undefined,
            "startDate": undefined
        }
    });
    dayjs.extend(weekday)

    useEffect(() => {
        setSelectedReport(ReportTypes.AgentReports);
        refetchAgentData().then();
        changeReportTitle();
    }, []);

    useEffect(() => {
        setSelectedMonths([]);
    }, [selectedViewForView, selectedReportForView]);

    useEffect(() => {
        changeReportTitle(true);
    }, [selectedView, GetPerformanceChart]);

    useEffect(() => {
        if (!selectedReport) {
            setViewSelectOptions(viewTypes);
        }
        let options: Option[] = [];
        options.push(viewTypes.find(a => a.value === ViewTypes.Yesterday.toString())!);
        options.push(viewTypes.find(a => a.value === ViewTypes.Last7Days.toString())!);
        options.push(viewTypes.find(a => a.value === ViewTypes.LastWeek.toString())!);
        options.push(viewTypes.find(a => a.value === ViewTypes.LastMonth.toString())!);

        if (selectedReport === ReportTypes.BotReports && selectedTab !== TabTypes.PerformanceCharts) {
            options.push(viewTypes.find(a => a.value === ViewTypes.CustomDates.toString())!);
            if (selectedView === ViewTypes.MonthlyReports) {
                setSelectedView(ViewTypes.LastWeek);
                setValue('view-type', ViewTypes.Last7Days.toString());
            }
        } else if (selectedTab !== TabTypes.PerformanceCharts) {
            options.push(viewTypes.find(a => a.value === ViewTypes.MonthlyReports.toString())!);
            setSelectedEndDate(undefined);
            setSelectedEndDate(undefined);
            setValue('endDate', undefined);
            setValue('startDate', undefined);
            if (selectedView === ViewTypes.CustomDates) {
                setSelectedView(ViewTypes.LastWeek);
                setValue('view-type', ViewTypes.Last7Days.toString());
            }
        }
        setViewSelectOptions(options);
    }, [selectedReport, selectedTab]);

    const getViewTypeForDownload = () => {
        return selectedView === ViewTypes.MonthlyReports ? ViewTypes.LastMonth : selectedView;
    }

    const {isLoading: getAgentReportIsLoading, isFetching: getAgentReportIsFetching, refetch: refetchAgentData} = useQuery([GetAgentReport], () => getAgentReport(selectedView), {
        enabled: false,
        onSuccess: (data) => {
            setAgentReportData(data);
        },
        onError: () => {
            setAgentReportData([]);
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_agent_report.error'
            }));
        }
    });

    const queueReport = useQuery([GetQueueReport], () => getQueueReport(selectedView), {
        enabled: false,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_queue_report.error'
            }));
        }
    });

    const performanceChart= useQuery([GetPerformanceChart, selectedView], () => getPerformanceChart(selectedView),{
        enabled: selectedTab === TabTypes.PerformanceCharts,
        onSuccess: (data) => {
            setPerformanceChartData(data);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_queue_report.error'
            }));
        }
    });

    const botReport= useQuery<BotReport, AxiosError>([GetBotReport], () => getBotReport(selectedView, selectedStartDate, selectedEndDate),{
        enabled: false,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_bot_report.error'
            }));
        }
    });

    const systemReport = useQuery<SystemReport[], AxiosError>([GetSystemReport], () => getSystemReport(selectedView),{
        enabled: false,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_system_report.error'
            }));
        }
    });

    const {isLoading: getAvailableMonthsIsLoading, isFetching: getAvailableMonthsIsFetching, refetch: refetchAvailableMonths, data: availableMonths} = useQuery([GetQueueReport], () => getAvailableMonths(selectedReport), {
        enabled: false,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.get_queue_report.error'
            }));
        }
    });

    const exportAgentReportMutation = useMutation(exportAgentReport, {
        onSuccess: () => {
            setSelectedMonths([]);
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

    const exportQueueReportMutation = useMutation(exportQueueReport, {
        onSuccess: () => {
            setSelectedMonths([]);
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

    const exportBotReportMutation = useMutation(exportBotReport, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'reports.download_bot_report.success'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.download_bot_report.error'
            }));
        }
    });

    const exportSystemReportMutation = useMutation(exportSystemReport, {
        onSuccess: () => {
            setSelectedMonths([]);
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'reports.download_system_report.success'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'reports.download_system_report.error'
            }));
        }
    });

    const anyExportMutationActive = exportAgentReportMutation.isLoading || exportQueueReportMutation.isLoading
        || exportSystemReportMutation.isLoading || exportBotReportMutation.isLoading;

    const onSubmit = async () => {
        if (selectedReport === ReportTypes.AgentReports && selectedView !== ViewTypes.MonthlyReports) {
            await refetchAgentData();
        } else if (selectedReport === ReportTypes.QueueReports && selectedView !== ViewTypes.MonthlyReports) {
            await queueReport.refetch();
        } else if (selectedReport === ReportTypes.BotReports && selectedView !== ViewTypes.MonthlyReports) {
            await botReport.refetch();
        } else if (selectedReport === ReportTypes.SystemReports && selectedView !== ViewTypes.MonthlyReports) {
            await systemReport.refetch();
        } else if (selectedView === ViewTypes.MonthlyReports) {
            await refetchAvailableMonths();
        }
        setSelectedViewForView(selectedView);
        setSelectedReportForView(selectedReport);
        changeReportTitle();
    }

    const changeReportTitle = (isForView: boolean = false) => {
        const now = dayjs().utc();
        let reportTitle;
        if(selectedView === ViewTypes.Yesterday){
            reportTitle = (now.subtract(1, 'd').format('MMMM DD, YYYY'));
        }else if(selectedView === ViewTypes.Last7Days){
            reportTitle = (`${now.subtract(7, 'd').format('MMMM DD, YYYY')} - ${now.subtract(0, 'd').format('MMMM DD, YYYY')}`);
        }else if(selectedView === ViewTypes.LastWeek){
            reportTitle = (`${dayjs().utc().weekday(-6).format('MMMM DD, YYYY')} - ${dayjs().utc().weekday(0).format('MMMM DD, YYYY')}`);
        }else if(selectedView === ViewTypes.LastMonth){
            reportTitle = (now.subtract(1, 'M').format('MMMM, YYYY'));
        }
        if(isForView){
            setReportTitleForView(reportTitle);
        }else{
            setReportTitle(reportTitle);
        }
    }

    const onAgentReportSort = (sortField: string | undefined, sortDirection: SortDirection) => {
        if (sortField && agentReportData && agentReportData.length) {
            setOrderDate(new Date());
            setAgentReportData(agentReportData.sort(utils.dynamicSort(sortField, sortDirection)));
        }
    }

    const onDownload = () => {
        switch (selectedReport) {
            case ReportTypes.AgentReports:
                exportAgentReportMutation.mutate({
                    request: getViewTypeForDownload(),
                    selectedIds: selectedMonths
                });
                break;
            case ReportTypes.BotReports:
                exportBotReportMutation.mutate({
                    period: selectedView,
                    startDate: selectedStartDate,
                    endDate: selectedEndDate
                });
                break;
            case ReportTypes.QueueReports:
                exportQueueReportMutation.mutate({
                    request: getViewTypeForDownload(),
                    selectedIds: selectedMonths
                });
                break;
            case ReportTypes.SystemReports:
                exportSystemReportMutation.mutate({
                    request: getViewTypeForDownload(),
                    selectedIds: selectedMonths
                });
                break;
        }
    }

    const onTabChange = (tab: number) => {
        setSelectedTab(tab);
        setViewOptions(tab);
        setSelectedView(ViewTypes.Last7Days);
    }

    const setViewOptions = (tab: number) => {
        const monthlyReportsIndex = viewTypes.findIndex(a => a.label === 'reports.view_options.monthly_reports');
        if (tab === TabTypes.PerformanceCharts && monthlyReportsIndex > -1) {
            viewTypes.splice(monthlyReportsIndex, 1);
            if (selectedView === ViewTypes.MonthlyReports) {
                setSelectedView(ViewTypes.Last7Days);
                setValue('view-type', ViewTypes.Last7Days.toString());
            }
        } else {
            viewTypes.push({
                label: 'reports.view_options.monthly_reports',
                value: ViewTypes.MonthlyReports.toString()
            });
        }
    }

    const isLoading = () => {
        return getAgentReportIsLoading ||
            getAgentReportIsFetching ||
            queueReport.isLoading ||
            queueReport.isFetching ||
            getAvailableMonthsIsLoading ||
            getAvailableMonthsIsFetching ||
            botReport.isLoading ||
            botReport.isFetching ||
            performanceChart.isLoading ||
            performanceChart.isFetching ||
            systemReport.isLoading ||
            systemReport.isFetching
    }

    const onReportTypeSelected = (option?: Option) => {
        if (!!option) {
            const reportType = Number(option?.value) as ReportTypes;
            setSelectedReport(reportType);
        }
    }

    const isViewDisabled = () => {
        return selectedView === ViewTypes.CustomDates && (!selectedStartDate || !selectedEndDate);
    }

    const onSelectedViewChange = (option: ViewTypes) => {
        setSelectedView(option);
    }
    
    const settings = () => {
        return <div className='my-6'>
            {selectedViewForView === ViewTypes.MonthlyReports && <h6 className='pt-3 mb-1'>{t('reports.view_options.monthly_reports')}</h6>}
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-1 flex-col group'>
                <div className='flex flex-row mt-5 gap-8'>
                    {
                        selectedTab === TabTypes.Reports && <div className='reports-select h-14'>
                            <ControlledSelect
                                name='report-type'
                                control={control}
                                label='reports.report'
                                options={reportTypes}
                                onSelect={(option) => onReportTypeSelected(option)}
                            />
                        </div>
                    }
                    <div className='w-48 h-14'>
                        <ControlledSelect
                            name='view-type'
                            control={control}
                            label='reports.view'
                            options={viewSelectOptions}
                            onSelect={(option) => onSelectedViewChange(Number(option?.value) as ViewTypes)}
                        />
                    </div>
                    {selectedView === ViewTypes.CustomDates &&
                        <div className='flex flex-row'>
                            <div className='w-48 h-14 mr-8'>
                                <ControlledDateInput
                                    name='startDate'
                                    control={control}
                                    assistiveText='common.date_input_assistive_text'
                                    max={dayjs().add(-1, 'd').toDate()}
                                    onChange={(value) => setSelectedStartDate(value)}
                                    label='reports.start_date'
                                />
                            </div>
                            <div className='w-48 h-14'>
                                <ControlledDateInput
                                    name='endDate'
                                    assistiveText='common.date_input_assistive_text'
                                    control={control}
                                    disabled={!selectedStartDate}
                                    max={dayjs().toDate()}
                                    min={dayjs(selectedStartDate).add(1, 'd').toDate()}
                                    label='reports.end_date'
                                    onChange={(value) => setSelectedEndDate(value)}
                                />
                            </div>
                        </div>}
                    {
                        selectedTab === TabTypes.Reports && <div className='w-2/4 h-14 flex items-center'>
                            <Button label='reports.view' type='submit' buttonType='medium' data-testid='report-view-button' disabled={isViewDisabled()} />
                            {
                                selectedView !== ViewTypes.MonthlyReports && <Button data-testid='report-download-button' label='reports.download' 
                                isLoading={anyExportMutationActive} className='mx-6' buttonType='secondary-medium' icon={Icon.Download} onClick={() => onDownload()} />
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
                            (selectedReportForView === ReportTypes.AgentReports && selectedViewForView !== ViewTypes.MonthlyReports && !isLoading()) && <AgentReports title={reportTitle} data={agentReportData} onSort={onAgentReportSort} />
                        }
                        {
                            (selectedReportForView === ReportTypes.QueueReports && selectedViewForView !== ViewTypes.MonthlyReports && !isLoading()) && <QueueReports title={reportTitle} data={queueReport.data} />
                        }
                        {
                            (selectedReportForView === ReportTypes.BotReports && selectedViewForView !== ViewTypes.MonthlyReports && !isLoading()) && <BotReports title={reportTitle} data={botReport.data} />
                        }
                        {
                            (selectedReportForView === ReportTypes.SystemReports && selectedViewForView !== ViewTypes.MonthlyReports && !isLoading()) && <SystemReports title={reportTitle} data={systemReport?.data}/>
                        }
                        {
                            (selectedViewForView === ViewTypes.MonthlyReports && !isLoading()) &&
                            <MonthList data={availableMonths} setSelectedMonths={setSelectedMonths}
                                selectedMonths={selectedMonths} exportReportDownload={onDownload} isDownloading={anyExportMutationActive} />
                        }
                    </Tab>
                    <Tab key={TabTypes.PerformanceCharts} title={t('reports.performance_charts')}>
                        {settings()}
                        {
                            isLoading() && <Spinner size='large-40' className='pt-2' />
                        }
                        {
                            !isLoading() && <PerformanceCharts selectedView={selectedView} title={reportTitleForView} data={performanceChartData}/>
                        }
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
export default Reports;
