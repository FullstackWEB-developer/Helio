import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed, getTicketByNumber, setStatus } from '../services/tickets.service';
import { statusTranslationKeyMap } from '../utils/statusUtils';
import { Icon } from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import Dropdown from '@components/dropdown/dropdown';
import {  DropdownModel } from '@components/dropdown/dropdown.models';
import useComponentVisibility from '@shared/hooks/useComponentVisibility';
import { TicketStatuses } from '@pages/tickets/models/ticket.status.enum';
import { useMutation, useQuery } from 'react-query';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { changeStatus, setTicket } from '@pages/tickets/store/tickets.slice';
import TicketStatusDot from '@pages/tickets/components/ticket-status-dot';
import { Ticket } from '@pages/tickets/models/ticket';
import { setGlobalLoading } from '@shared/store/app/app.slice';
import classnames from 'classnames';
import { usePopper } from 'react-popper';
import { FeedTypes, TicketFeed } from '../models/ticket-feed';
import { selectEnumValuesAsOptions, selectTicketFilter, selectTicketUpdateModel } from '../store/tickets.selectors';
import { usePrevious } from '@shared/hooks/usePrevious';
import {getList} from '../services/tickets.service';
import { TicketQuery } from '../models/ticket-query';
import { QueryTickets } from '@constants/react-query-constants';
interface TicketStatusProps {
    ticket: Ticket,
    isExpired?: boolean,
    isArrow?: boolean
    onUpdated?: () => void;
}
const TicketStatus = ({ ticket, isArrow = true, onUpdated }: TicketStatusProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const statusOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketStatus')));
    const previousTicket = usePrevious(ticket);
    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const { styles, attributes, update } = usePopper(elementRef.current, popper, {
        placement: 'bottom',
        strategy: 'fixed',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 8],
            },
        }]
    });

    useEffect(() => {
        if (isVisible && update) {
            update().then();
        }
    }, [update, isVisible]);
    const addFeedMutation = useMutation(addFeed);
    const {refetch: refetchTicket} = useQuery<Ticket, Error>([QueryTickets, ticket.ticketNumber], () =>
        getTicketByNumber(Number(ticket.ticketNumber), true),
        {
            enabled: false,
            onSuccess: data => {
                dispatch(setTicket(data))
            }
        }
    );
    const updateStatusMutation = useMutation(setStatus, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_status_updated'
            }));
            refetchTicket();
            dispatch(changeStatus({
                id: data.id,
                status: data.status
            }));

            if (data.id && previousTicket?.status !== data.status) {
                const feedData: TicketFeed = {
                    feedType: FeedTypes.StatusChange,
                    description: `${t('ticket_detail.feed.description_prefix')} ${statusOptions.find(a => a.value === data.status?.toString())?.label}`
                };
                addFeedMutation.mutate({ ticketId: ticket.id!, feed: feedData });
            }
            if (onUpdated) {
                onUpdated();
            }
            
            dispatch(getList(ticketFilter));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_status_update_error',
                type: SnackbarType.Error
            }));
        },
        onSettled: () => {
            dispatch(setGlobalLoading(false));
        }

    });
    const updateStatus = (id: string, status: number) => {
        dispatch(setGlobalLoading(true));
        updateStatusMutation.mutate({ id, status })
        setIsVisible(false);
    };
    const openStatus = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
    }

    const statusesDropdownModel: DropdownModel = {
        defaultValue: ticket.status?.toString(),
        items: [
            { label: t(statusTranslationKeyMap[TicketStatuses.Open]), value: TicketStatuses.Open.toString() },
            { label: t(statusTranslationKeyMap[TicketStatuses.OnHold]), value: TicketStatuses.OnHold.toString() },
            { label: t(statusTranslationKeyMap[TicketStatuses.InProgress]), value: TicketStatuses.InProgress.toString() },
            { label: t(statusTranslationKeyMap[TicketStatuses.Solved]), value: TicketStatuses.Solved.toString() },
            { label: t(statusTranslationKeyMap[TicketStatuses.Closed]), value: TicketStatuses.Closed.toString() }
        ].filter(a => a.value !== ticket.status?.toString()),
        onClick: (newValue: string) => {
            if (ticket.id) {
                updateStatus(ticket.id, Number(newValue));
            }

        }
    }

    return <div className='flex items-center h-full col-span-2'>
        <div ref={elementRef} className='flex flex-row items-center cursor-pointer' onClick={openStatus}>
            <div>
                <TicketStatusDot ticket={ticket} />
            </div>
            <div className='pl-3'>
                {ticket.status && t(`tickets.statuses.${(ticket.status)}`)}
            </div>
            {isArrow &&
                <div className='pl-3'>
                    <SvgIcon type={!isVisible ? Icon.ArrowDown : Icon.ArrowUp}
                        fillClass='active-item-icon' />
                </div>
            }
        </div>
        <div
            className={classnames('z-10', { 'hidden': !isVisible })}
            style={styles.popper}
            ref={setPopper}
            {...attributes.popper}
        >
            <Dropdown model={statusesDropdownModel} />
        </div>
    </div>
}

export default TicketStatus;
