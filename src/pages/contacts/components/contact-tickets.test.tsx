import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ContactTickets from './contact-tickets';
import Api from '@shared/services/api';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {ChannelTypes, TicketType} from '@shared/models';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("ContactTickets tests", () => {
    let container: HTMLDivElement | null;
    const mockState = {
        emailState: {
            unreadEmails: 0,
            messageSummaries: []
        },
        appUserState: {
            liveAgentStatuses: [],
            appUserDetails: {
                id: ""
            },
            auth: {
                name: "Test"
            }
        },
        lookupsState: {

        },
        ticketState: {
            lookupValues: [{
                label: "Test",
                parentValue: "Test"
            },{
                label: "Test",
                parentValue: "Test"
            }]
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        ccpState: {
            chatCounter: 1,
            voiceCounter: 2
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

    it("renders ContactTickets isDanger true correctly", async () => {
        jest.spyOn(Api, 'get').mockReturnValue({
            data: {
                pageSize: 1,
                page: 1,
                totalCount: 10,
                totalPages: 10,
                results: [
                    {
                        contactId: '123',
                        id:'123',
                        channel: ChannelTypes.Chat,
                        type: TicketType.BusinessOffice,
                        createdBy: 'burak',
                        createdForName: 'burak',
                        reason: 'reason',
                        subject: 'subject',
                        ticketNumber: 3
                    }
                ] as TicketBase[]
            }
        } as any);
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ContactTickets contactId='123'/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
