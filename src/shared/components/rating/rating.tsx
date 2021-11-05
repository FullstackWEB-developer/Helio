import SvgIcon, {Icon} from '@components/svg-icon';
import {useMemo} from 'react';
import classname from 'classnames';
import  './rating.scss';

export interface RatingProps {
    value: number;
    size?: 'small' | 'medium' | 'large',
    scale?:number;
}
const Rating = ({value, scale = 5, size = 'small'} : RatingProps) => {

    if (value > scale) {
        value = scale;
    }

    const activeStars = value;
    const disabledStars = scale - value;

    const starClasses = useMemo(() => {
        return classname({
            'icon-small': size === 'small',
            'icon-medium': size === 'medium',
            'icon-large': size === 'large'
        });
    }, [size]);

    const active = activeStars > 0 ? [...Array(activeStars)].map(() => <SvgIcon type={Icon.Star} className={starClasses} fillClass='rating-fill-color'/>) : <></>
    const disabled = disabledStars > 0 ? [...Array(disabledStars)].map(() => <SvgIcon type={Icon.StarOutlined} className={starClasses} fillClass='rating-fill-color'/>) : <></>

    return <div className='flex flex-row space-x-0.5'>{active} {disabled}</div>
}

export default Rating;
