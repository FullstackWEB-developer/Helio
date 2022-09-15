import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import CallLogFilter from './call-log-filter';
import CallsLogProvider  from '@pages/calls-log/context/calls-log-context';
import { TicketLookupValue } from '@pages/tickets/models/ticket-lookup-values.model';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Call Log Filter tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        emailState: {
            unreadEmails: 0,
            messageSummaries: []
        },
        appUserState: {
            liveAgentStatuses: [],
            appUserDetails: {
                
            }
        },
        lookupsState: {
            userList: [{
                id: "123",
                firstName: "Emre",
                lastName: "Hanci",
            }]
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        callsLogState: {
            isFiltered: false
        },
        ticketState: {
            lookupValues: []
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

    it("renders call-log-filter correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <CallsLogProvider>
                <CallLogFilter value={null} isOpen={true} logType={'Call'} isCallTypeHide={true} onSubmit={() => {}}/>           
            </CallsLogProvider>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders chat-log-filter correctly", async () => {
        const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
            <CallsLogProvider>
                <CallLogFilter value={null} isOpen={true} logType={'Chat'} isCallTypeHide={true} onSubmit={() => {}}/>           
            </CallsLogProvider>
        </TestWrapper>);
        fireEvent.click(getByTestId("reset-all-button"))
        expect(asFragment()).toMatchSnapshot();
    });
})