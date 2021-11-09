import {TableColumnModel, TableSize} from './table.models';
import './table-row.scss';
import classNames from 'classnames';

export interface TableRowProps {
    data: any[],
    columns: TableColumnModel[],
    size: TableSize,
    rowClass?:string;
}

const TableRow = ({data, columns, size, rowClass=''}: TableRowProps) => {

    const calculatedRowClass = classNames('flex flex-row', {
        rowClass,
        'px-4': size !== 'large',
        'px-6': size === 'large'
    });

    const content = columns.map(column => {
        const {widthClass, rowClassname, field, alignment = 'start', render} = column;
        if (render) {
            return <div key={field} className={widthClass}>{render(data[field as any], data)}</div>;
        }

        return <div key={field}
                    className={`table-row-content${size === 'compact' ? '-compact' : ''} items-center flex body2 ${widthClass} justify-${alignment}`}>
            <div className={`${rowClassname ? rowClassname : ''}`}>{data[field as any]}</div>
        </div>
    })
    return <div className={calculatedRowClass}>{content}</div>;
}

export default TableRow;
