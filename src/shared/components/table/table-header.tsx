import {TableColumnModel, TableSize} from './table.models';
import {useTranslation} from 'react-i18next';
import React, {useState} from 'react';
import SvgIcon from '@components/svg-icon';
import classnames from 'classnames';
import {SortDirection} from '@shared/models/sort-direction';
import {SortIconMap} from '@shared/utils/sort-utils';
import './table-header.scss';

export interface TableHeaderProps {
    headers?: TableColumnModel[];
    className?: string;
    size: TableSize;
}

const TableHeaderColumn = ({header}: {header: TableColumnModel}) => {
    const {t} = useTranslation();
    const [currentSortDirection, setSortDirection] = useState(header.sortDirection ?? SortDirection.None);

    const {headerClassName, field, widthClass, alignment = 'start', title, isSortable} = header;
    const className = classnames('flex', `justify-${alignment}`, headerClassName, widthClass, {'cursor-pointer': isSortable});

    const onClicked = () => {
        if (!isSortable) {
            return;
        }
        const maxValue = Object.values(SortDirection).filter(v => isNaN(Number(v))).length;
        let newSortDirection: SortDirection = currentSortDirection + 1;

        if (newSortDirection >= maxValue) {
            newSortDirection = header.disableNoneSort ? SortDirection.Asc : SortDirection.None;
        }
        setSortDirection(newSortDirection);

        if (header.onClick) {
            header.onClick(field, newSortDirection);
        }
    }


    if (typeof title === 'string') {
        return (
            <div key={field} className={className} onClick={onClicked}>{t(title)}
                {isSortable && currentSortDirection !== SortDirection.None &&
                    <SvgIcon type={SortIconMap[currentSortDirection]}
                        className='pl-2 icon-medium'
                        fillClass='active-item-icon' />
                }
                {isSortable && currentSortDirection !== SortDirection.None && header.sortOrder &&
                    <span className='pl-0.5 body3-medium'>{header.sortOrder}</span>
                }
            </div>
        );
    } else if (React.isValidElement(title)) {
        return <div key={field} className={className}>{title}</div>;
    } else {
        return null;
    }
};

const TableHeader = ({headers, className, size}: TableHeaderProps) => {
    if (!headers) {
        return null;
    }

    const content = React.Children.toArray(headers.map(header => <TableHeaderColumn header={header}/>));
    const headerClassName = classnames('flex flex-row caption-caps table-header h-8 items-center', className, {
        'h-12': size === 'large',
        'px-4': size !== 'large',
        'px-6': size === 'large'
    });
    return (
        <div
            className={headerClassName}
        >
            {content}
        </div>
    );
}

export default TableHeader;
