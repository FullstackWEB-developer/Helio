import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailReply from './email-reply';
import Router from "react-router-dom";
import React from 'react';
import { ExtendedPatient } from '@pages/patients/models/extended-patient';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Reply tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        emailState: {
            unreadEmails: 0
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

    it("renders email-filter correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let ticket = {};
        let contact = {
            category: 1
        };
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailReply disabled={false} ticket={ticket} patient={undefined} contact={contact} onMailSend={() => {}} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-filter contact-email-address", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let ticket = {};
        let contact = {
            category: 1,
            emailAddress: "Test"
        };
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailReply disabled={false} ticket={ticket} patient={undefined} contact={contact} onMailSend={() => {}} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-filter patient-email-address", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let ticket = {};
        let patient = {
            allPatientStatuses: [],
            balances: [],
            patientInCollectionsBalance: 0,
            city: '',
            consentToText: false,
            contactPreferenceAnnouncementEmail: false,
            contactPreference: '',
            contactPreferenceAnnouncementPhone: false,
            contactPreferenceAnnouncementSms: false,
            contactPreferenceAppointmentEmail: false,
            contactPreferenceAppointmentPhone: false,
            contactPreferenceAppointmentSms: false,
            contactPreferenceBillingEmail: false,
            contactPreferenceBillingPhone: false,
            contactPreferenceBillingSms: false,
            contactPreferenceLabEmail: false,
            contactPreferenceLabPhone: false,
            contactPreferenceLabSms: false,
            countryCode: '',
            countryCodeIso3166: '',
            countryId: '',
            currentDepartment: '',
            currentDepartmentId: 0,
            customFields: [],
            dateOfBirth: '',
            departmentId: 0,
            drivingLicense: false,
            emailAddress: '',
            ethnicityCode: '',
            firstAppointmentDate: '',
            firstName: '',
            guarantorCountryIsoCode3166: '',
            guarantorDateOfBirth: '',
            guarantorFirstName: '',
            guarantorLastName: '',
            guarantorRelationShipToPatient: 0,
            hasMobile: false,
            insurances: [],
            isEmailExists: false,
            isGuarantorAddressSameAsPatient: false,
            isPortalAccessGiven: false,
            isPortalTermsOnFile: false,
            isPrivacyInformationVerified: false,
            languageIso6392Code: '',
            lastAppointmentDate: '',
            lastName: '',
            localPatientId: 0,
            maritalStatus: '',
            maritalStatusName: '',
            mobilePhone: '',
            patientId: 0,
            patientPhoto: false,
            portalStatus: {
                blockedFailedLogins: false,
                entityToDisplay: '',
                familyBlockedFailedLogins: false,
                familyRegistered: false,
                noPortal: false,
                registered: false,
                status: '',
                termsAccepted: false
            },
            primaryDepartmentId: 0,
            primaryProviderId: 0,
            providerGroupId: 0,
            race: [''],
            raceName: '',
            registrationDate: '',
            sex: '',
            ssn: '',
            state: '',
            status: 0,
            translatedMobilePhoneIndex: '',
            zip: '',
            notes: [],
            address: '',
            address2: '',
            homePhone: '',
            workPhone: ''
        } as ExtendedPatient
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailReply disabled={false} ticket={ticket} patient={patient} contact={undefined} onMailSend={() => {}} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-filter ticket-email-address", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        let ticket = {
            incomingEmailAddress: "Test"
        };
        let contact = {
            category: 1
        };
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailReply disabled={false} ticket={ticket} patient={undefined} contact={contact} onMailSend={() => {}} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders email-filter send-reply", async () => {
        let ticket = {
            incomingEmailAddress: "Test"
        };
        let contact = {
            category: 1
        };
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailReply disabled={false} ticket={ticket} patient={undefined} contact={contact} onMailSend={() => {}} />
        </TestWrapper>);
        fireEvent.change(getByTestId("email-context"), {
            target: {
                value: "Test"
            }
        });
        fireEvent.click(getByTestId("send-reply"))
    });

    it("renders email-filter discard-reply", async () => {
        let ticket = {
            incomingEmailAddress: "Test"
        };
        let contact = {
            category: 1
        };
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailReply disabled={false} ticket={ticket} patient={undefined} contact={contact} onMailSend={() => {}} />
        </TestWrapper>);
        fireEvent.change(getByTestId("email-context"), {
            target: {
                value: "Test"
            }
        });
        fireEvent.click(getByTestId("discard-context"))
    });
})
