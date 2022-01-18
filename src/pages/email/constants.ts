import {PagedRequest} from '@shared/models';
import {getPageSize} from '@pages/contacts/contact-helpers/helpers';
import {EmailFilterModel} from '@pages/email/components/email-filter/email-filter.model';

export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export const DEFAULT_MESSAGE_QUERY_PARAMS: PagedRequest = {
    page: 1,
    pageSize: getPageSize()
}

export const DEFAULT_FILTER_VALUE: EmailFilterModel = {
    assignedTo: '',
    timePeriod: '1',
}
