import {TableColumnModel} from './table.models';
import './table-row.scss';

export interface TableRowProps {
    data: any[],
    columns: TableColumnModel[],
    isCompact: boolean
}

const TableRow = ({data, columns, isCompact}: TableRowProps) => {

    const content = columns.map(column => {
        const {widthClass, rowClassname, field, alignment = 'start'} = column;
        return <div key={field}
                    className={`table-row-content${isCompact ? '-compact' : ''} items-center flex body2 ${widthClass} justify-${alignment}`}>
            <div className={`${rowClassname ? rowClassname : ''}`}>{data[field as any]}</div>
        </div>
    })
    return <div className='flex flex-row px-4'>{content}</div>;
}

export default TableRow;
