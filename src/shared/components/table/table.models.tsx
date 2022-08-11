import {SortDirection} from '@shared/models/sort-direction';
import {ReactNode} from 'react';

export type TableSize = 'compact' | 'normal' | 'large';

export interface TableModel {
    columns: TableColumnModel[];
    subColumns?: TableColumnModel[];
    rows: any[];
    pageSize?: number;
    pageable?: boolean;
    hideHeader?: boolean;
    hasRowsBottomBorder?: boolean;
    title?: TableTitleModel;
    headerClassName?: string,
    wrapperClassName?: string;
    rowClass?: string;
    isSelected?: (row: any) => boolean;
    emptyMessage?: string;
    showEmptyMessage?: boolean;
    size?: TableSize;
    paginationPosition?: 'top' | 'bottom' | 'both';
    onRowMouseLeave?: () => void;
}

export interface TableColumnModel {
    title?: string | ReactNode;
    headerClassName?: string;
    rowClassname?: string;
    widthClass: string;
    field: string;
    isSortable?: boolean;
    sortOrder?: number;
    sortDirection?: SortDirection;
    alignment?: 'start' | 'end' | 'center';
    onClick?: (field: string | undefined, sortDirection: SortDirection) => void
    render?: (field: any, row: any) => ReactNode;
    disableNoneSort?: boolean
}

export interface TableTitleModel {
    title: string;
    style?: 'default' | 'primary'
}
