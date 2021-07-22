import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {selectSearchTerm} from '../store/search-bar.selectors';

const NoSearchResults = () => {
    const searchTerm = useSelector(selectSearchTerm);
    const {t} = useTranslation();
    return (
        <div className="body2 pl-6 pt-8">{t('search.search_results.empty', {searchTerm: searchTerm})}</div>
    );
}

export default NoSearchResults;