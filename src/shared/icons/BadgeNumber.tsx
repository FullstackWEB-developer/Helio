import './BadgeNumber.scss';
import classnames from 'classnames';

export interface BadgeNumberProps {
    number?: number;
    type?: 'yellow' | 'gray' | 'red',
    hideIfZero?: boolean,
    circleBadge?: boolean,
    wideAutoIfLarger?: boolean
}

export const BadgeNumber = ({type = 'yellow', number = 0, hideIfZero, circleBadge, wideAutoIfLarger}: BadgeNumberProps) => {

    const badgeClasses = classnames(`px-2 light-badge badge-${type}`, {
        'hidden': hideIfZero && (!number || number === 0),
        'w-fit h-fit items-center justify-center rounded-full': wideAutoIfLarger && number >= 10,
        'w-5 h-5 flex items-center justify-center rounded-full': circleBadge || (wideAutoIfLarger && number < 10),
        'rounded-xl': !circleBadge && !wideAutoIfLarger,
    });

    return (
        <div className={badgeClasses}>
            {number}
        </div>
    );
}
