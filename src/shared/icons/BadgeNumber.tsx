import './BadgeNumber.scss';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next';

export interface BadgeNumberProps {
    number?: number;
    type?: 'yellow' | 'gray' | 'red' | 'blue',
    hideIfZero?: boolean,
    circleBadge?: boolean,
    wideAutoIfLarger?: boolean,
    tooltipOnOverflow?: boolean
}

export const BadgeNumber = ({type = 'yellow', number = 0, hideIfZero, circleBadge, wideAutoIfLarger, tooltipOnOverflow}: BadgeNumberProps) => {
    const {t} = useTranslation();
    const badgeClasses = classnames(`px-2 light-badge badge-${type}`, {
        'hidden': hideIfZero && (!number || number === 0),
        'w-fit h-fit items-center justify-center rounded-full': wideAutoIfLarger && number >= 10,
        'w-5 h-5 flex items-center justify-center rounded-full': circleBadge || (wideAutoIfLarger && number < 10),
        'rounded-xl': !circleBadge && !wideAutoIfLarger,
    });

    return (
        <div className={badgeClasses}>
            {(number > 999 && tooltipOnOverflow) ? t('common.overflow_value_1k') : number}
        </div>
    );
}
