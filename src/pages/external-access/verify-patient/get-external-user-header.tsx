import React from 'react';
import {useTranslation} from 'react-i18next';

export interface GetExternalUserHeaderProps {
    title: string;
    description: string;
}

const GetExternalUserHeader = ({title, description}: GetExternalUserHeaderProps) => {
    const {t} = useTranslation();
    return <>
        <div className='md:whitespace-pre md:h-24 my-1 md:pb-10 w-full items-center'>
            <h4>
                {t(title)}
            </h4>
            </div>
            <div className='pt-10 pb-6 xl:pt-2 xl:pb-10'>
                {t(description)}
            </div>
        </>
}

export default GetExternalUserHeader;
