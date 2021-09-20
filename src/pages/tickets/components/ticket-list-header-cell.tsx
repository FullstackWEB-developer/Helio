import React, {useState} from 'react';
import SvgIcon from '../../../shared/components/svg-icon/svg-icon';
import {SortDirection} from '../../../shared/models/sort-direction';
import {SortIconMap} from '@shared/utils/sort-utils';

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
                className='pl-2 icon-medium'
                fillClass='active-item-icon' />
        }
        {isSortable && currentSortDirection !== SortDirection.None && sortOrder &&
            <span className='pl-0.5 body3-medium'>{sortOrder}</span>
        }
    </div>);
};

export default TicketListHeaderCell;
