import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ExternalEmailListItem from './external-email-list-item';
import { ChannelTypes, EmailAttachmentHeader, EmailMessageDto, TicketMessagesDirection } from '@shared/models';
jest.setTimeout(70000);
describe("ExternalEmailListItem tests", () => {
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

    it("renders ExternalEmailListItem Incoming correctly sms", async () => {
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
                    <ExternalEmailListItem message={message} onClick={() => {}}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ExternalEmailListItem Incoming with patient photo correctly sms", async () => {
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
                    <ExternalEmailListItem message={message} onClick={() => {}} patientPhoto={"Test"}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ExternalEmailListItem neither incoming nor outgoin", async () => {
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
            ticketId: "string",
            channel: ChannelTypes.Chat,
            toAddress: "string",
            recipientName: "string",
            subject: "string",
            body: "string",
            patientId: 123,
            contactId: "string"
        } as EmailMessageDto
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                    <ExternalEmailListItem message={message} onClick={() => {}}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ExternalEmailListItem Outgoing correctly sms", async () => {
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
            direction: TicketMessagesDirection.Outgoing
        } as EmailMessageDto
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                    <ExternalEmailListItem message={message} onClick={() => {}}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
