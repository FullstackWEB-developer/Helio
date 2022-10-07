import i18n from '../../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EditAppointmentType from './edit-appointment-type';
import Router from "react-router";
import Api from '@shared/services/api';
import { AppointmentType } from '@pages/external-access/appointment/models';
import { PatientAppointmentType } from '@shared/models/patient-appointment-type.enum';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("EditAppointmentType tests", () => {
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

    it("renders EditAppointmentType correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "123" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <EditAppointmentType/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders EditAppointmentType with data correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "123" })
        var response = {
            data: {
                id: 1,
                instructions: "string",
                name: "string",
                cancelable: false,
                cancelationTimeFrame: 12,
                cancelationFee: 1,
                reschedulable: false,
                rescheduleTimeFrame: 12,
                description: "string",
                createdByName: "string",
                modifiedByName: "string",
                createdOn: new Date(),
                modifiedOn: new Date(),
                selectableByPatient: true,
                selectedProviders: [1,2,3],
                patientType: PatientAppointmentType.All
            } as AppointmentType
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <EditAppointmentType/>
            </TestWrapper>);
        });
        expect(Api.get).toHaveBeenCalledTimes(2);
    });
})
