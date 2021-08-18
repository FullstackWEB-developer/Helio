import {ContactType} from './contact-type.enum';
export interface QueryContactRequest {
    searchTerm?: string;
    category?: string;
    type?: ContactType;
    page?: number;
    pageSize: number;
    starredOnly?: boolean;
}
