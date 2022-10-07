import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import AppointmentType from './appointment-type';
import { AppointmentTypeSummary } from '@pages/appointments/models/appointment-type-summary';
import Api from '@shared/services/api';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));
describe("AppointmentType tests", () => {
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

    it("renders AppointmentType correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <AppointmentType/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders AppointmentType with data correctly", async () => {
        var response = {
            data: [{
                id: "string1",
                name: "string",
                description: "string",
                existsOnEmr: false,
                isMapped: true,
                nameOnEmr: "string",
            },{
                id: "string2",
                name: "string",
                description: "string",
                existsOnEmr: false,
                isMapped: false,
                nameOnEmr: "string",
            },{
                id: "string3",
                name: "string",
                description: "string",
                existsOnEmr: true,
                isMapped: false,
                nameOnEmr: "string",
            },{
                id: "string4",
                name: "string",
                description: "string",
                existsOnEmr: true,
                isMapped: true,
                nameOnEmr: "string",
            }] as AppointmentTypeSummary[] 
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <AppointmentType/>
            </TestWrapper>);
        });
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})
