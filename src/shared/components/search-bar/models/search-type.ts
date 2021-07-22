import {SearchCategory} from "../constants/search-type-const";
export interface SearchType {
    label: string,
    regex: string,
    type: number,
    priority: number,
    category: SearchCategory
}
