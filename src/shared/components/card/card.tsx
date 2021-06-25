import React from 'react';
import {useTranslation} from 'react-i18next';
import './card.scss';

export interface CardProps {
    title?: string;
    children: React.ReactNode;
    extra?: React.ReactNode;
}

const Card = ({title, children, extra}: CardProps) => {
    const {t} = useTranslation();
    return <div className='card w-full'>
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
