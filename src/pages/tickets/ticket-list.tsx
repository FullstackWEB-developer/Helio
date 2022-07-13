import { useDispatch, useSelector } from 'react-redux';
import {
    selectTickets,
    selectTicketsLoading,
    selectTicketsPaging,
    selectIsTicketFilterOpen,
    selectTicketFilter,
    selectTicketQueryType
} from './store/tickets.selectors';
import { useCallback, useEffect, useState } from 'react';
import { getList } from './services/tickets.service';
import { getLookupValues } from '@shared/services/lookups.service';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import { Ticket } from './models/ticket';
import TicketsHeader from './tickets-header';
import TicketsSearch from './tickets-search';
import TicketFilter from './components/ticket-filter';
import { getUserList } from '@shared/services/lookups.service';
import { Paging } from '@shared/models/paging.model';
import TicketListContainer from './components/ticket-list-container';
import { TicketListQueryType } from './models/ticket-list-type';
import { TicketQuery } from '@pages/tickets/models/ticket-query';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { selectLastNavigationDate } from '@shared/layout/store/layout.selectors';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';
import { Dictionary } from '@shared/models';
import { TicketListCheckedState } from './models/ticket-list-checked-state';
import { CheckboxCheckEvent } from '../../shared/components/checkbox/checkbox';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { setMultipleTicketsAssignee } from './services/tickets.service'
import { useMutation } from 'react-query';
import { changeAssignee } from './store/tickets.slice';

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
    const [selectedTickets, setSelectedTickets] = useState<Dictionary<TicketListCheckedState>>({});
    const lastNavigationDate = useSelector(selectLastNavigationDate);
    const isDefaultTeam = useCheckPermission('Tickets.DefaultToTeamView');
    const { id } = useSelector(selectAppUserDetails);
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [assignee, setAssignee] = useState('');

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

    const handleCheckboxChange = (e: CheckboxCheckEvent): void => {
        if (!items) {
            return;
        }
        const tickets = items.find(p => p.id === e.value);
        if (!!tickets) {
            const checkedState = {
                checkboxCheckEvent: { value: tickets.id, checked: e.checked },
                ticket: tickets
            } as TicketListCheckedState;
            const copy = { ...selectedTickets, [e.value]: checkedState };
            setSelectedTickets(copy);
        }
    }

    const isRowChecked = (ticketId: string): boolean => {
        return !!selectedTickets[ticketId] && (selectedTickets[ticketId].checkboxCheckEvent?.checked ?? false);
    }

    const getCheckedTicketIdList = (): string[] => {
        let list = Object.values(selectedTickets).filter(x => x.checkboxCheckEvent.checked === true);
        let filteredTicketIdList = list.map(x => x.checkboxCheckEvent.value)
        return filteredTicketIdList;
    }

    const assignSuccessfullyUpdatedTickets = (error: any) => {
        let failedTickets = error?.response?.data.message.split('.')?.map(message => message.replace(/\D/g, ''));
        let ticketsToBeUpdated = getCheckedTicketList().filter(ticket => !failedTickets.includes(ticket.ticketNumber?.toString()));
        ticketsToBeUpdated.forEach((t: Ticket) => dispatch(changeAssignee({ ticketId: t.id!, assigneeId: assignee })))
    }

    const handleMultipleAssignAction = (formData: any) => {
        setAssignee(formData.assignee);
        changeAsigneeForMultipleTicketsMutation.mutate(
            {
                ...formData,
                ticketIdList: getCheckedTicketIdList()
            }
        )
    }

    const changeAsigneeForMultipleTicketsMutation = useMutation(setMultipleTicketsAssignee, {
        onSuccess: (data: Ticket[]) => {
            setAssignModalOpen(false);
            if (data && data.length > 0) {
                data.forEach((t: Ticket) => dispatch(changeAssignee({ ticketId: t.id!, assigneeId: t.assignee! })))
            }
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.tickets_assigned'
            }));
        }, onError: (error: any) => {
            if (error?.response?.data.statusCode === 400)
                assignSuccessfullyUpdatedTickets(error);
            dispatch(addSnackbarMessage({
                message: error?.response?.data.message,
                type: SnackbarType.Error
            }));
        },
    });


    const getCheckedTicketList = (): Ticket[] => {
        var list = Object.values(selectedTickets).filter(x => x.checkboxCheckEvent.checked === true);
        var filteredTicketList = list.map(x => x.ticket)
        return filteredTicketList;
    }

    useEffect(() => {
        const query: any = queryString.parse(history.location.search, { parseNumbers: true });
        const newQuery: TicketQuery = { ...query, pageSize: 25 };
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
                <TicketsSearch selectedTickets={getCheckedTicketIdList()}
                    isAssignModalOpen={isAssignModalOpen}
                    setAssignModalOpen={setAssignModalOpen}
                    handleOnSubmit={handleMultipleAssignAction}
                    isAssigneeChangeInProgress={changeAsigneeForMultipleTicketsMutation.isLoading} />
                {ticketsLoading ?
                    <div /> :
                    <TicketListContainer dataSource={items} isRowSelected={isRowChecked} handleCheckboxChange={handleCheckboxChange} />
                }
            </div>
        </div>
    );
};

export default withErrorLogging(TicketList);
