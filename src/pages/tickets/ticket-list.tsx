import { useDispatch, useSelector } from 'react-redux';
import { selectTickets, selectTicketsLoading, selectTicketsPaging } from './store/tickets.selectors';
import React, { useEffect } from 'react';
import { getAssigneeList, getList } from './services/tickets.service';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import { Ticket } from './models/ticket';
import { Paging } from './store/tickets.initial-state';
import TicketsHeader from './tickets-header';
import TicketsSearch from './tickets-search';
import TicketListItem from './ticket-list-item';
import ThreeDots from '../../shared/components/skeleton-loader/skeleton-loader';

const TicketList = () => {
    const dispatch = useDispatch();
    const paging: Paging = useSelector(selectTicketsPaging);
    const items: Ticket[] = useSelector(selectTickets);
    const ticketsLoading = useSelector(selectTicketsLoading);

    useEffect(() => {
        dispatch(getList(paging));
        dispatch(getAssigneeList());
    }, [dispatch]);

    return (
        <div className='flex flex-col h-full w-full'>
            <TicketsHeader />
            <TicketsSearch />
            {
                ticketsLoading ? <ThreeDots />
                    : items.map(item => {
                        return <TicketListItem key={item.id} item={item} />
                    })
            }
        </div>
    );
};

export default withErrorLogging(TicketList);
