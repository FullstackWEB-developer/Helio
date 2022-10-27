import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '../../../shared/test-utils/test-wrapper';
import ExternalUserCreateCallbackTicket from './external-user-create-callback-ticket';
import { RequestChannel } from './models/request-channel.enum';
import { ExternalAccessRequestTypes } from '../models/external-updates-request-types.enum';
import Api from '@shared/services/api';
import { PatientExistsResponse } from '../models/patient-exists-response.model';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
  jest.setTimeout(70000);
describe("ExternalUserCreateCallbackTicket tests", () => {
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

    it("renders ExternalUserCreateCallbackTicket not-verified", async () => {
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
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <ExternalUserCreateCallbackTicket/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByTestId('firstName'), {target: {value: 'checked'}});
            });
            await waitFor(() => {
                fireEvent.input(getByTestId('lastName'), {target: {value: 'checked'}});
            });
            await waitFor(() => {
                fireEvent.input(getByTestId('dateOfBirth'), {target: {value: '15/10/1995'}});
            });
            await waitFor(() => {
                fireEvent.input(getByTestId('mobileNumber'), {target: {value: '5515283307'}});
            });
            await waitFor(() => {
                fireEvent.input(getByTestId('zip'), {target: {value: '90002'}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId("mobile-phone-submit-button"));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });
})
