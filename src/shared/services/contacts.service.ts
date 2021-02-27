import { Dispatch } from "@reduxjs/toolkit";
import {
    setContacts,
    startGetContactsRequest,
    endGetContactsRequest
} from '../store/contacts/contacts.slice';
import Api from './api';
import Logger from './logger';

const logger = Logger.getInstance();

const getContactsUrl = '/contacts';

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
