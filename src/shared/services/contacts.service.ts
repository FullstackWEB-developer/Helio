import {Dispatch} from '@reduxjs/toolkit';
import {Contact, ContactExtended} from '@shared/models/contact.model';
import {endGetContactsRequest, setContacts, startGetContactsRequest} from '../store/contacts/contacts.slice';
import Api from './api';
import Logger from './logger';
import {QueryContactRequest} from '@shared/models/query-contact-request';
import {AddContactNoteProps} from '@pages/contacts/models/contact-note.model';
import {setGlobalLoading} from '@shared/store/app/app.slice';

const logger = Logger.getInstance();

const contactsUrl = '/contacts';

export const searchContactsByName = async (searchTerm: string): Promise<Contact[]> => {
    const {data} = await Api.get(contactsUrl, {
        params: {searchTerm: searchTerm}
    });
    return data.results;
}

export const getContacts = () => {
    return async (dispatch: Dispatch) => {
        dispatch(startGetContactsRequest());
        dispatch(setGlobalLoading(true));
        await Api.get(contactsUrl)
            .then(response => {
                dispatch(setContacts(response.data.results));
                dispatch(endGetContactsRequest(''));
            })
            .catch(error => {
                logger.error(`Failed getting Contacts values`, error);
                dispatch(endGetContactsRequest('ticket-new.error'));
            })
            .finally(() => {
                dispatch(setGlobalLoading(false));
            });
    }
}

export const queryContactsInfinite = async (pageParam: number, queryParams?: QueryContactRequest) => {
    const {category, searchTerm, type, pageSize, starredOnly} = queryParams ?? {};
    const {data} = await Api.get(`${contactsUrl}`, {
        params: {
            page: pageParam,
            pageSize: pageSize,
            category: category,
            searchTerm: searchTerm,
            type: type,
            starredOnly: starredOnly
        }
    });

    return {
        data: data,
        nextPage: data.page < data.totalPages ? data.page + 1 : undefined
    }
}

export const getContactById = async (contactId: string) => {
    const {data} = await Api.get(`${contactsUrl}/${contactId}`);
    return data;
}

export const createNewContact = async (contact: ContactExtended) => {
    const {data} = await Api.post(contactsUrl, contact);
    return data;
}

export const updateContact = async (contact: ContactExtended) => {
    const {data} = await Api.put(contactsUrl, contact);
    return data;
}

export const toggleFavoriteContact = async (contactId: string) => {
    const {data} = await Api.put(`${contactsUrl}/${contactId}/toggle-favorite`);
    return data;
}

export const deleteContact = async (contactId: string) => {
    const {data} = await Api.delete(`${contactsUrl}/${contactId}`);
    return data;
}

export const addContactNote = async ({contactId, contactNoteDto}: AddContactNoteProps) => {
    const {data} = await Api.post(`${contactsUrl}/${contactId}/notes`, contactNoteDto);
    return data;
}

export const getContactNotes = async (contactId: string) => {
    const {data} = await Api.get(`${contactsUrl}/${contactId}/notes`);
    return data;
}

export const searchCompanyContacts = async (searchTerm: string) => {
    const {data} = await Api.get(`${contactsUrl}?searchTerm=${searchTerm}&type=1`);
    return data;
}
