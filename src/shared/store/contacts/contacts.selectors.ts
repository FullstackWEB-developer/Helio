import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { Address } from '../../models/address.model';
import { Contact } from '../../models/contact.model';
import { ContactPerson } from '../../models/contact-person.model';

export const contactState = (state: RootState) => state.contactState;

export const selectAddresses = createSelector(
    contactState,
    items => items.addresses as Address[]
)
export const selectContacts = createSelector(
    contactState,
    items => items.contacts as Contact[]
)
export const selectContactPeople = createSelector(
    contactState,
    items => items.contactPeople as ContactPerson[]
)
export const selectIsContactOptionsLoading = createSelector(
    contactState,
    items => items.isContactsLoading as boolean
)
export const selectContactOptionsError = createSelector(
    contactState,
    items => items.error as string
)
