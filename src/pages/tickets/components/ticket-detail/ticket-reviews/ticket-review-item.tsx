import {TicketManagerReview} from '@pages/application/models/ticket-manager-review';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import Rating from '@components/rating/rating';
import SvgIcon, {Icon} from '@components/svg-icon';
import classNames from 'classnames';
import React, {useState} from 'react';
import {ViewTicketRatings} from '@components/ticket-rating';
import {Ticket} from '@pages/tickets/models/ticket';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';

export interface TicketReviewItemProps {
    review: TicketManagerReview;
    isFirst: boolean;
    ticket: Ticket;
}

const TicketReviewItem = ({review, isFirst, ticket}: TicketReviewItemProps) => {
    const {t} = useTranslation();
    const [displayRatingsForTicket, setDisplayRatingsForTicket] = useState<number | undefined>(undefined);
    const canViewAnyReview = useCheckPermission('Tickets.ViewAnyReview');
    const currentUser = useSelector(selectAppUserDetails);
    const wrapperClass = classNames('flex flex-col', {
        'border-t py-2' : !isFirst,
        'pb-2': isFirst
    })

    if (!canViewAnyReview && currentUser.id !== ticket.assignee) {
        return null;
    }

    return <div className={wrapperClass}>
        <div className='flex flex-row pb-3'>
             <div className='body2-medium pr-4'>
                 {dayjs.utc(review.createdOn).local().format('MMM D, YYYY h:mm A')}
             </div>
            <div className='body2-medium pr-2'>
                {t('ticket_detail.info_panel.reviews.by')}
            </div>
            <div className='body2'>
                {review.createdByName}
            </div>
        </div>
        <div className='flex flex-row items-center'>
            <Rating value={review.rating} size='small' />
            <div className='body2 pl-4 pr-2'>{t('ticket_detail.info_panel.reviews.review')}</div>
            <SvgIcon className='cursor-pointer'
                     onClick={() => setDisplayRatingsForTicket(ticket.ticketNumber)}
                     type={Icon.Comment} fillClass='rgba-062-fill' />
        </div>
        {displayRatingsForTicket && <ViewTicketRatings
            onClose={() => setDisplayRatingsForTicket(undefined)}
            isOpen={!!displayRatingsForTicket}
            ticketInput= {ticket}
            ticketNumber={displayRatingsForTicket}/>}
    </div>
}

export default TicketReviewItem;
