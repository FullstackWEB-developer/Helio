import { Dispatch } from '@reduxjs/toolkit';
import { Contact } from '@shared/models/contact.model';
import {
    setContacts,
    startGetContactsRequest,
    endGetContactsRequest
} from '../store/contacts/contacts.slice';
import Api from './api';
import Logger from './logger';

const logger = Logger.getInstance();

const getContactsUrl = '/contacts';

export const searchContactsByName = async (searchTerm: string): Promise<Contact[]> => {
    const { data } = await Api.get(getContactsUrl, {
        params: { name: searchTerm }
    });
    return data.results; 
}

export const getContacts = () => {
    return async (dispatch: Dispatch) => {
        dispatch(startGetContactsRequest());
        await Api.get(getContactsUrl)
            .then(response => {
                dispatch(setContacts(response.data.results));
                dispatch(endGetContactsRequest(''));
            })
            .catch(error => {
                logger.error(`Failed getting Contacts values`, error);
                dispatch(endGetContactsRequest('ticket-new.error'));
            });
    }
}
