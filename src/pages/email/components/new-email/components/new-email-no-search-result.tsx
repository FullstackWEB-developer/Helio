import {useTranslation} from 'react-i18next';

export interface NewEmailNoSearchResultProps {
    searchTerm: string;
}
const NewEmailNoSearchResult = ({searchTerm} : NewEmailNoSearchResultProps) => {
    const {t} = useTranslation();
    return <div className="pt-8 pl-6 body2">{t('search.search_results.empty', {searchTerm: searchTerm})}</div>;
}

export default NewEmailNoSearchResult;
