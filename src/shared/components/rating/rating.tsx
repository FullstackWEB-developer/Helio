import SvgIcon, {Icon} from '@components/svg-icon';
import {useMemo} from 'react';
import classname from 'classnames';
import  './rating.scss';

export interface RatingProps {
    value: number;
    size?: 'small' | 'medium' | 'large',
    scale?:number;
    onClick?:(value: number) => void;
}
const Rating = ({value, scale = 5, size = 'small', onClick} : RatingProps) => {

    if (value > scale) {
        value = scale;
    }

    const onStarClick = (val: number) => {
        if(onClick) {
            onClick(val);
        }
    }

    const activeStars = value;
    const disabledStars = scale - value;

    const starClasses = useMemo(() => {
        return classname({
            'icon-small': size === 'small',
            'icon-medium': size === 'medium',
            'icon-large': size === 'large',
            'cursor-pointer': !!onClick
        });
    }, [onClick, size]);

    const active = activeStars > 0 ? [...Array(activeStars)].map((_, index) => <SvgIcon key={index} type={Icon.Star} onClick={() => onStarClick(index + 1)} className={starClasses} fillClass='rating-fill-color'/>) : <></>
    const disabled = disabledStars > 0 ? [...Array(disabledStars)].map((_, index) => <SvgIcon key={index + activeStars} type={Icon.StarOutlined} onClick={() => onStarClick(index + activeStars + 1)} className={starClasses} fillClass='rating-fill-color'/>) : <></>

    return <div className='flex flex-row space-x-0.5'>{active} {disabled}</div>
}

export default Rating;
