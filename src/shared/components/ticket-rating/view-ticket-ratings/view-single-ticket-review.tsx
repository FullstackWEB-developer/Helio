import {TicketManagerReview} from '@pages/application/models/ticket-manager-review';
import Rating from '@components/rating/rating';
import {useTranslation} from 'react-i18next';
import Avatar from '@components/avatar';
import {useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {useMemo} from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {Ticket} from '@pages/tickets/models/ticket';

export interface ViewSingleTicketReviewProps {
    review: TicketManagerReview;
    hasTopBorder: boolean;
    ticket : Ticket
}
const ViewSingleTicketReview = ({review, hasTopBorder, ticket}: ViewSingleTicketReviewProps) => {
    const {t} = useTranslation();
    const users = useSelector(selectUserList);
    const currentUser = useSelector(selectAppUserDetails);
    const canViewAnyReview = useCheckPermission('Tickets.ViewAnyReview');

    const agent = useMemo(() => {
        const usersFiltered = users.filter(a => a.id === review.createdBy);
        return usersFiltered ? usersFiltered[0] : undefined;
    }, [review, users]);

    const wrapperClass = classnames('pt-2 pb-6', {
        'border-t': hasTopBorder
    })

    if (!canViewAnyReview && currentUser.id !== ticket.assignee) {
        return null;
    }

    return <div className={wrapperClass}>
        <div className='pt-6 pb-4 flex flex-row justify-between'>
            <div className='flex flex-row'>
                <div className='pr-4'>
                    <Avatar userFullName={review.createdByName}
                            userPicture={agent?.profilePicture}
                            displayStatus={true}
                            userId={agent?.id}/>
                </div>
                <div className='flex flex-col'>
                    <div className='body3-medium'>{t('ticket_log.manager')}</div>
                    <div className='body2'>{review.createdByName}</div>
                </div>
            </div>
            <div className='flex flex-row'>
                <div className='body2-medium pr-3.5'>
                    {t('ticket_log.reviewed_on')}
                </div>
                <div className='body2 pr-1'>
                    {dayjs.utc(review.createdOn).local().format('MMM D, YYYY h:mm A')}
                </div>
            </div>
        </div>
        <div className='pb-4'>
            <Rating value={review.rating} size='medium'/>
        </div>
        <div className='body2'>
            {review.feedback}
        </div>
    </div>
}
export default ViewSingleTicketReview;
