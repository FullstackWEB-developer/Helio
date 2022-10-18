import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import AppointmentScheduleSelect from './appointment-schedule-select';
import Router from "react-router";
import Api from '@shared/services/api';
import { VerifiedPatient } from '@pages/patients/models/verified-patient';
import { Location, Provider } from '@shared/models';
import { Appointment, AppointmentSlotTimeOfDay, AppointmentType } from '../models';
import { PatientAppointmentType } from '@shared/models/patient-appointment-type.enum';
import { AppointmentDepartmentModel } from '../models/appointment-department.model';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
  jest.setTimeout(70000);
describe("AppointmentScheduleSelect tests", () => {
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
                } as Appointment,
                appointmentSlotRequest: {
                    departmentId: 1,
                    startDate: new Date('2022-11-15'),
                    endDate: new Date('2022-11-15'),
                    providerId: [1],
                    ignoreSchedulablePermission: false,
                    appointmentTypeId: 1,
                    itemCount: 3,
                    patientId: 1,
                    allowMultipleDepartment: true,
                    patientDefaultDepartmentId: 10,
                    patientDefaultProviderId: 10,
                    timeOfDays: [AppointmentSlotTimeOfDay.EarlyMorning, AppointmentSlotTimeOfDay.Afternoon] as AppointmentSlotTimeOfDay[],
                    firstAvailable: true
                }
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

    it("renders AppointmentScheduleSelect correctly", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('open-slots')) {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            address1: 'address',
                            city: 'city',
                            phoneNumber: '2222222222',
                            state: 'AL',
                            zip: '55555',
                            clinicalProviderId: 3,
                            clinicalProviderName: 'bb',
                            faxNumber: '223232323',
                            departmentId: 1
                        }] as any[]
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
                <AppointmentScheduleSelect/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('schedule-select-filter'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders AppointmentScheduleSelect correctly not empty slot", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('open-slots')) {
                return new Promise((resolve) => {
                    resolve({
                        data: [] as any[]
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
                <AppointmentScheduleSelect/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('schedule-select-filter'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });
})
