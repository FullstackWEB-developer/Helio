import {useDispatch, useSelector} from 'react-redux';
import {
    selectTickets,
    selectTicketsLoading,
    selectTicketsPaging,
    selectIsTicketFilterOpen,
    selectTicketFilter,
    selectTicketQueryType
} from './store/tickets.selectors';
import React, {useEffect, useState} from 'react';
import {getList, getLookupValues} from './services/tickets.service';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import {Ticket} from './models/ticket';
import TicketsHeader from './tickets-header';
import TicketsSearch from './tickets-search';
import TicketFilter from './components/ticket-filter';
import {getUserList} from '@shared/services/lookups.service';
import {Paging} from '@shared/models/paging.model';
import TicketListContainer from './components/ticket-list-container';
import {TicketListQueryType} from './models/ticket-list-type';
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
    const ticketListQueryType = useSelector(selectTicketQueryType);
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
        const query: any = queryString.parse(history.location.search, {parseNumbers: true});
        const newQuery: TicketQuery = {...query};
        if (newQuery) {
            dispatch(getList(newQuery));
        } else {
            dispatch(getList({
                ...paging,
                assignedTo: ticketListQueryType === TicketListQueryType.MyTicket ? currentFilter.assignedTo : []
            }));
        }
    },[]);

    useEffect(() => {
        dispatch(getUserList());
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketReason'));
        dispatch(getLookupValues('TicketTags'));
    }, [dispatch, paging.page]);

    return (
        <div className="flex flex-auto h-full">
            <TicketFilter isOpen={isFilterOpen} />
            <div className='flex flex-col h-full w-full overflow-auto'>
                <TicketsHeader />
                <TicketsSearch />
                {ticketsLoading ?
                    <div/>:
                    <TicketListContainer dataSource={items} />
                }
            </div>
        </div>
    );
};

export default withErrorLogging(TicketList);
