export interface SecuritySettings {
    hipaaVerificationRetryNumber: string;
    verifiedPatientExpiresInDays: string;
    medicalRecordsDownloadExpirationInDays: string;
    redirectLinkExpirationInHours: string;
    verificationFailWaitInMinutes: string;
    guestSmsExpirationInHours: string;
}