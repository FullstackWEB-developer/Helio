import React from 'react';
import {useTranslation} from 'react-i18next';
import './card.scss';
import classnames from 'classnames';

export interface CardProps {
    title?: string;
    children: React.ReactNode;
    extra?: React.ReactNode;
    hasBorderRadius?: boolean,
    hasFullHeight?: boolean
}

const Card = ({title, children, extra, hasBorderRadius = false, hasFullHeight = false}: CardProps) => {
    const {t} = useTranslation();
    const cardClass = classnames('card w-full', {
        'rounded-xl' : hasBorderRadius,
        'h-full' : hasFullHeight
    });
    return <div className={cardClass}>
        { title &&
        <div className='h-14 px-6 pt-5 h7 w-full flex justify-between'>
            <div>
                {t(title)}
            </div>
            { extra &&
            <div>
                {extra}
            </div>}
        </div>
        }
        <div className='w-full'>
            {children}
        </div>
    </div>
}

export default Card;
