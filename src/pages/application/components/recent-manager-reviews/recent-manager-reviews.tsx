import './recent-manager-reviews.scss';
import {useQuery} from 'react-query';
import {GetLatestManagerReviews} from '@constants/react-query-constants';
import {getRecentManagerReviewsForUser} from '@pages/tickets/services/tickets.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {useDispatch} from 'react-redux';
import Spinner from '@components/spinner/Spinner';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TableModel} from '@components/table/table.models';
import Table from '@components/table/table';
import dayjs from 'dayjs';
import {Link} from 'react-router-dom';
import {TicketsPath} from '@app/paths';
import SvgIcon, {Icon} from '@components/svg-icon';
import {ChannelTypes} from '@shared/models';
import Rating from '@components/rating/rating';
import {ViewTicketRatings} from '@components/ticket-rating';
import {TicketManagerReview} from '@pages/application/models/ticket-manager-review';

export interface RecentManagerReviewsProps {
    userId?: string,
    limit?: number
}
const RecentManagerReviews = ({userId, limit}: RecentManagerReviewsProps) => {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [displayRatingsForTicket, setDisplayRatingsForTicket] = useState<number | undefined>(undefined);

    const {isLoading, isError, data} = useQuery([GetLatestManagerReviews, userId], () => getRecentManagerReviewsForUser(userId, limit),
        {
        onError: () => {
            dispatch(addSnackbarMessage({
                message:'my_stats.recent_manager_reviews.could_not_fetch_latest_manager_reviews',
                type: SnackbarType.Error
            }))
        }
    });

    const getChannelIcon =(channel: ChannelTypes) => {
        let icon = Icon.Chat;
        switch (channel) {
            case ChannelTypes.Chat: {
                icon = Icon.Chat;
                break;
            }
            case ChannelTypes.SMS: {
                icon = Icon.Sms;
                break;
            }
            case ChannelTypes.PhoneCall: {
                icon = Icon.Phone;
                break;
            }
            case ChannelTypes.Email: {
                icon = Icon.Email;
                break;
            }
            case ChannelTypes.WebSite: {
                icon = Icon.Web;
                break;
            }
            case ChannelTypes.UserCreated: {
                icon = Icon.ChannelUser;
                break;
            }
        }
        return <SvgIcon className='icon-small' type={icon} fillClass='rgba-038-fill' />
    }

    const tableModel = useMemo(() => {
        return {
            size:'large',
            emptyMessage:'my_stats.recent_manager_reviews.no_review',
            hasRowsBottomBorder: true,
            rowClass:'min-h-10',
            columns: [{
                field: 'createdOn',
                title:'my_stats.recent_manager_reviews.date',
                widthClass:'w-1/6',
                render:(field) => <div className='body3-big flex items-center h-full'>{dayjs(field).format('MMM DD, YYYY')}</div>
            },{
                field: 'ticketChannel',
                title:'my_stats.recent_manager_reviews.category',
                widthClass:'w-1/12',
                render:(field) => <div className='body3-big flex items-center h-full pl-6'>{getChannelIcon(field)}</div>
            },{
                field: 'ticketNumber',
                title:'my_stats.recent_manager_reviews.ticket_id',
                widthClass:'w-1/6',
                render: (field) => <div className='body2-primary flex items-center h-full'><Link to={`${TicketsPath}/${field}`} className='cursor-pointer'>{field}</Link></div>
            },{
                field: 'feedback',
                title:'my_stats.recent_manager_reviews.review',
                widthClass:'w-1/6',
                render: (_, record: TicketManagerReview) => <div className='body2-primary flex items-center h-full pl-2'>
                    <SvgIcon onClick={() => setDisplayRatingsForTicket(record.ticketNumber)} type={Icon.Comment} className='cursor-pointer' fillClass='rgba-038-fill'/>
                </div>
            },{
                field: 'rating',
                title:'my_stats.recent_manager_reviews.rating',
                widthClass:'w-1/6',
                render: (field) => <div className='flex items-center h-full'><Rating size='small' value={field} /></div>
            },{
                field: 'createdByName',
                title:'my_stats.recent_manager_reviews.manager',
                widthClass:'w-1/6'
            }],
            rows: data || []
        } as TableModel;
    }, [data])

    if (isLoading) {
        return <div className='recent-manager-reviews-wrapper'>
            <Spinner fullScreen={true} />
        </div>
    }

    if (isError) {
        return <div className='h-80 text-danger flex justify-center items-center'>
            {t('my_stats.recent_manager_reviews.could_not_fetch_latest_manager_reviews')}
        </div>
    }



    return <div className='recent-manager-reviews-wrapper'>
            <Table model={tableModel} />
        {displayRatingsForTicket && <ViewTicketRatings
            onClose={() => setDisplayRatingsForTicket(undefined)}
            isOpen={!!displayRatingsForTicket}
            ticketNumber={displayRatingsForTicket}/>}
    </div>
}

export default RecentManagerReviews;
