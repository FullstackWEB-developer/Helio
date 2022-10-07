import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import CallContactAgentInfo from './call-contact-agent-info';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Call Contact Agent Info tests", () => {
    let container: HTMLDivElement | null;
    const mockState = {
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

    it("renders call-contact-agent-info correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactAgentInfo agentId={"123"} type={'CHAT'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-agent-info-without-user correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactAgentInfo agentId={"1234"} type={'CHAT'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-agent-info-without-agent correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactAgentInfo type={'CHAT'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-agent-info-without-agent-voice correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactAgentInfo type={'VOICE'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-agent-info-without-user-name correctly", async () => {
        const mockState = {
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
                    id: "123"
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
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactAgentInfo agentId={"123"} type={'CHAT'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
