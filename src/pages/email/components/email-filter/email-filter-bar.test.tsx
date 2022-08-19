import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitForElement} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailFilterBar from './email-filter-bar';
import Router from "react-router-dom";
import {EmailQueryType} from '@pages/email/models/email-query-type';
import {EmailFilterModel} from '@pages/email/components/email-filter/email-filter.model';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Filter Bar tests", () => {
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

    it("renders email-filter-bar correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let filter = {
            assignedTo: '',
            timePeriod: ''
        }
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailFilterBar
                isFilterVisible={true}
                setFilterVisible={() => {}}
                emailQueryType={EmailQueryType.MyEmail}
                filter={filter}
                onSearchTermChanged={() => {}}
                onFilterClick={() => {}}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("email-filter-bar new-email", async () => {
        let filter = {
            assignedTo: '',
            timePeriod: ''
        }

        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailFilterBar
                isFilterVisible={false}
                setFilterVisible={() => {}}
                emailQueryType={EmailQueryType.MyEmail}
                filter={filter}
                onSearchTermChanged={() => {}}
                onFilterClick={() => {}}/>
        </TestWrapper>);
        
        fireEvent.click(getByTestId("new-email"))
    });

    it("email-filter-bar time-period", async () => {
        let filter = {
            assignedTo: '',
            fromDate: new Date(),
            toDate: new Date(),
            timePeriod: '3'
        }

        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailFilterBar
                isFilterVisible={false}
                setFilterVisible={() => {}}
                emailQueryType={EmailQueryType.MyEmail}
                filter={filter}
                onSearchTermChanged={() => {}}
                onFilterClick={() => {}}/>
        </TestWrapper>);
        
        fireEvent.click(getByTestId("new-email"))
    });
})