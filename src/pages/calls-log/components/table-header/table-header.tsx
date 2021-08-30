import classnames from 'classnames';

interface TableHeaderProps {
    children?: React.ReactNode | React.ReactNode[],
    className?: string;

}
const TableHeader = ({children, className, ...props}: TableHeaderProps) => {
    return (
        <div className={classnames('flex flex-row items-center content-center h-12 bg-gray-100 body2-medium', className)}>
            {children}
        </div>
    )
}

export default TableHeader
