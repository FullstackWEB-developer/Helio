import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render,waitForElement,fireEvent} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailFilter from './email-filter';
import Router from "react-router-dom";
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Filter tests", () => {
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

    it("renders email-filter correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailFilter/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-filter isUserFilterEnabled", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailFilter isUserFilterEnabled={true}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-filter timePeriod_3", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailFilter isUserFilterEnabled={true}/>
        </TestWrapper>);
        
        fireEvent.click(getByTestId("timePeriod_3"))
        fireEvent.click(getByTestId("apply-button"))
    });

    it("renders email-filter timePeriod_2", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailFilter isUserFilterEnabled={true}/>
        </TestWrapper>);
        
        fireEvent.click(getByTestId("timePeriod_2"))
        fireEvent.click(getByTestId("apply-button"))
    });

    it("renders email-filter timePeriod_1", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailFilter isUserFilterEnabled={true}/>
        </TestWrapper>);
        
        fireEvent.click(getByTestId("timePeriod_1"))
        fireEvent.click(getByTestId("apply-button"))
    });

    it("renders email-filter timePeriod_0", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailFilter isUserFilterEnabled={true}/>
        </TestWrapper>);
        
        fireEvent.click(getByTestId("timePeriod_0"))
        fireEvent.click(getByTestId("apply-button"))
    });

    it("renders email-filter reset-all-button", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailFilter isUserFilterEnabled={true}/>
        </TestWrapper>);
        
        fireEvent.click(getByTestId("reset-all-button"))
    });
})