import {TableModel} from './table.models';
import TableHeader from './table-header';
import TableRow from './table-row';
import React, {useState} from 'react';
import TableTitle from './table-title';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next';
import Pagination from '@components/pagination';
import {Paging} from '@shared/models';

export interface TableProps {
    model: TableModel
}

const Table = ({model}: TableProps) => {
    const {
        columns,
        rows,
        hideHeader = false,
        hasRowsBottomBorder,
        title,
        size = 'normal',
        wrapperClassName = '',
        rowClass,
        pageSize = 10,
        onRowMouseLeave,
        subColumns
    } = model;
    const {t} = useTranslation();
    const [currentPage, setCurrentPage] = useState<number>(1);

    const paginate = (data: any[], pageSize: number, currentPage: number) => {
        return data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }

    const rowContent = () => {
        let data: any[];
        if (model.pageable) {
            data = paginate(rows, pageSize, currentPage);
        } else {
            data = rows;
        }
        return React.Children.toArray(data.filter(row => !!row).map(row => {
            return <div>
                <div className={hasRowsBottomBorder ? 'border-b' : ''} onMouseLeave={() => {onRowMouseLeave && onRowMouseLeave()}}>
                    <TableRow rowClass={classnames(rowClass, {'bg-gray-100': model.isSelected?.(row)})} size={size} columns={columns} data={row}/>
                </div>
                {
                    subColumns && <div className={hasRowsBottomBorder ? 'border-b' : ''} onMouseLeave={() => {onRowMouseLeave && onRowMouseLeave()}}>
                    <TableRow rowClass={classnames(rowClass, {'bg-gray-100': model.isSelected?.(row)})} size={size} columns={subColumns} data={row}/>
                </div>
                }
            </div>
        }));
    }

    const getContent = () => {
        if (rows && rows.length > 0) {
            return rowContent();
        }
        if (model.showEmptyMessage || !!model.emptyMessage) {
            const message = !!model.emptyMessage ? model.emptyMessage : 'components.table.empty_message';
            return <div className='flex justify-center w-full pt-4 body2-medium'>
                {t(message)}
            </div>
        }
    }

    const isPageable = (position: string) => {
        if(model.paginationPosition){
            return model.pageable && (model.paginationPosition === position || model.paginationPosition === 'both') && rows.length > pageSize;
        }else if(position === 'bottom'){
            return model.pageable && rows.length > pageSize;
        }    
    }

    let pagination: Paging = {
        page: currentPage,
        totalPages: Math.ceil(rows.length/ pageSize),
        totalCount: rows.length,
        pageSize: pageSize
    }

    return <div className={`flex flex-col ${wrapperClassName}`}>
        {isPageable('top') && <div className='pb-4 flex justify-end'>
            <Pagination value={pagination} onChange={(data) => setCurrentPage(data.page)} />
        </div>}
        {title && <TableTitle model={title} size={size} />}
        {!hideHeader && <TableHeader size={size} className={model.headerClassName} headers={columns} />}
        {getContent()}
        {isPageable('bottom') && <div className='pt-4 flex justify-end'>
            <Pagination value={pagination} onChange={(data) => setCurrentPage(data.page)} />
        </div>}
    </div>;
}

export default (Table);
