import {PagedRequest} from '@shared/models';
import {getPageSize} from '@pages/contacts/contact-helpers/helpers';
import {EmailFilterModel} from '@pages/email/components/email-filter/email-filter.model';

export const NEW_EMAIL = 'new';

export const SystemUser = "System User";
export const Anonymous = "Anonymous";

export const DEFAULT_MESSAGE_QUERY_PARAMS: PagedRequest = {
    page: 1,
    pageSize: getPageSize()
}

export const DEFAULT_FILTER_VALUE: EmailFilterModel = {
    assignedTo: '',
    timePeriod: '',
}
