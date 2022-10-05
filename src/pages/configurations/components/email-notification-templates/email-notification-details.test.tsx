import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailNotificationDetails from './email-notification-details';
import Router from "react-router";
import { act } from 'react-dom/test-utils';
import Api from '@shared/services/api';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("EmailNotificationDetails tests", () => {
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

    it("renders EmailNotificationDetails without id correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: undefined })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <EmailNotificationDetails/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders EmailNotificationDetails with id correctly", async () => {
        var response = {
            id: "string",
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
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "1" })
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <EmailNotificationDetails/>          
            </TestWrapper>);
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });

    it("renders EmailNotificationDetails with id without data correctly", async () => {
        jest.spyOn(Api, 'get').mockResolvedValue(null);
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "1" })
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <EmailNotificationDetails/>          
            </TestWrapper>);
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})