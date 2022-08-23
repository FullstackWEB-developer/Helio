import i18n from '../../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import NewEmailSearch from './new-email-search';
import Router from "react-router-dom";
import EmailProvider from '@pages/email/context/email-context';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("New Email No Search Result tests", () => {
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

    it("renders new-email-no-search-result correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <NewEmailSearch onSearchHandler={() => {}} onValueClear={() => {}}/>
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders new-email-no-search-result with value", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <NewEmailSearch onSearchHandler={() => {}} onValueClear={() => {}} value={"A"}/>
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders new-email-no-search-result clear", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <NewEmailSearch onSearchHandler={() => {}} onValueClear={() => {}} value={"A"}/>
            </EmailProvider>            
        </TestWrapper>);
        fireEvent.click(getByTestId("clear-button"))
    });
})