import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render,fireEvent,waitForElement} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailAttachment from './email-attachment';
import Router from "react-router-dom";
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Attachment tests", () => {
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

    it("renders email-attachment correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailAttachment attachment={{fileName: "s", mimeType: "s"}} messageId={"s"} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-attachment click", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailAttachment attachment={{fileName: "s", mimeType: "s"}} messageId={"s"} />
        </TestWrapper>);
        
        fireEvent.click(getByTestId("download-button"))
    });

    it("renders email-attachment mouse-over", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailAttachment attachment={{fileName: "s", mimeType: "s"}} messageId={"s"} />
        </TestWrapper>);
        
        fireEvent.mouseOver(getByTestId("download-button"))
    });

    it("renders email-attachment mouse-out", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailAttachment attachment={{fileName: "s", mimeType: "s"}} messageId={"s"} />
        </TestWrapper>);
        
        fireEvent.mouseOut(getByTestId("download-button"))
    });
})