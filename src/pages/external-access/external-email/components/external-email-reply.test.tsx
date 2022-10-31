import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ExternalEmailReply from './external-email-reply';
import { ChannelTypes, EmailAttachmentHeader, EmailMessageDto, TicketMessagesDirection } from '@shared/models';
import RealtimeTicketMessageProvider from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-context';
describe("ExternalEmailReply tests", () => {
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
            }
        },
        lookupsState: {

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
        },
        externalAccessState: {
            verifyPatientState: {},
            ticketSmsState: {}
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

    it("renders ExternalEmailReply correctly sms", async () => {
        let fragment: any;
        let message = {
            id: "string",
            ccAddress: "string",
            attachments: [
                {
                    fileName: "string",
                    mimeType: "string",
                    size: 123,
                } as EmailAttachmentHeader
            ] as EmailAttachmentHeader[],
            fromAddress: "string",
            isRead: false,
            createdName: "string",
            createdBy: "string",
            createdByName: "string",
            createdOn: new Date("10/10/1995"),
            createdForName: "string",
            ticketId: "string",
            channel: ChannelTypes.Chat,
            toAddress: "string",
            recipientName: "string",
            subject: "string",
            body: "string",
            patientId: 123,
            contactId: "string",
            direction: TicketMessagesDirection.Incoming
        } as EmailMessageDto
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <RealtimeTicketMessageProvider>
                    <ExternalEmailReply message={message} setReplyMode={() => {}} setSelectedMessage={() => {}}/>
                </RealtimeTicketMessageProvider>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
