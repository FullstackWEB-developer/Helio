import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailSummaryList from './email-summary-list';
import Router from "react-router-dom";
import EmailProvider from '@pages/email/context/email-context';
import MockDate from 'mockdate';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Summary List tests", () => {
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
        }
    };

    beforeEach(async () => {
        await i18n.init();
        MockDate.set(dayjs('2018-04-04T16:00:00.000Z').toDate());
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
        MockDate.reset();
    });

    it("renders email-summary-list correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <EmailSummaryList onScroll={() => {}} isFetchingNextPage={false}/>
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-summary-list with messages", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let date = new Date();
        date.setDate(date.getDate() - 368)
        let mockStateMessage = {
            emailState: {
                unreadEmails: 0,
                messageSummaries: [{
                    ticketId: "",
                    ticketNumber: 2,
                    ticketType: 5,
                    reason: "",
                    messageSummary: "",
                    unreadCount: 2,
                    messageCreatedOn: date,
                    messageCreatedByName: "Test",
                    createdForName: "Test",
                    createdForEndpoint: "Test"
                }]
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
        const {asFragment} = render(<TestWrapper mockState={mockStateMessage}>
            <EmailProvider>
                <EmailSummaryList onScroll={() => {}} isFetchingNextPage={false}/>
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
