import { Address } from '../../models/address.model';
import { Contact } from '../../models/contact.model';
import { ContactPerson } from '../../models/contact-person.model';

export interface ContactsState {
    error?: string;
    addresses?: Address[];
    contacts?: Contact[];
    contactPeople?: ContactPerson[];
}

const initialContactsState: ContactsState = {
    error: '',
    addresses: [],
    contacts: [],
    contactPeople: []
}

export default initialContactsState;
