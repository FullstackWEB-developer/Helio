import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ExternalEmailRealTimeProcessor from './external-email-real-time-processor';
import { ChannelTypes, EmailAttachmentHeader, EmailMessageDto, TicketMessagesDirection } from '@shared/models';
import { VerifiedPatient } from '@pages/patients/models/verified-patient';
import { RedirectLink } from '../verify-patient/models/redirect-link';
import { ExternalAccessRequestTypes } from '../models/external-updates-request-types.enum';
import { RequestChannel } from '@shared/models/request.channel.enum';
describe("ExternalEmailRealTimeProcessor tests", () => {
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
            verifyPatientState: {
                redirectLink: {
                    attributes: {},
                    fullUrl: "string",
                    linkCreationDate: new Date("10/10/2022"),
                    linkId: "string",
                    patientId: "string",
                    requestChannel: RequestChannel.Chat,
                    requestType: ExternalAccessRequestTypes.AppointmentConfirmation,
                    ticketId: "string",
                    sentAddress: "string",
                    redirectAfterVerification: "string"
                } as RedirectLink
            },
            ticketSmsState: {},
            externalEmailState: {
                emails: [
                    {
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
                ] as EmailMessageDto[]
            }
        },
        patientsState: {
            verifiedPatient: {
                firstName: "string",
                lastName: "string",
                patientId: 123,
                primaryProviderId: 123,
                departmentId: 123,
                defaultProviderId: 123,
                defaultDepartmentId: 123,
                dateOfBirth: new Date("10/10/1995"),
                token: "string",
                tokenExpiration: new Date("10/10/2023"),
            } as VerifiedPatient
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

    it("renders ExternalEmailRealTimeProcessor correctly sms", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                    <ExternalEmailRealTimeProcessor/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
