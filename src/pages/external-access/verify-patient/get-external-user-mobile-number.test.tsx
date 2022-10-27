import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '../../../shared/test-utils/test-wrapper';
import GetExternalUserMobileNumber from './get-external-user-mobile-number';
import { RequestChannel } from './models/request-channel.enum';
import { ExternalAccessRequestTypes } from '../models/external-updates-request-types.enum';
import Api from '@shared/services/api';
import { PatientExistsResponse } from '../models/patient-exists-response.model';
import { CheckPatientVerification } from '../models/check-patient-verification.model';
import { VerificationChannel } from '../models/verification-channel.enum';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
  jest.setTimeout(70000);
describe("GetExternalUserMobileNumber tests", () => {
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

    it("renders GetExternalUserMobileNumber verified", async () => {
        let response = {
            data: {
                fingerprintCode: "",
                mobilePhoneNumber: "5515283307",
                verificationChannel: VerificationChannel.Sms,
                isVerified: true,
                verifiedPatient: {
                    patientId: 75082
                },
                email: "string"
            } as any
        };
        jest.spyOn(Api, 'post').mockResolvedValue(response);
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <GetExternalUserMobileNumber/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByTestId('phone'), {target: {value: '5515283307'}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId("mobile-phone-submit-button"));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders GetExternalUserMobileNumber not-verified", async () => {
        let response = {
            data: {
                fingerprintCode: "",
                mobilePhoneNumber: "5515283307",
                verificationChannel: VerificationChannel.Sms,
                isVerified: false,
                verifiedPatient: {
                    patientId: 75082
                },
                email: "string"
            } as any
        };
        jest.spyOn(Api, 'post').mockResolvedValue(response);
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <GetExternalUserMobileNumber/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByTestId('phone'), {target: {value: '5515283307'}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId("mobile-phone-submit-button"));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders GetExternalUserMobileNumber error", async () => {
        jest.spyOn(Api, 'post').mockImplementation(() => {
            return Promise.reject({statusCode: 404})
        });
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <GetExternalUserMobileNumber/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByTestId('phone'), {target: {value: '5515283307'}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId("mobile-phone-submit-button"));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });
})
