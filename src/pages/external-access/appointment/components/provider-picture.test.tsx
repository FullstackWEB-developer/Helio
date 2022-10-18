import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ProviderPicture from './provider-picture';
import Router from "react-router";
import Api from '@shared/services/api';
import { VerifiedPatient } from '@pages/patients/models/verified-patient';
import { Location, Provider } from '@shared/models';
import { Appointment, AppointmentSlot, AppointmentType } from '../models';
import { PatientAppointmentType } from '@shared/models/patient-appointment-type.enum';
import { AppointmentDepartmentModel } from '../models/appointment-department.model';
import { AppointmentTableData } from './appointment-table-type';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
  jest.setTimeout(70000);
describe("ProviderPicture tests", () => {
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
            providerList: [
                {
                    ansiNameCode: '',
                    ansiSpecialtyCode: '',
                    billable: false,
                    createEncounterOnCheckin: false,
                    firstName: 'provider',
                    lastName: 'lastname',
                    id: 3
                }
            ] as Provider[],
            locationList: [{
                medicationHistoryConsent: true,
                timeZoneOffset: 1,
                isHospitalDepartment: true,
                state: "string",
                portalUrl: "string",
                city: "string",
                placeOfServiceFacility: true,
                serviceDepartment: true,
                latitude: 1,
                fax: "string",
                doesNotObservedSt: true,
                parkingInformation: "string",
                id: 1,
                address: "string",
                placeOfServiceTypeId: 1,
                longitude: 1,
                clinicals: "string",
                timeZone: 1,
                patientDepartmentName: "string",
                chartSharingGroupId: "string",
                name: "string",
                placeOfServiceTypeName: "string",
                phone: "string",
                address2: "string",
                clinicalProviderFax: "string",
                ecommerceCreditCardTypes: ["1", "2"],
                zip: "string",
                timeZoneName: "string"
            }
            ] as Location[]
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        callsLogState: {
            isFiltered: false
        },
        ticketState: {
            lookupValues: []
        },
        patientsState: {
            verifiedPatient: {
                firstName: "string",
                lastName: "string",
                patientId: 123,
                primaryProviderId: 12,
                departmentId: 1,
                defaultProviderId: 12,
                defaultDepartmentId: 1,
                dateOfBirth: new Date("1995-11-15"),
                token: "string",
                tokenExpiration: new Date("2023-11-15")
            } as VerifiedPatient
        },
        externalAccessState: {
            appointmentsState: {
                patientUpcomingAppointment: {
                    appointmentId: "string",
                    appointmentStatus: "Future",
                    appointmentType: "string",
                    appointmentTypeId:1,
                    copay:1,
                    date: new Date("2022-11-15"),
                    departmentId: 1,
                    duration:1,
                    patientAppointmentTypeName: "string",
                    providerId:1,
                    startTime: "string",
                    startDateTime: new Date("2022-11-15"),
                } as Appointment
            }
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

    it("renders ProviderPicture correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ProviderPicture/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ProviderPicture correctly with id", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockResolvedValue("Test");
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ProviderPicture providerId={1}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ProviderPicture correctly with id return undefined", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockResolvedValue(undefined);
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ProviderPicture providerId={1}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
