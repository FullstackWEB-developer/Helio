import {ManagerRatingsMetric} from '@pages/application/models/manager-ratings-metric';
import {useTranslation} from 'react-i18next';
import './manager-rating-line.scss';

export interface ManagerRatingLineProps {
    item: ManagerRatingsMetric
}

const ManagerRatingLine = ({item}:ManagerRatingLineProps) => {
    const {t} = useTranslation();

    return <div className='flex flex-row items-center'>
        <div className='body2-medium w-16'>{t('my_stats.manager_ratings.star', {star: item.ratingValue})}</div>
        <div className='w-40 h-full items-center relative'>
                <div className='h-2 manager-rating-line rounded absolute' style={{width: `${item.percentage}%`}}/>
                <div className='h-2 manager-rating-line-bg rounded'/>
        </div>
        <div className='body2 pl-4 w-12'>
            {item.count}
        </div>
        <div className='body2 w-16'>
            {`${item.percentage}%`}
        </div>
    </div>
}

export default ManagerRatingLine;
