import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '../../../shared/test-utils/test-wrapper';
import ExternalUserCreateEmergencyNote from './external-user-emergency-note';
import { RequestChannel } from './models/request-channel.enum';
import { ExternalAccessRequestTypes } from '../models/external-updates-request-types.enum';
import Api from '@shared/services/api';
import { PatientExistsResponse } from '../models/patient-exists-response.model';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
  jest.setTimeout(70000);
describe("ExternalUserCreateEmergencyNote tests", () => {
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
                preventRetryUntil: 3,
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

    it("renders ExternalUserCreateEmergencyNote not-verified", async () => {
        let response = {
            data: {
                doesExists: true,
                email: "string",
                mobileNumber: "string",
                patientId: 75082
            } as PatientExistsResponse
        };
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ExternalUserCreateEmergencyNote type={ExternalAccessRequestTypes.AppointmentList}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ExternalUserCreateEmergencyNote verified", async () => {
        let response = {
            data: {
                doesExists: true,
                email: "string",
                mobileNumber: "string",
                patientId: 75082
            } as PatientExistsResponse
        };
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ExternalUserCreateEmergencyNote type={ExternalAccessRequestTypes.RequestRefill}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
