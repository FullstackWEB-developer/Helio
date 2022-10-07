import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import SendFirstEmail from './send-first-email';
import Router from "react-router-dom";
import EmailProvider from '@pages/email/context/email-context';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Send First Email tests", () => {
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

    it("renders send-first-email correctly with contact", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <SendFirstEmail onMailSend={() => {}} ticket={{}} contact={{
                    emailAddress: "Test"
                }}/>
            </EmailProvider>            
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders send-first-email correctly send email", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })

        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <SendFirstEmail onMailSend={() => {}} ticket={{
                    contactId: "Test"
                }} contact={{
                    emailAddress: "Test"
                }}/>
            </EmailProvider>            
        </TestWrapper>);
        fireEvent.click(getByTestId("send-email"))
    });

    it("renders send-first-email correctly patient send email", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
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
        }
        const {getByTestId} = render(<TestWrapper mockState={mockState}>
            <EmailProvider>
                <SendFirstEmail onMailSend={() => {}} ticket={{
                    contactId: "Test"
                }} patient={patient}/>
            </EmailProvider>            
        </TestWrapper>);
        fireEvent.click(getByTestId("send-email"))
    });
})
