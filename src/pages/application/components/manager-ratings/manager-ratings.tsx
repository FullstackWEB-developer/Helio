import './manager-ratings.scss';
import {useQuery} from 'react-query';
import {GetOverallManagerRatingsForUser} from '@constants/react-query-constants';
import {getOverallManagerRatingsForUser} from '@pages/tickets/services/tickets.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {useDispatch} from 'react-redux';
import Spinner from '@components/spinner/Spinner';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Rating from '@components/rating/rating';
import {ManagerRatingsMetric} from '@pages/application/models/manager-ratings-metric';
import ManagerRatingLine from '@pages/application/components/manager-ratings/manager-rating-line';
export interface ManagerRatingsProps {
    userId?: string;
}
const ManagerRatings = ({userId} : ManagerRatingsProps) => {

    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {isLoading, isError, data} = useQuery([GetOverallManagerRatingsForUser, userId], () => getOverallManagerRatingsForUser(userId),
        {
            onError: () => {
                dispatch(addSnackbarMessage({
                    message:'my_stats.manager_ratings.could_not_fetch_overall_ratings',
                    type: SnackbarType.Error
                }))
            }
        });

    if (isLoading) {
        return <div className='manager-ratings-wrapper'>
            <Spinner fullScreen={true} />
        </div>
    }

    if (isError) {
        return <div className='manager-ratings-wrapper text-danger flex justify-center items-center'>
            {t('my_stats.manager_ratings.could_not_fetch_overall_ratings')}
        </div>
    }

    return <div className='manager-ratings-wrapper flex flex-col'>
        <div className='body3-big flex justify-center w-full pb-3'>{t('my_stats.manager_ratings.header')}</div>
        <div className='flex justify-center w-full flex-row items-center'>
            <Rating size='medium' value={data?.overallRatingValue ? Math.floor(data.overallRatingValue) : 0} />
            <div className='pl-4 h7'>{data?.overallRatingValue}</div>
         </div>
        <div className='flex justify-center flex-col w-full items-center pt-12'>
            {data?.managerRatingsMetric
                .sort((a, b) => b.ratingValue -a.ratingValue)
                .map((item:ManagerRatingsMetric) => <ManagerRatingLine item={item} key={item.ratingValue}/>)}
        </div>
    </div>
}

export default ManagerRatings;
