import {Ticket} from '@pages/tickets/models/ticket';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';

export interface TicketStatusDotProps {
    ticket: Ticket,
}

const TicketStatusDot = ({ticket}: TicketStatusDotProps) => {
    let className;

    if (ticket.isOverdue) {
        className = 'fill-red'
    } else {
        if (ticket.status) {
            if (ticket.status === TicketStatuses.OnHold || ticket.status === TicketStatuses.Open) {
                className = 'fill-yellow';
            } else if (ticket.status === TicketStatuses.InProgress) {
                className = 'fill-green';
            } else {
                className = 'fill-gray';
            }
        }
    }

    return <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g data-name='Status indicator' className={className}>
            <circle cx="5" cy="5" r="4" stroke='none'/>
        </g>
    </svg>
}

export default TicketStatusDot;
