import Pagination from '@components/pagination/pagination';
import SvgIcon, {Icon} from '@components/svg-icon';
import {SearchTicketResults} from '@constants/react-query-constants';
import {Ticket} from '@pages/tickets/models/ticket';
import {selectEnumValues, selectLookupValuesAsOptions} from '@pages/tickets/store/tickets.selectors';
import {DefaultPagination, Paging} from '@shared/models';
import {queryTickets} from '@shared/services/search.service';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import utils from '@shared/utils/utils';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router';
import {selectSearchTerm} from '../store/search-bar.selectors';
import {setSearchTermDisplayValue} from '../store/search-bar.slice';
import NoSearchResults from './no-search-results';

const TicketSearchResults = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const searchTerm = useSelector(selectSearchTerm);
    const [paginationProperties, setPaginationProperties] = useState<Paging>(DefaultPagination);
    const reasonOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketReason'));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const {data, isFetching, isError} = useQuery([SearchTicketResults, searchTerm, paginationProperties.page],
        () => queryTickets(searchTerm, paginationProperties.page), {
        onSuccess: (data) => {
            setPaginationProperties({
                page: data.page,
                pageSize: data.pageSize,
                totalCount: data.totalCount,
                totalPages: data.totalPages
            });
        }
    });

    useEffect(() => {
        dispatch(setGlobalLoading(isFetching));
        if (data?.results && data.results.length === 1 && !isFetching) {
            handleTicketSelection(data.results[0].ticketNumber);
        }
    }, [isFetching]);

    useEffect(() => {
        setPaginationProperties(DefaultPagination);
    }, [searchTerm]);

    const handlePageChange = (p: Paging) => {
        setPaginationProperties(p);
    }

    const handleTicketSelection = (ticketNumber: number) => {
        dispatch(setSearchTermDisplayValue(''));
        history.push(`/tickets/${ticketNumber}`);
    }

    return (
        <>
            <div className="p-6 flex justify-between items-center">
                <h5>{t('search.search_results.heading_ticket')}</h5>
                {paginationProperties.totalCount !== DefaultPagination.totalCount
                    && data && <Pagination value={paginationProperties} onChange={handlePageChange} />}
            </div>
            {
                data?.results && data.results?.length > 0 && !isFetching &&
                <>
                    <div className="search-results-grid head-row col-template-tickets caption-caps h-12 px-6">
                        <div className="truncate">{t('search.search_results.ticket_id')}</div>
                        <div className="truncate">{t('search.search_results.subject')}</div>
                        <div className="truncate">{t('search.search_results.name')}</div>
                        <div className="truncate">{t('search.search_results.ticket_type')}</div>
                        <div className="truncate">{t('search.search_results.reason')}</div>
                        <div className="truncate">{t('search.search_results.created')}</div>
                        <div className="truncate"></div>
                    </div>
                    {
                        data.results.map((t: Ticket) => (
                            <div key={t.id} className="search-results-grid data-row h-10 col-template-tickets px-6 body2">
                                <div className="truncate">{t.ticketNumber || ''}</div>
                                <div className="truncate subtitle2">{t.subject || ''}</div>
                                <div className="truncate">{t.createdForName || ''}</div>
                                <div className="truncate">{t.type ? ticketTypes.find(ticketType => ticketType.key === Number(t.type))?.value : ''}</div>
                                <div className="truncate">{t.reason ? reasonOptions.find(reason => reason.value === t.reason)?.label : ''}</div>
                                <div className="truncate body3-small">{t.createdOn && utils.formatUtcDate(t.createdOn, 'MMM DD, YYYY h:mm A')}</div>
                                <div className="truncate">
                                    <SvgIcon type={Icon.View} className="cursor-pointer" fillClass="search-results-icon-fill"
                                        onClick={() => t.ticketNumber ? handleTicketSelection(t.ticketNumber) : null} />
                                </div>
                            </div>
                        ))
                    }
                </>
            }
            {
                (isError || data?.results?.length === 0) && <NoSearchResults />
            }
        </>
    )
}

export default TicketSearchResults;
