import {ReactNode} from 'react';

export interface TableModel {
    columns: TableColumnModel[];
    rows: any[];
    pageSize?: number;
    pageable?: boolean;
    hideHeader?: boolean;
    hasRowsBottomBorder?: boolean;
    isCompact?: boolean;
    title?: TableTitleModel;
    headerClassName?: string,
    wrapperClassName?: string;
    rowClass?: string;
    isSelected?: (row: any) => boolean;
    emptyMessage?: string;
    showEmptyMessage?: boolean;
}

export interface TableColumnModel {
    title?: string | ReactNode;
    headerClassName?: string;
    rowClassname?: string;
    widthClass: string;
    field: string;
    alignment?: 'start' | 'end' | 'center',
    render?: (field: any, row: any) => ReactNode;
}

export interface TableTitleModel {
    title: string;
    style?: 'default' | 'primary'
}
