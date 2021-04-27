import React from 'react';
import {useTranslation} from 'react-i18next';
import './card.scss';

export interface CardProps {
    title: string;
    children: React.ReactNode;
}

const Card = ({title, children}: CardProps) => {
    const {t} = useTranslation();
    return <div className='card w-full'>
        <div className='h-14 pl-6 pt-5 h7 w-full'>
            {t(title)}
        </div>
        <div className='w-full'>
            {children}
        </div>
    </div>
}

export default Card;
