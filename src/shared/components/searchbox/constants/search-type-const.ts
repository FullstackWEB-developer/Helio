import {ALPHABETICAL_NUMERICAL_REGEX} from '@constants/form-constants';
import { SearchType } from '../models/search-type';
import { searchType } from './search-type';

export const searchTypes: SearchType[] = [
    {
        label: 'search.search_type.patient_name',
        regex: '^[a-z, A-Z, \\s]+$',
        type: searchType.patientName,
        priority: 1,
    },
    {
        label: 'search.search_type.patient_id',
        regex: '^[0-9]{1,8}$',
        type: searchType.patientId,
        priority: 2,
    },
    {
        label: 'search.search_type.dob',
        regex: '^(\\d)(?:\\d|$)(?:\\/|$)(?:\\d|$)(?:\\d|$)(?:\\/|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)$',
        type: searchType.dateOfBirth,
        priority: 3,
    },
    {
        label: 'search.search_type.ssn',
        regex: '(^\\d{9}$|^(\\d)(?:\\d|$)(?:\\d|$)(?:\\-|$)(?:\\d|$)(?:\\d|$)(?:\\-|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)$)',
        type: searchType.ssn,
        priority: 4,
    },
    {
        label: 'search.search_type.phone',
        regex: '(^\\d+$|^(\\d)(?:\\d|$)(?:\\d|$)(?:\\-|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\-|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)$)',
        type: searchType.phone,
        priority: 5,
    },
    {
        label: 'search.search_type.contact_name',
        regex: ALPHABETICAL_NUMERICAL_REGEX,
        type: searchType.contactName,
        priority: 6,
    },
]
