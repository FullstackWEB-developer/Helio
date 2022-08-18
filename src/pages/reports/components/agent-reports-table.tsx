import { useTranslation } from 'react-i18next';
import { AgentReport } from '../models/agent-report.model';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import { useAgentReportsTableModel } from '../utils/get-agent-reports-table-models';
import { useState } from 'react';
import Tabs, { Tab } from '@components/tab';
import { SortDirection } from '@shared/models/sort-direction';
import { AgentReportTableType } from '@shared/models/agent-report-table-type.enum';

export interface AgentReportsTableProps {
    data: AgentReport[],
    title: string,
    onSort: (sortField: string | undefined, sortDirection: SortDirection) => void
}

const AgentReportsTable = ({data, title, onSort}: AgentReportsTableProps) => {
    const {t} = useTranslation();
    const [tableType, setTableType] = useState<AgentReportTableType>(AgentReportTableType.VoiceAndChat);
    const tableModel = useAgentReportsTableModel({data: data, type: tableType, onSort: onSort}) as TableModel;
    const changeTableType = (index: number) => {
        switch(index){
            case 0:
                setTableType(AgentReportTableType.VoiceAndChat);
                break;
            case 1:
                setTableType(AgentReportTableType.Voice);
                break;
            case 2:
                setTableType(AgentReportTableType.Chat);
                break;
            case 3:
                setTableType(AgentReportTableType.Tickets);
                break;
        }
    }
    return (
        <div className='mt-6 pt-4 bg-white rounded-lg'>
            <div className='px-6 flex border-b'>
                <div className='h7 w-5/24'>{t(title)}</div>
                <div>
                    <Tabs onSelect={(selectedTabIndex) => {changeTableType(selectedTabIndex)}} hasBorder={false}>
                        <Tab title={t('reports.agent_reports_tabs.voice_and_chat')}><span/></Tab>
                        <Tab title={t('reports.agent_reports_tabs.voice')}><span/></Tab>
                        <Tab title={t('reports.agent_reports_tabs.chat')}><span/></Tab>
                        <Tab title={t('reports.agent_reports_tabs.tickets')}><span/></Tab>
                    </Tabs>
                </div>
            </div>
            {
                data && data.length > 0 ? <Table model={tableModel} /> : <div className='w-full h-72 px-6 space-y-4 horizontal-statistic-widget-body justify-center items-center flex'>{t('dashboard.no_data_found')}</div>
            }
        </div>
    );
}

export default AgentReportsTable;
