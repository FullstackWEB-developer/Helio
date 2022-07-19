import {Ticket} from '@pages/tickets/models/ticket';
import {useQuery} from 'react-query';
import {GetReviewsByTicketId} from '@constants/react-query-constants';
import {getTicketReviews} from '@pages/tickets/services/tickets.service';
import {useTranslation} from 'react-i18next';
import Spinner from '@components/spinner/Spinner';
import {TicketManagerReview} from '@pages/application/models/ticket-manager-review';
import TicketReviewItem from '@pages/tickets/components/ticket-detail/ticket-reviews/ticket-review-item';
import Button from '@components/button/button';
import React, {useMemo, useState} from 'react';
import {AddTicketReview} from '@components/ticket-rating';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import SvgIcon, {Icon} from '@components/svg-icon';
import dayjs from 'dayjs';
import TicketChannelIcon from '../../ticket-channel-icon';
import {useSelector} from 'react-redux';
import {selectTicketUpdateHash, selectTicketUpdateModel} from '@pages/tickets/store/tickets.selectors';
import hash from 'object-hash';
export interface TicketReviewsProps {
    ticket: Ticket
}

const TicketReviews = ({ticket}: TicketReviewsProps) => {
    const {t} = useTranslation();
    const [addReviewForTicket, setAddReviewForTicket] = useState<string | undefined>();
    const {isLoading: isReviewsLoading, data: reviews, refetch} = useQuery([GetReviewsByTicketId, ticket.id], () => getTicketReviews(ticket.id!));
    const canAddReview = useCheckPermission('Tickets.AddReview');
    const updateModel = useSelector(selectTicketUpdateModel);
    const storedUpdateModelHash = useSelector(selectTicketUpdateHash);
    const isDirty = () => {
        if (!updateModel) {
            return false;
        }
        return storedUpdateModelHash !== hash.MD5(updateModel);
    }
    const getRatingIcon = useMemo(() => {
        switch (ticket?.botRating) {
            case -1:
                return (
                    <div className='flex'>
                        <div className='pr-3'><TicketChannelIcon channel={ticket?.channel} circledIcons={false} iconSize='icon-medium' fillClass='rgba-038-fill'/></div>
                        <SvgIcon
                            fillClass='icon-medium rating-widget-unsatisfied'
                            type={Icon.RatingDissatisfied} />
                    </div>);
            case 1:
                return (<div className='flex'>
                    <div className='pr-3'><TicketChannelIcon channel={ticket?.channel} circledIcons={false} iconSize='icon-medium' fillClass='rgba-038-fill'/></div>
                    <SvgIcon
                        fillClass='icon-medium rating-widget-satisfied'
                        type={Icon.RatingVerySatisfied} />
                </div>);
            case 0:
                return (
                    <div className='flex'>
                        <div className='pr-3'><TicketChannelIcon channel={ticket?.channel} circledIcons={false} iconSize='icon-medium' fillClass='rgba-038-fill'/></div>
                        <SvgIcon
                            fillClass='icon-medium rating-widget-neutral'
                            type={Icon.RatingSatisfied} />
                    </div>);
            default:
                return null;
        }
    }, [ticket]);

    if (isReviewsLoading) {
        return <div className='h-40'><Spinner fullScreen={true} /></div>
    }

    return <div className='flex flex-col pb-8'>
        <div className='h8 pb-4'>{t('ticket_detail.info_panel.reviews.manager_ratings_reviews')}</div>
        <div>{
            reviews?.map((review: TicketManagerReview, index) => <TicketReviewItem review={review} ticket={ticket} key={review.id} isFirst={index === 0} />)
        }</div>
        {canAddReview && !!ticket.assignee && <div className='pt-4.5'>
            <Button label='ticket_detail.info_panel.reviews.add_review' buttonType='secondary' onClick={() => setAddReviewForTicket(ticket.id)} disabled={isDirty()}/>
        </div>}
        {getRatingIcon && <>
            <div className='h8 pt-4.5 pb-3.5'>{t('patient_ratings.bot_ratings')}</div>
            <div className='body2-medium'>
                {dayjs.utc(ticket.botRatingCreatedOn).local().format('MMM D, YYYY h:mm A')}
            </div>
            <div className='flex flex-row pt-3.5'>
                <div className='pr-4'>{getRatingIcon}</div>
                <div className='body2-medium pr-2'>{t('ticket_detail.info_panel.reviews.by')}</div>
                <div className='body2'>{ticket.createdForName}</div>
            </div>
        </>}
        {addReviewForTicket && <AddTicketReview
            ticketId={addReviewForTicket}
            isOpen={!!addReviewForTicket}
            onAdded={() => refetch()}
            onClose={() => setAddReviewForTicket(undefined)} />}
    </div>
}

export default TicketReviews;
