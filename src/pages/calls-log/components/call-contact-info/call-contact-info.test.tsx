import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import { CallContactInfo } from './call-contact-info';
import { CommunicationDirection } from '@shared/models';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Call Contact Info tests", () => {
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

    it("renders call-contact-info correctly", async () => {
        const ticketLogModel = {
            id: "",
            ticketNumber: 123,
            assigneeUser: "Emre",
            communicationDirection: CommunicationDirection.Internal,
            originationNumber: "",
            hasManagerReview: false,
            fromUserId: "123",
            toUserId: ""
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactInfo value={ticketLogModel} type={'from'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-info to user correctly", async () => {
        const ticketLogModel = {
            id: "",
            ticketNumber: 123,
            assigneeUser: "Emre",
            communicationDirection: CommunicationDirection.Internal,
            originationNumber: "",
            hasManagerReview: false,
            fromUserId: "123",
            toUserId: "123"
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactInfo value={ticketLogModel} type={'to'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-info to witout-user correctly", async () => {
        const ticketLogModel = {
            id: "",
            ticketNumber: 123,
            assigneeUser: "Emre",
            communicationDirection: CommunicationDirection.Internal,
            originationNumber: "",
            hasManagerReview: false,
            fromUserId: "",
            toUserId: ""
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactInfo value={ticketLogModel} type={'to'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-info inbound correctly", async () => {
        const ticketLogModel = {
            id: "",
            ticketNumber: 123,
            assigneeUser: "Emre",
            communicationDirection: CommunicationDirection.Inbound,
            originationNumber: "",
            hasManagerReview: false,
            fromUserId: "123",
            toUserId: ""
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactInfo value={ticketLogModel} type={'from'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-info to-outbound correctly", async () => {
        const ticketLogModel = {
            id: "",
            ticketNumber: 123,
            assigneeUser: "Emre",
            communicationDirection: CommunicationDirection.Outbound,
            originationNumber: "",
            hasManagerReview: false,
            fromUserId: "123",
            toUserId: ""
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactInfo value={ticketLogModel} type={'to'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders call-contact-info to-inbound correctly", async () => {
        const ticketLogModel = {
            id: "",
            ticketNumber: 123,
            assigneeUser: "Emre",
            communicationDirection: CommunicationDirection.Inbound,
            originationNumber: "",
            hasManagerReview: false,
            fromUserId: "123",
            toUserId: ""
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CallContactInfo value={ticketLogModel} type={'to'}/>           
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})