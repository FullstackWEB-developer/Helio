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

export const DAYJS_LOCALE = {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'a few seconds',
        m: "1 min",
        mm: "%d mins",
        h: "1 h",
        hh: "%d h",
        d: "1 d",
        dd: "%d d",
        M: "1 mo",
        MM: "%d mo",
        y: "1 y",
        yy: "%d y"
    }
}
