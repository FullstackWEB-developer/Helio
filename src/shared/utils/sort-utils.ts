import {SortDirection} from '../models/sort-direction';
import {Icon} from '../components/svg-icon';

export const SortIconMap = {
    [SortDirection.Asc]: Icon.ArrowUpward,
    [SortDirection.Desc]: Icon.ArrowDownward,
    [SortDirection.None]: ''
}

export const sortDirectionParse = (dir: string) => {
    switch (dir) {
        case 'Asc': return SortDirection.Asc;
        case 'Desc': return SortDirection.Desc;
        default: return SortDirection.None;
    }
}

export const getSortOrder = (sort: string[] | undefined, field: string): number | undefined => {
    if (sort && Array.isArray(sort) && sort.length > 1) {
        const sortIndex = sort.findIndex(p => p.includes(field));
        if (sortIndex < 0) {
            return undefined;
        }
        return sortIndex + 1;
    }
    return undefined;
}

export const getSortDirection = (sorts: string[] | undefined, field: string): SortDirection => {
    if (sorts && sorts.length > 0) {
        let sort = sorts;
        if (Array.isArray(sorts)) {
            sort = sorts.find(p => p.includes(field))?.split(' ') || [];
        }
        if (sort.length === 1) {
            return SortDirection.Asc;
        } else {
            return sortDirectionParse(sort[1]);
        }
    }
    return SortDirection.None;
}

export const updateSort = (sorts: string[], field: string | undefined, direction: SortDirection): string[] => {
    const sortIndex = sorts.findIndex(x => field && x.includes(field));
    const sort = `${field} ${SortDirection[direction]}`;

    if (sortIndex < 0) {
        direction !== SortDirection.None && sorts.push(sort);
    } else {
        if (direction === SortDirection.None) {
            sorts.splice(sortIndex, 1);
        } else {
            sorts[sortIndex] = sort;
        }
    }
    return sorts;
}
