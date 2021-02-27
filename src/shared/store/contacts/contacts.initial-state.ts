import { Address } from '../../models/address.model';
import { Contact } from '../../models/contact.model';
import { ContactPerson } from '../../models/contact-person.model';

export interface ContactsState {
    error?: string;
    isContactsLoading: boolean;
    addresses?: Address[];
    contacts?: Contact[];
    contactPeople?: ContactPerson[];
}

const initialContactsState: ContactsState = {
    error: '',
    isContactsLoading: false,
    addresses: [],
    contacts: [],
    contactPeople: []
}

export default initialContactsState;
