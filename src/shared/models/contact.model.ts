import {Address} from './address.model';
import {ContactPerson} from './contact-person.model';
import {ContactType} from '@pages/contacts/models/ContactType';
import {AssociatedContact} from './associated-contact.model';
import {Option} from '@shared/components/option/option';
export interface Contact {
    id: string;
    name: string;
    type: ContactType;
    firstName: string;
    lastName: string;
    companyName: string;
    workMainPhone: string;
    workDirectPhone?: string;
    mobilePhone: string;
    description?: string;
    workMainExtension?: string;
    primaryEmailAddress?: string;
    secondaryEmailAddress?: string;
    landLineNumber?: string;
    cellPhoneNumber?: string;
    category: number;
    addresses?: Address[];
    contactPeople?: ContactPerson[];
    isCompany?: boolean
    emailAddress?: string;
    fax?: string;
    website?: string;
    jobTitle?: string;
    department?: string;
}

export interface ContactBase {
    id?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    type?: ContactType;
}

export interface ContactExtended extends ContactBase {
    department?: string;
    jobTitle?: string;
    mobilePhone?: string;
    workDirectPhone?: string;
    workMainPhone?: string;
    workMainExtension?: string;
    emailAddress?: string;
    description?: string;
    relatedId?: string;
    category: number | Option;
    isStarred?: boolean;
    addresses?: Address[],
    addToFavorites?: boolean;
    associatedContacts?: AssociatedContact[]
    fax?: string;
    website?: string;
}
