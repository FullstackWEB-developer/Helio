import {TableModel} from './table.models';
import TableHeader from './table-header';
import TableRow from './table-row';
import React from 'react';
import TableTitle from './table-title';

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
    const rowContent = React.Children.toArray(rows.map(row => {
        return <div className={hasRowsBottomBorder ? 'border-b' : ''}>
            <TableRow rowClass={rowClass} isCompact={isCompact} columns={columns} data={row}/>
        </div>
    }));
    return <div className={`flex flex-col ${wrapperClassName}`}>
        {title && <TableTitle model={title} isCompact={isCompact}/>}
        {!hideHeader && <TableHeader className={model.headerClassName} headers={columns}/>}
        {rowContent}
    </div>;
}

export default (Table);
