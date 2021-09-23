import {getPageSize} from '@pages/contacts/contact-helpers/helpers';
import {PagedRequest} from '@shared/models';
import {SmsFilterParamModel} from './components/sms-filter/sms-filter.model';

export const DEFAULT_MESSAGE_QUERY_PARAMS: PagedRequest = {
    page: 1,
    pageSize: getPageSize()
}

export const DEFAULT_FILTER_VALUE: SmsFilterParamModel = {
    assignedTo: '',
    timePeriod: '1',
}

export const NEW_MESSAGE_OPTION_SELECT_TICKET = 'SELECT_TICKET';
export const NEW_MESSAGE_OPTION_CREATE_TICKET = 'CREATE_TICKET';
export const MORE_MENU_OPTION_PATIENT = 'VIEW_PATIENT';
export const MORE_MENU_OPTION_TICKET = 'VIEW_TICKET';
export const MORE_MENU_OPTION_CONTACT = 'VIEW_CONTACT';
