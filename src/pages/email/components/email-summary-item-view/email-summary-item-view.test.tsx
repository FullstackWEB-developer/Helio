import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailSummaryItemView from './email-summary-item-view';
import Router from "react-router-dom";
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("EmailSummaryItemView tests", () => {
    let container: HTMLDivElement | null;
    const mockState = {
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

    it("renders email-summary-item-view today", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailSummaryItemView emailInfo={{
                ticketId: "1",
                ticketNumber: 12,
                ticketType: 1,
                reason: "",
                messageSummary: "",
                unreadCount: 1,
                messageCreatedOn: dayjs('2010-01-01').toDate(),
                messageCreatedByName: "",
                createdForName: "",
                createdForEndpoint: "",
            }} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-summary-item-view this year", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let date = dayjs('2022-01-01').toDate();
        date.setDate(date.getDate() - 2)
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailSummaryItemView emailInfo={{
                ticketId: "1",
                ticketNumber: 12,
                ticketType: 1,
                reason: "",
                messageSummary: "",
                unreadCount: 1,
                messageCreatedOn: date,
                messageCreatedByName: "",
                createdForName: "",
                createdForEndpoint: "",
            }} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-summary-item-view last year", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        Date.now = jest.fn(() => new Date(Date.UTC(2017, 7, 9, 8)).valueOf())

        let date = dayjs('2022-01-01').toDate();
        date.setDate(date.getDate() - 368)
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailSummaryItemView emailInfo={{
                ticketId: "1",
                ticketNumber: 12,
                ticketType: 1,
                reason: "",
                messageSummary: "",
                unreadCount: 1,
                messageCreatedOn: date,
                messageCreatedByName: "",
                createdForName: "A",
                createdForEndpoint: "",
            }} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-summary-item-view email-summary-item-view click", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let date = dayjs('2022-01-01').toDate();
        date.setDate(date.getDate() - 368)
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailSummaryItemView emailInfo={{
                ticketId: "1",
                ticketNumber: 12,
                ticketType: 1,
                reason: "",
                messageSummary: "",
                unreadCount: 1,
                messageCreatedOn: date,
                messageCreatedByName: "",
                createdForName: "A",
                createdForEndpoint: "",
            }} />
        </TestWrapper>);
        fireEvent.click(getByTestId("email-summary-item-view"))
    });
})
