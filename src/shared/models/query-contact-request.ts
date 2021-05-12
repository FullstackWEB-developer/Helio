import {ContactCategory} from './contact-category.enum';
import {ContactType} from './contact-type.enum';
export interface QueryContactRequest {
    searchTerm?: string;
    category?: ContactCategory;
    type?: ContactType;
    page?: number;
    pageSize: number;
    starredOnly?: boolean;
}