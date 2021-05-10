import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {setStatus} from '../services/tickets.service';
import {statusTranslationKeyMap} from '../utils/statusUtils';
import TicketStatusDisplay from './ticket-status-display';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import Dropdown from '@components/dropdown/dropdown';
import {DropdownModel} from '@components/dropdown/dropdown.models';
import useComponentVisibility from '@shared/hooks/useComponentVisibility';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';
import {useMutation} from 'react-query';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import {changeStatus, setTicket} from '@pages/tickets/store/tickets.slice';

interface TicketStatusProps {
    ticketId: string,
    status: TicketStatuses,
    isArrow?: boolean
}

const TicketStatus = ({ticketId, status, isArrow = true}: TicketStatusProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);

    const updateStatusMutation = useMutation(setStatus, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_status_updated'
            }));
            dispatch(setTicket(data));
            dispatch(changeStatus({
                id: data.id,
                status: data.status
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_status_update_error',
                type: SnackbarType.Error
            }));
        }

    });
    const updateStatus = (id: string, status: number) => {
        updateStatusMutation.mutate({id, status})
        setIsVisible(false);
    };
    const openStatus = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
    }

    const statusesDropdownModel: DropdownModel = {
        defaultValue: status?.toString(),
        items: [
            {label: t(statusTranslationKeyMap[TicketStatuses.Open]), value: TicketStatuses.Open.toString()},
            {label: t(statusTranslationKeyMap[TicketStatuses.OnHold]), value: TicketStatuses.OnHold.toString()},
            {label: t(statusTranslationKeyMap[TicketStatuses.InProgress]), value: TicketStatuses.InProgress.toString()},
            {label: t(statusTranslationKeyMap[TicketStatuses.Solved]), value: TicketStatuses.Solved.toString()},
            {label: t(statusTranslationKeyMap[TicketStatuses.Closed]), value: TicketStatuses.Closed.toString()}
        ],
        onClick: (value: string) => {
            updateStatus(ticketId, Number(value))
        }
    };

    return <div ref={elementRef} className='col-span-2 flex flex-row items-center h-full relative' onClick={(event) => isArrow && openStatus(event)}>
        <TicketStatusDisplay status={status} iconClass='pt-1.5' labelClass='pl-3'/>
        {isArrow &&
            <div className='pl-3 cursor-pointer' onClick={openStatus}>
                <SvgIcon type={!isVisible ? Icon.ArrowDown : Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon' />
            </div>
        }
        {isVisible &&
            <div className='absolute top-16 w-48 z-10'>
                <Dropdown model={statusesDropdownModel} />
            </div>
        }
    </div>
}

export default TicketStatus;
