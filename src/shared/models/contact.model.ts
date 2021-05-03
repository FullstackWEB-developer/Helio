import {Address} from './address.model';
import {ContactPerson} from './contact-person.model';
import {ContactType} from '@pages/contacts/models/ContactType';

export interface Contact {
    id: string;
    name: string;
    type: ContactType;
    firstName: string;
    lastName: string;
    companyName: string;
    description?: string;
    primaryEmailAddress?: string;
    secondaryEmailAddress?: string;
    landLineNumber?: string;
    cellPhoneNumber?: string;
    addresses?: Address[];
    contactPeople?: ContactPerson[];
    isCompany?: boolean
}
