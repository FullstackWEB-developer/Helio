import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '../../../shared/test-utils/test-wrapper';
import VerifyRedirectLink from './verify-redirect-link';
import { RequestChannel } from './models/request-channel.enum';
import { ExternalAccessRequestTypes } from '../models/external-updates-request-types.enum';
import Api from '@shared/services/api';
import { VerificationChannel } from '../models/verification-channel.enum';
import Router from 'react-router';
import { VerifiedPatient } from '@pages/patients/models/verified-patient';
import { RedirectLink } from './models/redirect-link';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
  jest.setTimeout(70000);
describe("VerifyRedirectLink tests", () => {
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
        },
        callsLogState: {
            isFiltered: false
        },
        ticketState: {
            lookupValues: []
        },
        externalAccessState: {
            verifyPatientState: {
                redirectLink: {
                    attributes: {},
                    fullUrl: "string",
                    linkCreationDate: Date,
                    linkId: "string",
                    patientId: "string",
                    requestChannel: RequestChannel.Chat,
                    requestType: ExternalAccessRequestTypes.AppointmentConfirmation,
                    ticketId: "string",
                    sentAddress: "string"
                },
                phoneNumber: '',
                email: '',
                preventRetryUntil: undefined,
                retryPrevented: false,
                twoFACodeResendDisabled: false,
                lastTwoFACodeSentTimestamp: undefined
            }
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

    it("renders VerifyRedirectLink DownloadMedicalRecords", async () => {
        let response = {
            data: {
                attributes: "any",
                fullUrl: "string",
                linkCreationDate: new Date("2022-11-10"),
                linkId: "string",
                patientId: "string",
                requestChannel: RequestChannel.Chat,
                requestType: ExternalAccessRequestTypes.DownloadMedicalRecords,
                ticketId: "string",
                sentAddress: "string"
            } as RedirectLink
        };
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({linkId: "Test"})
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <VerifyRedirectLink/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders VerifyRedirectLink RegisterNewPatient", async () => {
        let response = {
            data: {
                attributes: "any",
                fullUrl: "string",
                linkCreationDate: new Date("2022-11-10"),
                linkId: "string",
                patientId: "string",
                requestChannel: RequestChannel.Chat,
                requestType: ExternalAccessRequestTypes.RegisterNewPatient,
                ticketId: "string",
                sentAddress: "string"
            } as RedirectLink
        };
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({linkId: "Test"})
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <VerifyRedirectLink/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders VerifyRedirectLink FeedbackRating", async () => {
        let response = {
            data: {
                attributes: "any",
                fullUrl: "string",
                linkCreationDate: new Date("2022-11-10"),
                linkId: "string",
                patientId: "string",
                requestChannel: RequestChannel.Chat,
                requestType: ExternalAccessRequestTypes.FeedbackRating,
                ticketId: "string",
                sentAddress: "string"
            } as RedirectLink
        };
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({linkId: "Test"})
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <VerifyRedirectLink/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders VerifyRedirectLink AppointmentConfirmation", async () => {
        let response = {
            data: {
                attributes: "any",
                fullUrl: "string",
                linkCreationDate: new Date("2022-11-10"),
                linkId: "string",
                patientId: "string",
                requestChannel: RequestChannel.Chat,
                requestType: ExternalAccessRequestTypes.AppointmentConfirmation,
                ticketId: "string",
                sentAddress: "string"
            } as RedirectLink
        };
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({linkId: "Test"})
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <VerifyRedirectLink/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders VerifyRedirectLink 404", async () => {
        let response = {
            data: {
                attributes: "any",
                fullUrl: "string",
                linkCreationDate: new Date("2022-11-10"),
                linkId: "string",
                patientId: "string",
                requestChannel: RequestChannel.Chat,
                requestType: ExternalAccessRequestTypes.AppointmentConfirmation,
                ticketId: "string",
                sentAddress: "string"
            } as RedirectLink
        };
        jest.spyOn(Api, 'post').mockImplementation(() => {
            return Promise.reject({statusCode: 404})
        });
        jest.spyOn(Router, 'useParams').mockReturnValue({linkId: "Test"})
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <VerifyRedirectLink/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders VerifyRedirectLink 409", async () => {
        let response = {
            data: {
                attributes: "any",
                fullUrl: "string",
                linkCreationDate: new Date("2022-11-10"),
                linkId: "string",
                patientId: "string",
                requestChannel: RequestChannel.Chat,
                requestType: ExternalAccessRequestTypes.AppointmentConfirmation,
                ticketId: "string",
                sentAddress: "string"
            } as RedirectLink
        };
        jest.spyOn(Api, 'post').mockImplementation(() => {
            return Promise.reject({response : {status: 409}})
        });
        jest.spyOn(Router, 'useParams').mockReturnValue({linkId: "Test"})
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <VerifyRedirectLink/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders VerifyRedirectLink 500", async () => {
        let response = {
            data: {
                attributes: "any",
                fullUrl: "string",
                linkCreationDate: new Date("2022-11-10"),
                linkId: "string",
                patientId: "string",
                requestChannel: RequestChannel.Chat,
                requestType: ExternalAccessRequestTypes.AppointmentConfirmation,
                ticketId: "string",
                sentAddress: "string"
            } as RedirectLink
        };
        jest.spyOn(Api, 'post').mockImplementation(() => {
            return Promise.reject({statusCode: 500})
        });
        jest.spyOn(Router, 'useParams').mockReturnValue({linkId: "Test"})
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <VerifyRedirectLink/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
