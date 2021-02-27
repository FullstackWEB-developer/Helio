import { Address } from './address.model';
import { ContactPerson } from './contact-person.model';

export interface Contact {
    id: string;
    name: string;
    description?: string;
    primaryEmailAddress?: string;
    secondaryEmailAddress?: string;
    landLineNumber?: string;
    cellPhoneNumber?: string;
    addresses?: Address[];
    contactPeople?: ContactPerson[];
}
