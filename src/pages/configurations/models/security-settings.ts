export interface SecuritySettings {
    hipaaVerificationRetryNumber: number;
    verifiedPatientExpiresInDays: number;
    medicalRecordsDownloadExpirationInDays: number;
    redirectLinkExpirationInHours: number;
    verificationFailWaitInMinutes: number;
    guestSmsExpirationInHours: number;
}
