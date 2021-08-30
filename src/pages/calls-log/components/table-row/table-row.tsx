import classnames from 'classnames';

interface TableRowProps {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}
const TableRow = ({children, className}: TableRowProps) => {
    return (
        <div className={classnames('flex flex-row', className)}>
            {children}
        </div>
    )
}

export default TableRow;


