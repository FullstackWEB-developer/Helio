import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailNotificationList from './email-notification-list';
import Api from '@shared/services/api';
import { Router } from 'react-router';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("EmailNotificationList tests", () => {
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

    it("renders EmailNotificationList correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <EmailNotificationList/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders EmailNotificationList with id correctly", async () => {
        var response = {
            data: [{
                id: "string1",
                subject: "string",
                templateBody: "string",
                layoutName: "string",
                name: "string",
                description: "string",
                title: "string",
                defaultBody: "string",
                body: "string",
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date(),
            },{
                id: "string2",
                subject: "string",
                templateBody: "string",
                layoutName: "string",
                name: "string",
                description: "string",
                title: "string",
                defaultBody: "string",
                body: "string",
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date(),
            }]
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <EmailNotificationList/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('edit-string2'));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });

    it("renders EmailNotificationList click sort correctly", async () => {
        var response = {
            data: [{
                id: "string1",
                subject: "string",
                templateBody: "string",
                layoutName: "string",
                name: "string",
                description: "string",
                title: "string",
                defaultBody: "string",
                body: "string",
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date(),
            },{
                id: "string2",
                subject: "string",
                templateBody: "string",
                layoutName: "string",
                name: "string",
                description: "string",
                title: "string",
                defaultBody: "string",
                body: "string",
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date(),
            }]
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <EmailNotificationList/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('configuration.email_template_list.edit'));
                fireEvent.click(getByTestId('configuration.email_template_list.email_template_name'));
                fireEvent.click(getByTestId('configuration.email_template_list.email_subject'));
                fireEvent.click(getByTestId('configuration.email_template_list.email_template_modified_on'));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });

})