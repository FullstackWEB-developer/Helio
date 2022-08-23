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
import {agentReportTableData} from './utils/mockTestData';

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
    });

    it("renders reports correctly", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <Reports />
        </TestWrapper>);
        fireEvent.click(await getByTestId('report-type'));
        fireEvent.change(getByTestId('report-type'), { target: { value: ReportTypes.BotReports } });
        fireEvent.change(getByTestId('view-type'), { target: { value: ViewTypes.CustomDates } });
        expect(findByText(container!, 'startDate')).not.toBeNull();
        expect(findByText(container!, 'endDate')).not.toBeNull();
    });

    it("Custom Date Range should be visible on Bot Reports", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <Reports/>
        </TestWrapper>);

        fireEvent.click(getByTestId("select-cell-text-reports.report_options.bot_reports"));
        expect(findByText(container!, 'select-cell-text-reports.view_options.custom_date_range')).not.toBeNull();
    });

    it("Date boxes should be visible when custom dates are selected", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <Reports/>
        </TestWrapper>);

        fireEvent.click(await getByTestId('report-type'));
        fireEvent.change(getByTestId('report-type'), { target: { value: ReportTypes.BotReports } });
        fireEvent.change(getByTestId('view-type'), { target: { value: ViewTypes.CustomDates } });
        expect(findByText(container!, 'startDate')).not.toBeNull();
        expect(findByText(container!, 'endDate')).not.toBeNull();
    });

    it("renders agent report table on report screen", async () => {
        const tableTitle = 'Agent KPIs';
        const {findByText} = render(
            <AgentReportsTable onSort={(sortField, sortDirection) => {console.log(`Sorty by ${sortField}`)}}
                title={tableTitle} data={[]} />
        );
        expect((await findByText(tableTitle)).textContent).toBe(tableTitle);
    });

    it("renders chat tab in agent report table with correct data", async () => {
        const {findByText, findByTestId } = render(
            <TestWrapper mockState={mockState}>
                <AgentReportsTable onSort={(sortField, sortDirection) => {console.log(`Sort by ${sortField}`)}}
                    title={'Agent KPIs'} data={agentReportTableData} />
            </TestWrapper>
        );
        const chatTab = await findByText('reports.agent_reports_tabs.chat');
        chatTab.click();
        const totalChatsCell = await findByTestId('agent-rpt-total-chats');
        const  avgChatRatingCell = await findByTestId('average-chat-rating-percentage');
        expect(totalChatsCell).toBeInTheDocument();
        expect(totalChatsCell.textContent).toEqual(String(agentReportTableData[0].totalChats));
        expect(avgChatRatingCell.textContent).toEqual(`${String(agentReportTableData[0].avgChatRating)}%`);
    });
})
