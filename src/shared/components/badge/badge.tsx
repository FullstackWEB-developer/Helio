import classnames from 'classnames';
import './badge.scss';

interface BadgeProps {
    text?: string,
    className?: string,
    type?: 'default' | 'danger'
}

const Badge = ({text, className, type = 'default'}: BadgeProps) => {
    return (<span className={classnames('rounded-full px-2 badge flex content-center items-center', `badge-${type}`, className)}> {text} </span>);
}

export default Badge;
