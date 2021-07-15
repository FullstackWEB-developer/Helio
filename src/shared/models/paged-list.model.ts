import {Paging} from './paging.model';

export interface PagedList<T> extends Paging {
    results: Array<T>;
}
