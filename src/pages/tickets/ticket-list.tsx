import {useDispatch, useSelector} from 'react-redux';
import {
    selectIsTicketFilterOpen,
    selectTicketFilter,
    selectTickets,
    selectTicketsLoading,
    selectTicketsPaging
} from './store/tickets.selectors';
import React, {useEffect, useState} from 'react';
import {getList, getLookupValues} from './services/tickets.service';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import {Ticket} from './models/ticket';
import TicketsHeader from './tickets-header';
import TicketsSearch from './tickets-search';
import ThreeDots from '../../shared/components/skeleton-loader/skeleton-loader';
import TicketFilter from './components/ticket-filter';
import {getUserList} from '@shared/services/lookups.service';
import {Paging} from '@shared/models/paging.model';
import TicketListContainer from './components/ticket-list-container';
import {TicketQuery} from '@pages/tickets/models/ticket-query';
import {useHistory} from 'react-router-dom';
import queryString from 'query-string';

const TicketList = () => {
    const dispatch = useDispatch();
    const paging: Paging = useSelector(selectTicketsPaging);
    const items: Ticket[] = useSelector(selectTickets);
    const ticketsLoading = useSelector(selectTicketsLoading);
    const isFilterOpen = useSelector(selectIsTicketFilterOpen);
    const currentFilter = useSelector(selectTicketFilter);
    const history = useHistory();
    const [lastAppliedFilter, setLastAppliedFilter] = useState<string>(JSON.stringify(currentFilter));

    useEffect(() => {
        if (lastAppliedFilter !== JSON.stringify(currentFilter)) {
            const {totalCount, totalPages, pageSize, ...filter} = currentFilter;
            history.replace({
                pathname: history.location.pathname,
                search: queryString.stringify(filter)
            });
            setLastAppliedFilter(JSON.stringify(currentFilter))
        }
    }, [currentFilter, history]);


    useEffect(() => {
        const query = queryString.parse(history.location.search);
        let newQuery: TicketQuery = {...query as any as TicketQuery};
        if (newQuery) {
            dispatch(getList(newQuery, true));
        } else {
            dispatch(getList({...paging, sorts: ['Status Asc', 'DueDate Asc']}));
        }
    }, []);

    useEffect(() => {
        dispatch(getUserList());
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketReason'));
        dispatch(getLookupValues('TicketTags'));
    }, [dispatch, paging.page]);

    return (
        <>
            <div className={`${isFilterOpen ? 'w-96 transition-width transition-slowest ease' : 'hidden'}`}>
                <TicketFilter/></div>
            <div className={'flex flex-col h-full w-full'}>
                <TicketsHeader/>
                <TicketsSearch/>
                {ticketsLoading ?
                    <ThreeDots/> :
                    <TicketListContainer dataSource={items}/>
                }
            </div>
        </>
    );
};

export default withErrorLogging(TicketList);
