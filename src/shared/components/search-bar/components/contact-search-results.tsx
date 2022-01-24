import {SearchContactResults} from '@constants/react-query-constants';
import React, {useEffect, useMemo, useState} from 'react';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import {queryContacts, queryContactsByPhone} from '@shared/services/search.service';
import {useHistory} from 'react-router';
import {selectSearchTerm, selectSelectedType} from '../store/search-bar.selectors';
import {useTranslation} from 'react-i18next';
import {Address, AddressType} from '@shared/models/address.model';
import utils from '@shared/utils/utils';
import {ContactExtended, DefaultPagination, Paging} from '@shared/models';
import SvgIcon, {Icon} from '@components/svg-icon';
import Pagination from '@components/pagination/pagination';
import NoSearchResults from '../components/no-search-results';
import {setSearchTermDisplayValue} from '../store/search-bar.slice';
import {searchTypeContact} from '@components/search-bar/constants/search-type';

const ContactSearchResults = () => {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const searchTerm = useSelector(selectSearchTerm);
    const selectedType = useSelector(selectSelectedType);
    const [paginationProperties, setPaginationProperties] = useState<Paging>(DefaultPagination);
    const {data, isFetching, isError} = useQuery([SearchContactResults, searchTerm, selectedType, paginationProperties.page],
        () => selectedType === searchTypeContact.phone ? queryContactsByPhone(searchTerm, paginationProperties.page) : queryContacts(searchTerm, paginationProperties.page), {
        onSuccess: (data) => {
            setPaginationProperties({
                page: data.page,
                pageSize: data.pageSize,
                totalCount: data.totalCount,
                totalPages: data.totalPages
            });
        }
    });

    const history = useHistory();

    useEffect(() => {
        dispatch(setGlobalLoading(isFetching));
        if (data?.results && data.results.length === 1 && !isFetching) {
            handleContactSelection(data.results[0].id);
        }
    }, [isFetching]);

    useEffect(() => {
        setPaginationProperties(DefaultPagination);
    }, [searchTerm])

    const displayAddress = (addressArray: Address[]) => {
        const address = addressArray.find(a => a.addressType === AddressType.PrimaryAddress) || addressArray[0];
        const line = address.line ? `${address.line}, ` : '';
        const city = address.city ? `${address.city}, ` : '';
        const state = address.state ? `${address.state}, ` : '';
        const zip = address.zipCode ? `${address.zipCode}` : '';
        return `${line}${city}${state}${zip}`;
    }

    const handleContactSelection = (contactId: string) => {
        dispatch(setSearchTermDisplayValue(''));
        history.push(`/contacts/${contactId}`);
    }

    const handlePageChange = (p: Paging) => {
        setPaginationProperties(p);
    }

    const shouldDisplayPhoneHint = useMemo(() =>
    {
        if (searchTypeContact.phone !== selectedType) {
            return false;
        }
        const term = searchTerm.replace('(','')
            .replaceAll(')','')
            .replaceAll(' ','')
            .replaceAll('-','');
        return term.length !== 10;
    },[searchTerm, selectedType])

    return (
        <>
            <div className="p-6 flex justify-between items-center">
                <h5>{t('search.search_results.heading_contact')}</h5>
                {paginationProperties.totalCount !== DefaultPagination.totalCount
                     && <Pagination value={paginationProperties} onChange={handlePageChange} />}
            </div>

            {
                data?.results && data.results?.length > 0 && !isFetching &&
                <>
                    <div className="search-results-grid head-row col-template-contacts caption-caps h-12 px-6">
                        <div className="truncate">{t('search.search_results.last_name')}</div>
                        <div className="truncate">{t('search.search_results.first_name')}</div>
                        <div className="truncate">{t('search.search_results.company')}</div>
                        <div className="truncate">{t('search.search_results.position')}</div>
                        <div className="truncate">{t('search.search_results.address')}</div>
                        <div className="truncate">{t('search.search_results.phone')}</div>
                        <div className="truncate"/>
                    </div>
                    {
                        data.results.map((c: ContactExtended) => (
                            <div key={c.id} className="search-results-grid data-row h-10 col-template-contacts px-6 body2">
                                <div className="truncate">{c.lastName || ''}</div>
                                <div className="truncate">{c.firstName || ''}</div>
                                <div className="truncate">{c.companyName || ''}</div>
                                <div className="truncate">{c.jobTitle || ''}</div>
                                <div className="truncate">{c.addresses && c.addresses.length > 0 && (displayAddress(c.addresses) || '')}</div>
                                <div className="truncate">{c.mobilePhone && utils.formatPhone(c.mobilePhone)}</div>
                                <div className="truncate">
                                    <SvgIcon type={Icon.View} className="cursor-pointer" fillClass="search-results-icon-fill"
                                        onClick={() => c.id ? handleContactSelection(c.id) : null} />
                                </div>
                            </div>
                        ))
                    }
                </>
            }
            {
                (isError || data?.results?.length === 0) && <div>
                    <NoSearchResults />
                    {searchTypeContact.contactName === selectedType && <div className='pl-6 pt-8 body2-medium whitespace-pre-line'>{t('search.search_by_contact_name_no_result')}</div> }
                    {shouldDisplayPhoneHint && <div className='pl-6 pt-8 body2-medium whitespace-pre-line'>{t('search.search_by_phone_no_result')}</div>}
                </div>
            }
        </>
    )
}

export default ContactSearchResults;
