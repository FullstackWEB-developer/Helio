import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ChatLogList from './chat-log-list';
import ChatLogListWithProvider from './chat-log-list-with-provider';
import Api from '@shared/services/api';
import { TicketLogModel } from '@shared/models/ticket-log.model';
import { CommunicationDirection, PagedList } from '@shared/models';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Chat tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        emailState: {
            unreadEmails: 0,
            messageSummaries: []
        },
        appUserState: {
            liveAgentStatuses: [],
            appUserDetails: {
                id: ""
            }
        },
        lookupsState: {

        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        chatLogState: {
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

    it("renders chat-log-list correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ChatLogListWithProvider />            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders chat-log-list with data correctly", async () => {
        var response = {
            page: 1,
            pageSize: 10,
            totalPages: 201,
            totalCount: 2008,
            results: [
                {
                    id: "ac786acf-93b1-4222-9fe0-ac4ad196e3fa",
                    contactId: null,
                    patientId: null,
                    ticketNumber: "2209160024",
                    createdForName: "Test",
                    assigneeUser: null,
                    assigneeFullName: null,
                    createdOn: "2022-09-16T10:11:20.638961",
                    agentInteractionDuration: null,
                    contactStatus: null,
                    recordedConversationLink: null,
                    botRating: null,
                    communicationDirection: 1 as CommunicationDirection,
                    contactAgent: null,
                    originationNumber: null,
                    contactDisconnectTimestamp: null,
                    contactInitiationTimestamp: null,
                    hasManagerReview: false,
                    patientRating: null,
                    fromUserId: null,
                    toUserId: null,
                    connectEvents: []
                },
                {
                    id: "ac786acf-93b1-4222-9fe0-ac4ad196e3fa",
                    contactId: null,
                    patientId: null,
                    ticketNumber: "2209160024",
                    createdForName: "Test",
                    assigneeUser: null,
                    assigneeFullName: null,
                    createdOn: "2022-09-16T10:11:20.638961",
                    agentInteractionDuration: null,
                    contactStatus: null,
                    recordedConversationLink: null,
                    botRating: null,
                    communicationDirection: 1 as CommunicationDirection,
                    contactAgent: null,
                    originationNumber: null,
                    contactDisconnectTimestamp: null,
                    contactInitiationTimestamp: null,
                    hasManagerReview: false,
                    patientRating: null,
                    fromUserId: null,
                    toUserId: null,
                    connectEvents: []
                }
            ],
            skipToken: null
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response.results);
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <ChatLogListWithProvider />
            </TestWrapper>);
        });

        expect(Api.get).toHaveBeenCalledTimes(2);
    });
})