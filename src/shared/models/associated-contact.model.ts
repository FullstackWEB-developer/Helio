import {ContactType} from './contact-type.enum';
export interface AssociatedContact {
    firstName: string;
    lastName: string;
    companyName: string;
    type: ContactType;
    id: string;
    department?: string;
    jobTitle?: string;
}