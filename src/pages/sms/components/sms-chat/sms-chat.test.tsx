import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react';
import {SmsChat} from '@pages/sms/components';
import {TicketMessage, TicketMessageSummary, TicketType} from '@shared/models';
import TestWrapper from '@shared/test-utils/test-wrapper';
import api from '@shared/services/api';

describe("Sms-Chat tests", () => {
    let container: HTMLDivElement | null;
    const info: TicketMessageSummary = {
        ticketId: '123',
        createdForEndpoint:'8884441122',
        createdForName:'Patient1',
        reason:'sms',
        messageCreatedOn: dayjs('2022-01-25').toDate(),
        unreadCount:1,
        ticketType: TicketType.Default,
        messageSummary: 'Summary',
        messageCreatedByName:'Agent',
        ticketNumber: 220125010101,
    };
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

    it("renders sms-chat correctly", async () => {

        const messages: TicketMessage[] = [];
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <SmsChat
                info={info}
                isLoading={false}
                isBottomFocus={false}
                isSending={false}
                lastMessageSendTime={dayjs('2022-01-25').toDate()}
                messages={messages}
                onSendClick={() =>{}}
            />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("should get patient data if there is patientId", async () => {
        const messages: TicketMessage[] = [];
        const patientId = 75086;
        const infoWithPatientId = {
            ...info,
            patientId
        }
        const spy = jest.spyOn(api, 'get');
        render(<TestWrapper mockState={mockState}>
            <SmsChat
                info={infoWithPatientId}
                isLoading={false}
                isBottomFocus={false}
                isSending={false}
                lastMessageSendTime={dayjs('2022-01-25').toDate()}
                messages={messages}
                onSendClick={() =>{}}
            />
        </TestWrapper>);

        expect(spy).toHaveBeenCalledTimes(7);
        expect(spy.mock.calls).toEqual([["/lookups/values/TicketReason"],
            ["/tickets/lookup/TicketType"],
            ["/patients/75086", {"params": undefined}],
            ["/patients/75086/photo"],
            ["/tickets/123"],
            ["/lookups/values/TicketReason"],
            ["/tickets/lookup/TicketType"]]);
    });

    it("should get contact data if there is contact id", async () => {
        const messages: TicketMessage[] = [];
        const contactId = '12313';
        const infoWithPatientId = {
            ...info,
            contactId
        }
        const spy = jest.spyOn(api, 'get');
        render(<TestWrapper mockState={mockState}>
            <SmsChat
                info={infoWithPatientId}
                isLoading={false}
                isBottomFocus={false}
                isSending={false}
                lastMessageSendTime={dayjs('2022-01-25').toDate()}
                messages={messages}
                onSendClick={() =>{}}
            />
        </TestWrapper>);

        expect(spy).toHaveBeenCalledTimes(6);
        expect(spy.mock.calls).toEqual([["/lookups/values/TicketReason"],
            ["/tickets/lookup/TicketType"],
            ["/contacts/12313"],
            ["/tickets/123"],
            ["/lookups/values/TicketReason"],
            ["/tickets/lookup/TicketType"]]);
    });
})
