import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import TicketSmsRealTimeProcessor from './ticket-sms-real-time-processor';
import { TicketMessage } from '@shared/models';
import { VerifiedPatient } from '@pages/patients/models/verified-patient';
jest.setTimeout(90000);
describe("TicketSmsRealTimeProcessor tests", () => {
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
            verifyPatientState: {},
            ticketSmsState: {
                messages: [] as TicketMessage[]
            }
        },
        patientsState: {
            verifiedPatient: {
                firstName: "string",
                lastName: "string",
                patientId: 123,
                primaryProviderId: 123,
                departmentId: 123,
                defaultProviderId: 123,
                defaultDepartmentId: 123,
                dateOfBirth: new Date("10/10/1995"),
                token: "string",
                tokenExpiration: new Date("10/10/1995")
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

    it("renders TicketSmsRealTimeProcessor correctly", async () => {
        let fragment: any;
        window.HTMLElement.prototype.scrollIntoView = function() {};
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <TicketSmsRealTimeProcessor/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
