import {ReactNode} from 'react';

export interface TableModel {
    columns: TableColumnModel[];
    rows: any[];
    hideHeader?: boolean;
    hasRowsBottomBorder?: boolean;
    isCompact?: boolean;
}

export interface TableColumnModel {
    title?: string | ReactNode;
    headerClassName?: string;
    rowClassname?: string;
    widthClass: string;
    field: string;
    alignment?: 'start' | 'end' | 'center'
}
