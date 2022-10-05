import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import SmsTemplates from './sms-templates';
import Api from '@shared/services/api';
import { SMSDirection } from '@shared/models/sms-direction';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("SmsTemplates tests", () => {
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

    it("renders SmsTemplates correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <SmsTemplates/>               
        </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders SmsTemplates correctly with id with data", async () => {
        var response = {
            data: [
                {
                    id: "string1",
                    name: "string",
                    direction: SMSDirection.OneWay,
                    description: "string",
                    templateBody: "string",
                    defaultBody: "string",
                    createdByName: "string",
                    modifiedByName: "string",
                    createdOn: new Date(),
                    modifiedOn: new Date(),
                },
                {
                    id: "string2",
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
            ]
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <SmsTemplates/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("configuration.sms_templates.grid_name"));
                fireEvent.click(getByTestId("configuration.sms_templates.grid_direction"));
                fireEvent.click(getByTestId("configuration.sms_templates.grid_modified_by"));
                fireEvent.click(getByTestId("configuration.sms_templates.grid_modified_on"));
                fireEvent.click(getByTestId("id"));
                fireEvent.click(getByTestId("edit-string2"));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})