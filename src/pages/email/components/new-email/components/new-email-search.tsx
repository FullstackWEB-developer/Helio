import SearchBox from '@components/searchbox';
import {useTranslation} from 'react-i18next';
import SvgIcon, {Icon} from '@components/svg-icon';
import React from 'react';

export interface NewEmailSearchProps{
    onSearchHandler: (type: number, value: string) => void;
    value?: string;
    onValueClear: () => void;
}

const NewEmailSearch = ({onSearchHandler, value, onValueClear} : NewEmailSearchProps) => {
    const {t} = useTranslation();

    return <div className={`flex flex-row items-center w-full px-4 border-b`}>
        <div className='pr-1 body2'>{t('email.new_email.to')}</div>
        {value ? <div className='flex items-center flex-row justify-between h-16 w-full'>
                    <div>{value}</div>
                    <div data-testid="clear-button" className='cursor-pointer pr-4' onClick={() => onValueClear()}>
                        <SvgIcon type={Icon.Clear} fillClass="clear-input-icon-fill" />
                    </div>
                </div> :
        <SearchBox
            className='w-full'
            placeholder='email.new_email.search_placeholder'
            dropdownClassName='z-10'
            onSearch={(type, value) => onSearchHandler(type, value)}
        />}
    </div>;
}

export default  NewEmailSearch;
