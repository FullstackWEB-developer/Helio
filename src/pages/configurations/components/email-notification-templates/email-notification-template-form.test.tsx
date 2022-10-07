import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailNotificationTemplateForm from './email-notification-template-form';
import { EmailTemplate } from '@pages/configurations/models/email-template';
import Api from '@shared/services/api';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("EmailNotificationTemplateForm tests", () => {
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

    it("renders EmailNotificationTemplateForm correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <EmailNotificationTemplateForm template={{
                    id: "",
                    subject: "",
                    templateBody: "",
                    layoutName: "",
                    name: "",
                    description: "",
                    title: "",
                    defaultBody: "",
                    body: "",
                    createdByName: "",
                    createdOn: new Date('2022-09-20'),
                    modifiedByName: ""
                } as EmailTemplate}/>      
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders EmailNotificationDetails with id correctly", async () => {
        jest.spyOn(Api, 'get').mockResolvedValue("Test");
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <EmailNotificationTemplateForm template={{
                    id: "",
                    subject: "",
                    templateBody: "",
                    layoutName: "",
                    name: "",
                    description: "",
                    title: "",
                    defaultBody: "",
                    body: "",
                    createdByName: "",
                    createdOn: new Date('2022-09-20'),
                    modifiedByName: ""
                } as EmailTemplate}/>            
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('configuration.email_template_details.preview'));
                fireEvent.click(getByTestId('configuration.email_template_details.cancel'));
                fireEvent.click(getByTestId('configuration.email_template_details.reset_to_default'));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(0);
    });
})
