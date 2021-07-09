import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Address } from '../../models/address.model';
import { Contact } from '../../models/contact.model';
import { ContactPerson } from '../../models/contact-person.model';
import initialContactsState from './contacts.initial-state';

const contactsSlice = createSlice({
    name: 'contacts',
    initialState: initialContactsState,
    reducers: {
        setAddresses(state, { payload }: PayloadAction<Address[]>) {
            state.error = '';
            state.addresses = payload;
        },
        setContacts(state, { payload }: PayloadAction<Contact[]>) {
            state.error = '';
            state.contacts = payload;
        },
        setContactPeople(state, { payload }: PayloadAction<ContactPerson[]>) {
            state.error = '';
            state.contactPeople = payload;
        },
        startGetContactsRequest(state) {
            state.error = '';
            state.contacts = []
        },
        endGetContactsRequest(state, { payload }: PayloadAction<string>) {
            state.error = payload;
        }
    }
});

export const {
    setAddresses,
    setContacts,
    setContactPeople,
    startGetContactsRequest,
    endGetContactsRequest
} = contactsSlice.actions

export default contactsSlice.reducer
