import {useTranslation} from 'react-i18next';
import {ContactExtended, Paging} from '@shared/models';
import SearchBoxContactResultItem from './searchbox-contact-result-item';
import Pagination from '@components/pagination/pagination';

interface SearchBoxContactResultsProps {
    items?: ContactExtended[];
    paging: Paging;
    onSelect?: (contact: ContactExtended) => void;
    onPageChange: (paging: Paging) => void;
}
const SearchBoxContactResults = ({items, paging, onSelect, onPageChange}: SearchBoxContactResultsProps) => {
    const {t} = useTranslation();

    return (
        <div>
            <div className='px-6 pb-7'>
                <div className='flex flex-row justify-between my-7'>
                    <h5>{t('search.search_results.heading_contact')}</h5>
                </div>
                <div className="flex flex-row justify-end mb-6">
                    <Pagination
                        value={paging}
                        onChange={onPageChange}
                    />
                </div>
                <div>
                    <div className='flex flex-row items-center content-center w-full h-12 py-4 bg-gray-100 auto-cols-min px-7 body2-medium'>
                        <div className='flex items-center w-2/12 uppercase'>{t('searchbox_result.name')}</div>
                        <div className='flex items-center w-2/12 uppercase lx:w-1/12'>{t('search.search_results.company')}</div>
                        <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>{t('searchbox_result.email')}</div>
                        <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>{t('searchbox_result.phone')}</div>
                        <div className='flex items-center justify-center w-1/12 '/>
                    </div>
                    {items?.map(contact => <SearchBoxContactResultItem key={contact.id} contact={contact} onSelect={onSelect} />)}
                </div>
            </div>
        </div>
    );
}

export default SearchBoxContactResults;
