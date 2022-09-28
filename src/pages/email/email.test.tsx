import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import Email from './email';
import Router from "react-router-dom";
import EmailProvider from '@pages/email/context/email-context';
import {NEW_EMAIL} from '@pages/email/constants';
import MockDate from 'mockdate';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email tests", () => {
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
        }
    };

    beforeEach(async () => {
        await i18n.init();
        dayjs.extend(duration);
        dayjs.extend(utc);
        dayjs.extend(customParseFormat);
        MockDate.set(dayjs('2018-04-04T16:00:00.000Z').toDate());
        container = document.createElement("div");
        document.body.appendChild(container);

    });

    afterEach(() => {
        if (container) {
            unmountComponentAtNode(container);
            container.remove();
            container = null;
        }
        MockDate.reset();
    });

    it("renders email correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <Email/>
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders new-email with ticketId correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ ticketId: NEW_EMAIL })
        jest.spyOn(Router, 'useParams').mockReturnValue({ ticketId: NEW_EMAIL })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <Email/>
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
