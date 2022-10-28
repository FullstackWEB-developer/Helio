import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import DownloadMedicalRecords from './download-medical-records';
import { VerifiedPatient } from '@pages/patients/models/verified-patient';
import { RedirectLink } from '../verify-patient/models/redirect-link';
import { RequestChannel } from '../verify-patient/models/request-channel.enum';
import { ExternalAccessRequestTypes } from '../models/external-updates-request-types.enum';
import { DownloadMedicalRecordsProps } from '@pages/patients/services/patients.service';
import Api from '@shared/services/api';
jest.setTimeout(70000);
describe("DownloadMedicalRecords tests", () => {
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
        },
        externalAccessState: {
            verifyPatientState: {
                redirectLink: {
                    attributes: {},
                    fullUrl: "string",
                    linkCreationDate: new Date("10/10/1995"),
                    linkId: "string",
                    patientId: "string",
                    requestChannel: RequestChannel.Chat,
                    requestType: ExternalAccessRequestTypes.AppointmentConfirmation,
                    ticketId: "string",
                    sentAddress: "string",
                } as RedirectLink
            },
            requestMedicalRecordState: {
                data: {
                    patientId: 123,
                    departmentId: 12,
                    downloadLink: "string",
                    emailAddress: "string",
                    isDownload: true,
                    startDate: new Date("10/10/2007"),
                    endDate: new Date("10/10/2007"),
                    asHtml: true,
                    note: "string",
                } as DownloadMedicalRecordsProps
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

    it("renders DownloadMedicalRecords correctly", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockResolvedValue(true);
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                    <DownloadMedicalRecords/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
