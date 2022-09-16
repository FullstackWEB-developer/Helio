import {TicketsPath} from '@app/paths';
import Spinner from '@components/spinner/Spinner';
import {GetRelatedTicketParent} from '@constants/react-query-constants';
import React from 'react';
import {Trans} from 'react-i18next';
import {useQuery} from 'react-query';
import {Link} from 'react-router-dom';
import {Ticket} from '../../models/ticket';
import {getTicketById} from '../../services/tickets.service';

const RelatedTicketParent = ({childTicket}: {childTicket: Ticket}) => {

    const {data: parentTicket, isFetching} = useQuery([GetRelatedTicketParent, childTicket.parentTicketId],
        () => getTicketById(childTicket.parentTicketId!),
        {
            enabled: !!childTicket?.parentTicketId
        });

    return (
        <div className='flex py-2 body2-medium whitespace-pre'>
            {
                isFetching ? <Spinner className='mx-auto' size='small' /> :
                    (
                        !!parentTicket && parentTicket.ticketNumber &&
                        <Trans i18nKey={'ticket_detail.info_panel.related_tickets.parent_ticket'} values={{ticketNumber: parentTicket.ticketNumber}}>
                            <Link className='link' to={`${TicketsPath}/${parentTicket.ticketNumber}`}></Link>
                        </Trans>
                    )
            }
        </div>
    )
}

export default RelatedTicketParent;