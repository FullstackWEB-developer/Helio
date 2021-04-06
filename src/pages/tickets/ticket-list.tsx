import { useDispatch, useSelector } from 'react-redux';
import {
    selectTickets,
    selectTicketsLoading,
    selectTicketsPaging,
    selectIsTicketFilterOpen
} from './store/tickets.selectors';
import React, { useEffect } from 'react';
import { getList, getLookupValues } from './services/tickets.service';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import { Ticket } from './models/ticket';
import TicketsHeader from './tickets-header';
import TicketsSearch from './tickets-search';
import TicketListItem from './ticket-list-item';
import ThreeDots from '../../shared/components/skeleton-loader/skeleton-loader';
import TicketFilter from './components/ticket-filter';
import { getUserList } from '@shared/services/lookups.service';
import { Paging } from '@shared/models/paging.model';

const TicketList = () => {
    const dispatch = useDispatch();
    const paging: Paging = useSelector(selectTicketsPaging);
    const items: Ticket[] = useSelector(selectTickets);
    const ticketsLoading = useSelector(selectTicketsLoading);
    const isFilterOpen = useSelector(selectIsTicketFilterOpen);
    useEffect(() => {
        dispatch(getList(paging));
        dispatch(getUserList());
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketReason'));
        dispatch(getLookupValues('TicketTags'));
    }, [dispatch]);

    return (
        <>
            <div className={`${isFilterOpen ? 'w-96 transition-width transition-slowest ease' : 'hidden'}`}><TicketFilter/></div>
            <div className={'flex  flex-col h-full w-full'}>
                <TicketsHeader />
                <TicketsSearch />
                {
                    ticketsLoading ? <ThreeDots />
                        : items.map(item => {
                            return <TicketListItem key={item.id} item={item} />
                        })
                }
            </div>
        </>
    );
};

export default withErrorLogging(TicketList);
