import './BadgeNumber.scss';
import classnames from 'classnames';

export interface BadgeNumberProps {
    number?: number;
    type?: 'yellow' | 'gray' | 'red',
    hideIfZero?: boolean,
    circleBadge?: boolean
}

export const BadgeNumber = ({type = 'yellow', number = 0, hideIfZero, circleBadge}: BadgeNumberProps) => {

    const badgeClasses = classnames(`px-2 light-badge badge-${type}`, {
        'hidden': hideIfZero && (!number || number === 0),
        'w-5 h-5 flex items-center justify-center rounded-full': circleBadge,
        'rounded-xl': !circleBadge
    });

    return (
        <div className={badgeClasses}>
            {number}
        </div>
    );
}
