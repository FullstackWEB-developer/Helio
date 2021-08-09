export interface Pharmacy {
    pharmacyType?: string;
    state: string;
    city: string;
    receiverType?: string;
    acceptFax?: boolean;
    clinicalProviderId: number;
    zip: string;
    phoneNumber: string;
    clinicalProviderName: string;
    address1: string;
    address2?: string;
    faxNumber: string;
    suite?: string;
}
