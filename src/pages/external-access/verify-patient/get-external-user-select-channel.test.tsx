import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '../../../shared/test-utils/test-wrapper';
import GetExternalUserSelectChannel from './get-external-user-select-channel';
import { RequestChannel } from './models/request-channel.enum';
import { ExternalAccessRequestTypes } from '../models/external-updates-request-types.enum';
import Api from '@shared/services/api';
import { PatientExistsResponse } from '../models/patient-exists-response.model';
import { CheckPatientVerification } from '../models/check-patient-verification.model';
import { VerificationChannel } from '../models/verification-channel.enum';
import Router from 'react-router';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useLocation: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
  jest.setTimeout(70000);
describe("GetExternalUserSelectChannel tests", () => {
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

    it("renders GetExternalUserSelectChannel verified", async () => {
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
        jest.spyOn(Router, 'useLocation').mockReturnValue({
            pathname: "/testroute",
            search: '',
            hash: '',
            state: {
                email: "Test",
                mobileNumber: "5515283307",
                isVerified: false
            }
        })
        jest.spyOn(Api, 'post').mockResolvedValue(response);
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <GetExternalUserSelectChannel/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.change(getByTestId('verificationChannel'), {target: {checked: true}});
            });
            await waitFor(() => {
                fireEvent.change(getByTestId('verificationChannelEmail'), {target: {checked: true}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId("select-channel-submit-button"));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });
})
