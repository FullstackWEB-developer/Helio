import {ALPHABETICAL_REGEX} from '@constants/form-constants';
import {SearchType} from '../models/search-type';
import {searchTypePatient, searchTypeContact, searchTypeTicket} from './search-type';

export enum SearchCategory {
    Patient = '1',
    Contact = '2',
    Ticket = '3'
}

export const searchTypes: SearchType[] = [
    {
        label: 'search.search_type.patient_name',
        regex: ALPHABETICAL_REGEX,
        type: searchTypePatient.patientName,
        priority: 1,
        category: SearchCategory.Patient
    },
    {
        label: 'search.search_type.patient_id',
        regex: '^[0-9]{1,8}$',
        type: searchTypePatient.patientId,
        priority: 2,
        category: SearchCategory.Patient
    },
    {
        label: 'search.search_type.dob',
        regex: '^(\\d)(?:\\d|$)(?:\\/|$)(?:\\d|$)(?:\\d|$)(?:\\/|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)$',
        type: searchTypePatient.dateOfBirth,
        priority: 3,
        category: SearchCategory.Patient
    },
    {
        label: 'search.search_type.phone',
        regex: '(^\\d+$|^(\\d)(?:\\d|$)(?:\\d|$)(?:\\-|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\-|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)$)',
        type: searchTypePatient.phone,
        priority: 5,
        category: SearchCategory.Patient
    },
    {
        label: 'search.search_type.contact_name',
        regex: ALPHABETICAL_REGEX,
        type: searchTypeContact.contactName,
        priority: 6,
        category: SearchCategory.Contact
    },
    {
        label: 'search.search_type.ticket_id',
        regex: '^\\d+$',
        type: searchTypeTicket.ticketId,
        priority: 7,
        category: SearchCategory.Ticket
    },
    {
        label: 'search.search_type.patient_or_contact_name',
        regex: ALPHABETICAL_REGEX,
        type: searchTypeTicket.patientOrContactName,
        priority: 8,
        category: SearchCategory.Ticket
    }
];
