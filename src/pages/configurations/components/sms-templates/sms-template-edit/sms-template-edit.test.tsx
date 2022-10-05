import i18n from '../../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, screen, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import SmsTemplateEdit from './sms-template-edit';
import Router from "react-router";
import Api from '@shared/services/api';
import { SMSDirection } from '@shared/models/sms-direction';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("SmsTemplateEdit tests", () => {
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

    it("renders SmsTemplateEdit correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: undefined })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <SmsTemplateEdit/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders SmsTemplateEdit correctly with id & data", async () => {
        var response = {
            data: {
                id: "string",
                name: "string",
                direction: SMSDirection.OneWay,
                description: "string",
                templateBody: "string",
                defaultBody: "string",
                createdByName: "string",
                modifiedByName: "string",
                createdOn: new Date(),
                modifiedOn: new Date(),
            }
        }
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "1" })
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <SmsTemplateEdit/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("reset"));
                fireEvent.click(getByTestId("cancel"));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });

    it("renders SmsTemplateEdit correctly with id with data", async () => {
        var response = {
            data: {
                id: "string",
                name: "string",
                direction: SMSDirection.OneWay,
                description: "string",
                templateBody: "string",
                defaultBody: "string",
                createdByName: "string",
                modifiedByName: "string",
                createdOn: new Date(),
                modifiedOn: new Date(),
            }
        }
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "1" })
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <SmsTemplateEdit/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.input(getByTestId("templateBody"),{
                    target: {
                        value: "test"
                    }
                });
                fireEvent.submit(getByTestId("submit"));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})