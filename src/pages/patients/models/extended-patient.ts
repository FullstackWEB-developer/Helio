import {Balance} from "./balance";
import {CustomField} from "./custom-field";
import {Insurance} from "./insurance";
import {PortalStatus} from "./portal-status";

export interface ExtendedPatient {
    allPatientStatuses: [],
    balances: Balance[],
    city: string,
    consentToText: boolean,
    contactPreferenceAnnouncementEmail: boolean,
    contactPreferenceAnnouncementPhone: boolean,
    contactPreferenceAnnouncementSms: boolean,
    contactPreferenceAppointmentEmail: boolean,
    contactPreferenceAppointmentPhone: boolean,
    contactPreferenceAppointmentSms: boolean,
    contactPreferenceBillingEmail: boolean,
    contactPreferenceBillingPhone: boolean,
    contactPreferenceBillingSms: boolean,
    contactPreferenceLabEmail: boolean,
    contactPreferenceLabPhone: boolean,
    contactPreferenceLabSms: boolean,
    countryCode: string,
    countryCodeIso3166: string,
    countryId: string,
    currentDepartment: string,
    currentDepartmentId: number,
    customFields: CustomField[],
    dateOfBirth: string,
    departmentId: number,
    drivingLicense: boolean,
    emailAddress: string,
    ethnicityCode: string,
    firstAppointmentDate: string,
    firstName: string,
    guarantorCountryIsoCode3166: string,
    guarantorDateOfBirth: string,
    guarantorFirstName:  string,
    guarantorLastName:  string,
    guarantorRelationShipToPatient: number,
    hasMobile: boolean,
    insurances: Insurance[],
    isEmailExists: boolean,
    isGuarantorAddressSameAsPatient: boolean,
    isPortalAccessGiven: boolean,
    isPortalTermsOnFile: boolean,
    isPrivacyInformationVerified: boolean,
    languageIso6392Code:  string,
    lastAppointmentDate:  string,
    lastName:  string,
    localPatientId: number,
    maritalStatus:  string,
    maritalStatusName:  string,
    mobilePhone:  string,
    patientId: number,
    patientPhoto: boolean,
    portalStatus: PortalStatus,
    primaryDepartmentId: number,
    primaryProviderId: number,
    providerGroupId: number,
    race: string[]
    raceName:  string,
    registrationDate:  string,
    sex:  string,
    ssn:  string,
    state:  string,
    status: number,
    translatedMobilePhoneIndex:  string,
    zip:  string,
}