import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailMessageHeader from './email-message-header';
import Router from "react-router-dom";
import EmailProvider from '@pages/email/context/email-context';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Send First Email tests", () => {
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

    it("renders email-message-header correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <EmailMessageHeader
                    messageId={""}
                    attachments={[]}
                    collapseHandler={() => {}}
                    collapsedBody={false}
                    displaySplitMessageMenu={false}
                    date={new Date()}
                    from={""}
                    fromPhoto={"test"}
                    subject={""}
                />
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-message-header collapse-handler", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <EmailMessageHeader
                    messageId={""}
                    attachments={[]}
                    collapseHandler={() => {}}
                    collapsedBody={false}
                    displaySplitMessageMenu={false}
                    date={new Date()}
                    from={""}
                    fromPhoto={"test"}
                    subject={""}
                />
            </EmailProvider>            
        </TestWrapper>);
        
        fireEvent.click(getByTestId("collapse-handler"))
    });

    it("renders email-message-header download-all", async () => {
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <EmailMessageHeader
                    messageId={""}
                    attachments={[{
                        fileName: "string",
                        mimeType: "string"
                    }]}
                    collapseHandler={() => {}}
                    collapsedBody={false}
                    displaySplitMessageMenu={false}
                    date={new Date()}
                    from={""}
                    fromPhoto={"test"}
                    subject={""}
                />
            </EmailProvider>            
        </TestWrapper>);
        
        fireEvent.click(getByTestId("download-all"))
    });
})
