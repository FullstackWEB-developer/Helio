import {Address} from './address.model';
import {ContactPerson} from './contact-person.model';
import {ContactType} from '@pages/contacts/models/ContactType';
import {ContactCategory} from '@shared/models/contact-category.enum';

export interface Contact {
    id: string;
    name: string;
    type: ContactType;
    firstName: string;
    lastName: string;
    companyName: string;
    workMainPhone: string;
    mobilePhone: string;
    description?: string;
    primaryEmailAddress?: string;
    secondaryEmailAddress?: string;
    landLineNumber?: string;
    cellPhoneNumber?: string;
    category: ContactCategory;
    addresses?: Address[];
    contactPeople?: ContactPerson[];
    isCompany?: boolean
}
