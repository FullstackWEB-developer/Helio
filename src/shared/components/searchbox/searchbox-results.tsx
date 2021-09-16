import {useTranslation} from 'react-i18next';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import SearchBoxResultItem from './searchbox-result-item';
interface SearchBoxResultsProps {
    items?: ExtendedPatient[];
    onSelect?: (patient: ExtendedPatient) => void;
}
const SearchBoxResults = ({items, onSelect}: SearchBoxResultsProps) => {
    const {t} = useTranslation();

    if (items?.length === 0) {
        return null;
    }

    const heading = (items !== undefined && items.length > 0)
        ? t('patient.search_heading_result')
        : t('search.search_results.heading_empty');
    return (
        <div>
            <div className='px-6 pb-7'>
                <div className='flex flex-row justify-between my-7'>
                    <h5>{heading}</h5>
                </div>
                <div>
                    <div className='flex flex-row items-center content-center w-full h-12 py-4 bg-gray-100 auto-cols-min px-7 body2-medium'>
                        <div className='flex items-center w-2/12 uppercase'>{t('searchbox_result.name')}</div>
                        <div className='flex items-center w-2/12 uppercase lx:w-1/12'>{t('searchbox_result.id')}</div>
                        <div className='flex items-center w-2/12 uppercase lx:w-1/12'>{t('searchbox_result.dob')}</div>
                        <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>{t('searchbox_result.email')}</div>
                        <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12'>{t('searchbox_result.phone')}</div>
                        <div className='flex items-center justify-center w-2/12 uppercase lx:w-1/12 whitespace-nowrap'>{t('searchbox_result.text_consent')}</div>
                        <div className='flex items-center justify-center w-1/12 '/>
                    </div>
                    {items?.map(patient => <SearchBoxResultItem key={patient.patientId} patient={patient} onSelect={onSelect} />)}
                </div>
            </div>
        </div>
    );
}

export default SearchBoxResults;
