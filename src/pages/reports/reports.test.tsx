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
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <Reports/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
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
})
