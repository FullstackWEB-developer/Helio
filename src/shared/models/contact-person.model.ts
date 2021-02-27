export interface ContactPerson {
    id: string;
    firstName: string;
    surname: string;
    salutation?: string;
    emailAddress?: string;
    phoneNumber?: string;
    mobileNumber?: string;
    department?: string;
    isMainContactPerson?: string;
}
