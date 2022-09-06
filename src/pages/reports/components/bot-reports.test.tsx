import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import BotReports from '@pages/reports/components/bot-reports';
import {BotReport} from '@pages/reports/models/bot-report.model';
import {TicketRate} from '@pages/reports/models/ticket-rate.enum';
import i18n from '../../../i18nForTests';

describe("Bot Report tests", () => {
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

    it("renders bot reports correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <BotReports/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders bot reports correctly with data", async () => {
        const botReport: BotReport = {
            medicalHistoryRequests: 3,
            testResultsRequests: 4,
            patientsRegistered:2,
            medicationRefillRequests:4
            ,appointmentsInformationRequests:5,
            appointmentsCanceled:2,
            appointmentsRescheduled:4,
            appointmentsScheduled:4,
            chatRating: TicketRate.Positive,
            averageChatDuration:5,
            totalChats:5,
            voiceRating:TicketRate.Negative,
            averageVoiceDuration:6,
            totalCalls:6
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <BotReports data={botReport} title='Bot Report'/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

})
