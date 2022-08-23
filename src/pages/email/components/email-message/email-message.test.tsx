import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailMessage from './email-message';
import Router from "react-router-dom";
import EmailProvider from '@pages/email/context/email-context';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Message tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        emailState: {
            unreadEmails: 0
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

    it("renders email-message correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
            <EmailMessage
                key={1}
                index={1}
                emailCount={2}
                message={{
                    id: "",
                    ccAddress: "",
                    attachments: [],
                    toAddress: "Test;@a.com",
                    fromAddress: "",
                    isRead: false,
                    ticketId: "1234",
                    channel: 0,
                    body: "",
                    direction: 0
                }}
                ticketCreatedForName={''}
                ticketHeaderPhoto={''}
                />
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-message collapse-handler", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
            <EmailMessage
                key={1}
                index={1}
                emailCount={2}
                message={{
                    id: "",
                    ccAddress: "",
                    attachments: [],
                    toAddress: "Test;@a.com",
                    fromAddress: "",
                    isRead: false,
                    ticketId: "1234",
                    channel: 0,
                    body: "",
                    direction: 0
                }}
                ticketCreatedForName={''}
                ticketHeaderPhoto={''}
                />
            </EmailProvider>            
        </TestWrapper>);
        fireEvent.click(getByTestId("collapse-handler"))
        fireEvent.click(getByTestId("collapse-handler"))
    });
})