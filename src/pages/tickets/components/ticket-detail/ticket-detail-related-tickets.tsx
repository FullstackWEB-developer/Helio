import {Ticket} from '@pages/tickets/models/ticket';
import React from 'react';
import RelatedTicketChildren from './related-ticket-children';
import RelatedTicketParent from './related-ticket-parent';

const TicketDetailRelatedTickets = ({ticket, childTickets}: {ticket: Ticket, childTickets?: number[]}) => {
    return <>
        {ticket?.parentTicketId && <RelatedTicketParent childTicket={ticket} />}
        {ticket?.parentTicketId && childTickets && childTickets.length > 0 && <div className='border-b'></div>}
        {childTickets && childTickets.length > 0 && <RelatedTicketChildren childTickets={childTickets} />}
    </>;
}

export default TicketDetailRelatedTickets;