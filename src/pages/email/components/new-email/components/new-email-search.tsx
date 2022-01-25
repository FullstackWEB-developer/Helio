import SearchBox from '@components/searchbox';
import {useTranslation} from 'react-i18next';

export interface NewEmailSearchProps{
    onSearchHandler: (type: number, value: string) => void;
    value?: string;
}

const NewEmailSearch = ({onSearchHandler, value} : NewEmailSearchProps) => {
    const {t} = useTranslation();

    return <div className={`flex flex-row items-center w-full px-4 border-b`}>
        <div className='pr-1 body2'>{t('email.new_email.to')}</div>
        {value ? <div className='flex items-center h-16'>{value}</div> :
        <SearchBox
            className='w-full'
            placeholder='email.new_email.search_placeholder'
            dropdownClassName='z-10'
            onSearch={(type, value) => onSearchHandler(type, value)}
        />}
    </div>;
}

export default  NewEmailSearch;
