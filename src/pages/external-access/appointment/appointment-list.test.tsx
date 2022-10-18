import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import AppointmentList from './appointment-list';
import Router from "react-router";
import Api from '@shared/services/api';
import { VerifiedPatient } from '@pages/patients/models/verified-patient';
import { Location, Provider } from '@shared/models';
import { Appointment, AppointmentType } from './models';
import { PatientAppointmentType } from '@shared/models/patient-appointment-type.enum';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
jest.setTimeout(70000);
describe("AppointmentList tests", () => {
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

    it("renders AppointmentList correctly", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('appointmenttypes/patient-appointment-types')) {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            id: 10,
                            instructions: "string",
                            name: "string",
                            cancelable: true,
                            cancelationTimeFrame: 10,
                            cancelationFee: 10,
                            reschedulable: true,
                            rescheduleTimeFrame: 10,
                            description: "string",
                            createdByName: "string",
                            modifiedByName: "string",
                            createdOn: new Date("2022-11-15"),
                            modifiedOn: new Date("2022-11-15"),
                            selectableByPatient: true,
                            selectedProviders: [3],
                            patientType: PatientAppointmentType.All
                        }] as AppointmentType[]
                    })
                })
            } else if(url.includes('/appointments')){
                return new Promise((resolve) => {
                    resolve({
                        data: [{
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
                        }] as Appointment[]
                    })
                })
            } else {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            stateCode: 'AL',
                            name: 'Alabama'
                        }]
                    })
                })
            }
        });
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <AppointmentList/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders AppointmentList correctly appointment details", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('appointmenttypes')) {
                return new Promise((resolve) => {
                    resolve({
                        data: [] as AppointmentType[]
                    })
                })
            } else if(url.includes('/appointments')){
                return new Promise((resolve) => {
                    resolve({
                        data: [{
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
                        }] as Appointment[]
                    })
                })
            } else {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            stateCode: 'AL',
                            name: 'Alabama'
                        }]
                    })
                })
            }
        });
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <AppointmentList/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('data-test-string'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders AppointmentList correctly schedule", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('appointmenttypes')) {
                return new Promise((resolve) => {
                    resolve({
                        data: [] as AppointmentType[]
                    })
                })
            } else if(url.includes('/appointments')){
                return new Promise((resolve) => {
                    resolve({
                        data: [] as Appointment[]
                    })
                })
            } else {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            stateCode: 'AL',
                            name: 'Alabama'
                        }]
                    })
                })
            }
        });
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <AppointmentList/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('schedule'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders AppointmentList correctly error", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation(() => {
            return Promise.reject({statusCode: 404})
        });
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <AppointmentList/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
