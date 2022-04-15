import {useDispatch, useSelector} from 'react-redux';
import {
    selectTickets,
    selectTicketsLoading,
    selectTicketsPaging,
    selectIsTicketFilterOpen,
    selectTicketFilter,
    selectTicketQueryType
} from './store/tickets.selectors';
import React, {useCallback, useEffect, useState} from 'react';
import {getList} from './services/tickets.service';
import { getLookupValues } from '@shared/services/lookups.service';
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
import {selectLastNavigationDate} from '@shared/layout/store/layout.selectors';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';

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
    const lastNavigationDate = useSelector(selectLastNavigationDate);
    const isDefaultTeam = useCheckPermission('Tickets.DefaultToTeamView');
    const { id } = useSelector(selectAppUserDetails);

    useEffect(() => {
        if (lastAppliedFilter !== JSON.stringify(currentFilter)) {
            const { totalCount, totalPages, pageSize, ...filter } = currentFilter;
            history.replace({
                pathname: history.location.pathname,
                search: queryString.stringify(filter)
            });
            setLastAppliedFilter(JSON.stringify(currentFilter))
        }
    }, [currentFilter, history, history.location.search]);

    const getAssignedTo = useCallback(() => {
        if (!ticketListQueryType && !isDefaultTeam) {
            return !currentFilter.assignedTo && !!id ? [id] : currentFilter.assignedTo;
        } else {
            return ticketListQueryType === TicketListQueryType.MyTicket ? currentFilter.assignedTo ?? [id] : [];
        }
    }, [id]);

    useEffect(() => {
        const query: any = queryString.parse(history.location.search, { parseNumbers: true });
        const newQuery: TicketQuery = { ...query };
        if (!!newQuery && !!history.location.search) {
            dispatch(getList({ ...newQuery, assignedTo: newQuery.assignedTo ?? getAssignedTo() }));
        } else {
            dispatch(getList({
                ...paging,
                assignedTo: getAssignedTo()
            }));
        }
    }, [lastNavigationDate, getAssignedTo]);

    useEffect(() => {
        dispatch(getUserList());
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketReason'));
        dispatch(getLookupValues('TicketTags'));
    }, [dispatch, paging.page]);

    return (
        <div className="flex flex-auto h-full">
            <TicketFilter isOpen={isFilterOpen} />
            <div className='flex flex-col w-full h-full overflow-auto'>
                <TicketsHeader />
                <TicketsSearch />
                {ticketsLoading ?
                    <div /> :
                    <TicketListContainer dataSource={items} />
                }
            </div>
        </div>
    );
};

export default withErrorLogging(TicketList);
