import {TableModel} from './table.models';
import TableHeader from './table-header';
import TableRow from './table-row';
import React from 'react';

export interface Table2Props {
    model: TableModel
}

const Table = ({model}: Table2Props) => {
    const {columns, rows, hideHeader = false, hasRowsBottomBorder, isCompact = false} = model;
    const rowContent = React.Children.toArray(rows.map(row => {
        return <div className={hasRowsBottomBorder ? 'border-b' : ''}>
            <TableRow isCompact={isCompact} columns={columns} data={row}/>
        </div>
    }));
    return <div className='flex flex-col'>
        {!hideHeader && <TableHeader headers={columns}/>}
        {rowContent}
    </div>;
}

export default (Table);
