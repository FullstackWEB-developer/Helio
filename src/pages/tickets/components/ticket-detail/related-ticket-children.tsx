import {TicketsPath} from '@app/paths';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

const RelatedTicketChildren = ({childTickets}: {childTickets: number[]}) => {
    const {t} = useTranslation();
    return childTickets && childTickets.length > 0 ? (
        <div className='flex flex-col py-2 body2-medium whitespace-pre'>
            <div className='body2-medium'>{t('ticket_detail.info_panel.related_tickets.children_tickets')}</div>
            {
                childTickets.map(c => <Link  key={`$child-{c}`} className='link' to={`${TicketsPath}/${c}`}>{c}</Link>)
            }
        </div>
    ) : null
}

export default RelatedTicketChildren;