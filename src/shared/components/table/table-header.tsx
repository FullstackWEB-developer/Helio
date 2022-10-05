import {TableColumnModel, TableSize} from './table.models';
import {useTranslation} from 'react-i18next';
import React, {useState} from 'react';
import SvgIcon from '@components/svg-icon';
import classnames from 'classnames';
import {SortDirection} from '@shared/models/sort-direction';
import {SortIconMap} from '@shared/utils/sort-utils';
import './table-header.scss';
import TooltipWrapper from '@components/tooltip/tooltip-wrapper';

export interface TableHeaderProps {
    headers?: TableColumnModel[];
    className?: string;
    size: TableSize;
    allowMultiSort?: boolean;
}

const TableHeaderColumn = ({header, allowMultiSort, setSortFields, currentSortFields}: {header: TableColumnModel, allowMultiSort?: boolean, setSortFields: (sortFields: string[]) => void, currentSortFields: string[]}) => {
    const {t} = useTranslation();
    const [currentSortDirection, setSortDirection] = useState(header.sortDirection ?? SortDirection.None);

    const {headerClassName, field, widthClass, alignment = 'start', title, isSortable, sortDirectionFillCalss = 'active-item-icon', sortIconSizeClass = 'icon-medium', tooltip} = header;
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

        if(allowMultiSort && newSortDirection !== SortDirection.None && currentSortFields && currentSortFields.filter(x => x === field).length === 0){
            setSortFields([...currentSortFields, field]);
        }else if(allowMultiSort && newSortDirection === SortDirection.None && currentSortFields && currentSortFields.filter(x => x === field).length === 1){
            setSortFields(currentSortFields.filter(x => x !== field));
        }else if(!allowMultiSort && newSortDirection !== SortDirection.None){
            setSortFields([field]);
        }else if(!allowMultiSort && newSortDirection === SortDirection.None){
            setSortFields([]);
        }

        if (header.onClick) {
            header.onClick(field, newSortDirection);
        }
    }


    if (typeof title === 'string') {
        return (
            <div key={field} className={className}>
                <TooltipWrapper content={tooltip} placement='top'>
                    <div data-testid={header.dataTestId} className='flex items-center flex-row' onClick={onClicked}>{t(title)}
                        {isSortable && currentSortDirection !== SortDirection.None && currentSortFields && currentSortFields.filter(x => x === field).length === 1 &&
                            <SvgIcon type={SortIconMap[currentSortDirection]}
                                className={`pl-2 ${sortIconSizeClass}`}
                                fillClass={sortDirectionFillCalss} />
                        }
                        {isSortable && currentSortDirection !== SortDirection.None && header.sortOrder && currentSortFields && currentSortFields.filter(x => x === field).length === 1 &&
                            <span className='pl-0.5 body3-medium'>{header.sortOrder}</span>
                        }
                    </div>
                </TooltipWrapper>
            </div>
        );
    } else if (React.isValidElement(title)) {
        return <div data-testid={header.dataTestId} key={field} className={className} onClick={onClicked}>{title}{isSortable && currentSortDirection !== SortDirection.None && currentSortFields && currentSortFields.filter(x => x === field).length === 1 &&
            <SvgIcon type={SortIconMap[currentSortDirection]}
                className={`pl-2 ${sortIconSizeClass}`}
                fillClass={sortDirectionFillCalss} />
        }
        {isSortable && currentSortDirection !== SortDirection.None && header.sortOrder && currentSortFields && currentSortFields.filter(x => x === field).length === 1 &&
            <span className='pl-0.5 body3-medium'>{header.sortOrder}</span>
        }</div>;
    } else {
        return null;
    }
};

const TableHeader = ({headers, className, size, allowMultiSort}: TableHeaderProps) => {
    let initialSortedHeaders = headers?.filter(x => x.sortDirection !== SortDirection.None && x.sortDirection !== undefined);
    const [currentSortFields, setSortFields] = useState<string[]>(initialSortedHeaders ? initialSortedHeaders.map(a => a.field) : []);
    if (!headers) {
        return null;
    }
    
    const content = React.Children.toArray(headers.map(header => <TableHeaderColumn header={header} allowMultiSort={allowMultiSort} setSortFields={setSortFields} currentSortFields={currentSortFields}/>));
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
