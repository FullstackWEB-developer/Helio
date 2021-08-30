import {TableModel} from './table.models';
import TableHeader from './table-header';
import TableRow from './table-row';
import React from 'react';
import TableTitle from './table-title';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next';

export interface Table2Props {
    model: TableModel
}

const Table = ({model}: Table2Props) => {
    const {
        columns,
        rows,
        hideHeader = false,
        hasRowsBottomBorder,
        title,
        isCompact = false,
        wrapperClassName = '',
        rowClass
    } = model;
    const {t} = useTranslation();

    const rowContent = () => React.Children.toArray(rows.map(row => {
        return <div className={hasRowsBottomBorder ? 'border-b' : ''}>
            <TableRow rowClass={classnames(rowClass, {'bg-gray-100': model.isSelected?.(row)})} isCompact={isCompact} columns={columns} data={row}/>
        </div>
    }));

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
    return <div className={`flex flex-col ${wrapperClassName}`}>
        {title && <TableTitle model={title} isCompact={isCompact} />}
        {!hideHeader && <TableHeader className={model.headerClassName} headers={columns} />}
        {getContent()}
    </div>;
}

export default (Table);
