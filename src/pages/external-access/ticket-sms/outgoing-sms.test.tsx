import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import OutgoingSms from './outgoing-sms';
import { TicketMessage, UserBase, UserDetailStatus } from '@shared/models';
jest.setTimeout(70000);
describe("OutgoingSms tests", () => {
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

    it("renders OutgoingSms correctly", async () => {
        let fragment: any;
        let message = {
            fromAddress: "string",
            isRead: false,
            createdName: "string",
            createdBy: "string",
            createdByName: "string",
            createdOn: new Date("10/10/2022"),
            createdForName: "string",
            body: "string https://google.com"
        } as TicketMessage;
        let users = [
            {
                id: "string",
                firstName: "string",
                lastName: "string",
                profilePicture: "string",
                status: UserDetailStatus.Active
            }
        ] as UserBase[]
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <OutgoingSms message={message} users={users}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders OutgoingSms correctly without username", async () => {
        let fragment: any;
        let message = {
            fromAddress: "string",
            isRead: false,
            createdName: "string",
            createdBy: "string",
            createdByName: "string",
            createdOn: new Date("10/10/2022"),
            createdForName: "string",
            body: "string https://google.com"
        } as TicketMessage;
        let users = [
            {
                id: "string",
                profilePicture: "string",
                status: UserDetailStatus.Active
            }
        ] as UserBase[]
        
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <OutgoingSms message={message} users={users}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders OutgoingSms without users", async () => {
        let fragment: any;
        let message = {
            fromAddress: "string",
            isRead: false,
            createdName: "string",
            createdBy: "string",
            createdByName: "string",
            createdOn: new Date("10/10/2022"),
            createdForName: "string",
            body: "string https://google.com"
        } as TicketMessage;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <OutgoingSms message={message}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
