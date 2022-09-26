import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {findByText, fireEvent, render} from '@testing-library/react';
import Reports from '@pages/reports/reports';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {ReportTypes} from '@pages/reports/models/report-types.enum';
import {ViewTypes} from '@pages/reports/models/view-types.enum';
import AgentReportsTable from './components/agent-reports-table';
import {agentReportTableData, systemReportData} from './utils/mockTestData';
import Api from '@shared/services/api';
import {act} from 'react-dom/test-utils';
import {MimeTypes} from '@shared/models/mime-types.enum';
import utils from '@shared/utils/utils';
import SystemReportTable from './components/system-reports-table';

describe("Reports tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        ticketState: {
            lookupValues: [],
            enumValues: [
                {
                    TicketType: []
                },
                {
                    TicketReason: []
                }
            ]
        },
        appUserState: {
            liveAgentStatuses: []
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        lookupsState: {
            allProviderList: [],
            providerList: [],
            userList: [
                {
                    "id": "28680cab-766e-41dd-a986-89fc09d062ab",
                    "firstName": "Amir",
                    "lastName": "Lisovac"
                }
            ]
        }
    };

    beforeEach(async () => {
        await i18n.init();
        dayjs.extend(duration);
        dayjs.extend(utc);
        dayjs.extend(customParseFormat);
        container = document.createElement("div");
        document.body.appendChild(container);

    });

    afterEach(() => {
        if (container) {
            unmountComponentAtNode(container);
            container.remove();
            container = null;
        }
        jest.clearAllMocks();
    });

    it.skip("renders date boxes on bot reports when custom dates is selected", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <Reports />
        </TestWrapper>);
        fireEvent.click(await getByTestId('report-type'));
        fireEvent.change(getByTestId('report-type'), {target: {value: ReportTypes.BotReports}});
        fireEvent.change(getByTestId('view-type'), {target: {value: ViewTypes.CustomDates}});
        expect(findByText(container!, 'startDate')).not.toBeNull();
        expect(findByText(container!, 'endDate')).not.toBeNull();
    });

    it.skip("Custom Date Range should be visible on Bot Reports", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <Reports />
        </TestWrapper>);

        fireEvent.click(getByTestId("select-cell-text-reports.report_options.bot_reports"));
        expect(findByText(container!, 'select-cell-text-reports.view_options.custom_date_range')).not.toBeNull();
    });

    it.skip("Date boxes should be visible when custom dates are selected", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <Reports />
        </TestWrapper>);

        fireEvent.click(await getByTestId('report-type'));
        fireEvent.change(getByTestId('report-type'), {target: {value: ReportTypes.BotReports}});
        fireEvent.change(getByTestId('view-type'), {target: {value: ViewTypes.CustomDates}});
        expect(findByText(container!, 'startDate')).not.toBeNull();
        expect(findByText(container!, 'endDate')).not.toBeNull();
    });

    it.skip("renders agent report table on report screen", async () => {
        const tableTitle = 'Agent KPIs';
        const {findByText} = render(
            <AgentReportsTable onSort={() => { }}
                title={tableTitle} data={[]} />
        );
        expect((await findByText(tableTitle)).textContent).toBe(tableTitle);
    });

    it.skip("renders chat tab in agent report table with correct data", async () => {
        const {findByText, findByTestId} = render(
            <TestWrapper mockState={mockState}>
                <AgentReportsTable onSort={() => { }}
                    title={'Agent KPIs'} data={agentReportTableData} />
            </TestWrapper>
        );
        const chatTab = await findByText('reports.agent_reports_tabs.chat');
        chatTab.click();
        const totalChatsCell = await findByTestId('agent-rpt-total-chats');
        const avgChatRatingCell = await findByTestId('average-chat-rating-percentage');
        expect(totalChatsCell).toBeInTheDocument();
        expect(totalChatsCell.textContent).toEqual(String(agentReportTableData[0].totalChats));
        expect(avgChatRatingCell.textContent).toEqual(`${String(agentReportTableData[0].avgChatRating)}%`);
    });

    it.skip("Should call system report service on view clicked", async () => {

        jest.spyOn(Api, 'get').mockResolvedValue([]);

        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <Reports />
            </TestWrapper>);
            fireEvent.click(await getByTestId('report-type'));
            fireEvent.click(await getByTestId('select-cell-text-reports.report_options.system_reports'));

            fireEvent.click(await getByTestId('view-type'));
            fireEvent.click(await getByTestId('select-cell-text-reports.view_options.last_7_days'));

            const button = await getByTestId('report-view-button');
            fireEvent.click(button);
        });

        expect(Api.get).toHaveBeenCalled();
    });

    it.skip("Should call system report download service on download clicked", async () => {
        global.URL.createObjectURL = jest.fn();
        global.URL.revokeObjectURL = jest.fn();
        const blob = new Blob(["testing"], {type: MimeTypes.XlsX});
        jest.spyOn(Api, 'get').mockResolvedValue(blob);

        jest.spyOn(utils, 'downloadFileFromData').mockImplementation(() => { });
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <Reports />
            </TestWrapper>);
            fireEvent.click(await getByTestId('report-type'));
            fireEvent.click(await getByTestId('select-cell-text-reports.report_options.system_reports'));

            fireEvent.click(await getByTestId('view-type'));
            fireEvent.click(await getByTestId('select-cell-text-reports.view_options.last_7_days'));

            const button = await getByTestId('report-download-button');
            fireEvent.click(button);
        });

        expect(Api.get).toHaveBeenCalled();

    });

    it.skip("renders tickets tab in agent report table with correct data", async () => {
        const {findByText, findByTestId} = render(
            <TestWrapper mockState={mockState}>
                <AgentReportsTable onSort={() => { }}
                    title={'Agent KPIs'} data={agentReportTableData} />
            </TestWrapper>
        );
        const ticketsTab = await findByText('reports.agent_reports_tabs.tickets');
        ticketsTab.click();
        const totalTicketsCountCell = await findByTestId('agent-rpt-total-tickets');
        expect(totalTicketsCountCell).toBeInTheDocument();
        expect(totalTicketsCountCell.textContent).toEqual(String(agentReportTableData[0].totalTicketsCount));
    });

    it.skip("should render system report grid", async () => {
        const {findByTestId} = render(<TestWrapper mockState={mockState}>
            <SystemReportTable data={systemReportData} />
        </TestWrapper>);
        const table = await findByTestId("system-report-grid");
        expect(table).toBeInTheDocument();
    });
})
