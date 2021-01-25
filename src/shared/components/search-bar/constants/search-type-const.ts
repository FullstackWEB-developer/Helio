import {SearchType} from "../models/search-type";
import {searchType} from "./search-type";

export const searchTypes: SearchType[] = [
    {
        label: 'search.search_type.patient_id',
        regex: "^\\d+$",
        type: searchType.patientId,
        priority: 1,
    },
    {
        label: 'search.search_type.patient_name',
        regex: "^[a-z, A-Z, \\s]+$",
        type: searchType.patientName,
        priority: 2,
    },
    {
        label: 'search.search_type.dob',
        regex: "^(\\d)(?:\\d|$)(?:\\/|$)(?:\\d|$)(?:\\d|$)(?:\\/|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)(?:\\d|$)$",
        type: searchType.dateOfBirth,
        priority: 3,
    },
    {
        label: 'search.search_type.ssn',
        regex: "^\\d+$",
        type: searchType.ssn,
        priority: 4,
    },
    {
        label: 'search.search_type.phone',
        regex: "^\\d+$",
        type: searchType.phone,
        priority: 4,
    }
]