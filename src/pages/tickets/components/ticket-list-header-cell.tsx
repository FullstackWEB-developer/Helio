import React, {useState} from 'react';
import SvgIcon from '../../../shared/components/svg-icon/svg-icon';
import {SortDirection} from '../models/sort-direction';
import {sortDirectionParse, SortIconMap} from '../utils/sortUtils';

export interface TicketListHeaderCellProps {
    className?: string,
    children?: React.ReactNode | React.ReactNode[],
    field?: string,
    isSortable?: boolean,
    sortOrder?: number,
    sortDirection?: SortDirection,
    onClick?: (field: string | undefined, sortDirection: SortDirection) => void
}

const TicketListHeaderCell = ({
    className,
    children,
    sortOrder,
    field,
    isSortable = false,
    sortDirection = SortDirection.None,
    ...props
}: TicketListHeaderCellProps) => {
    const [currentSortDirection, setSortDirection] = useState(sortDirection);

    const onClicked = () => {
        if (!isSortable) {
            return;
        }
        const maxValue = Object.values(SortDirection).filter(v => isNaN(Number(v))).length;
        let sortDirection: SortDirection = currentSortDirection + 1;

        if (sortDirection >= maxValue) {
            sortDirection = SortDirection.None;
        }
        setSortDirection(sortDirection);

        if (props.onClick) {
            props.onClick(field, sortDirection);
        }
    }

    return (<div className={`uppercase flex items-center ${className} ${isSortable ? 'cursor-pointer' : ''}`} onClick={onClicked}>
        {children}
        {isSortable && currentSortDirection !== SortDirection.None &&
            <SvgIcon type={SortIconMap[currentSortDirection]}
                className='icon-medium pl-2'
                fillClass='active-item-icon' />
        }
        {isSortable && currentSortDirection !== SortDirection.None && sortOrder &&
            <span className='pl-0.5 body3-medium'>{sortOrder}</span>
        }
    </div>);
};

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

export default TicketListHeaderCell;
