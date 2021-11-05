import {RatingStats} from '@pages/dashboard/models/ratings.model';
import {useTranslation} from 'react-i18next';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import StatusDot from '@components/status-dot/status-dot';
import {UserStatus} from '@shared/store/app-user/app-user.models';
import './ratings-widget.scss';

export interface RatingProps {
    data: RatingStats;
}

const DashboardRatingsWidget = ({data}: RatingProps) => {

    const {t} = useTranslation();

    const WidgetIcon = () => {
        if (data.overallSatisfiedPercent === 0 || data.overallSatisfiedPercent === 50) {
            return <SvgIcon
                fillClass='icon-medium'
                type={Icon.RatingSatisfied}/>
        }
        return <SvgIcon
            fillClass={'icon-medium ' + (data.overallSatisfiedPercent > 50 ? 'rating-widget-satisfied' : 'rating-widget-unsatisfied')}
            type={data.overallSatisfiedPercent > 50 ? Icon.RatingVerySatisfied : Icon.RatingDissatisfied}/>
    }

    const calculateOverall = () => {
        if (isNaN(data.overallSatisfiedPercent) || data.overallSatisfiedPercent < 0) {
            return 0;
        }
        return data.overallSatisfiedPercent;
    }

    return <div className='flex flex-col items-center justify-center pt-2.5'>
        <div className='body3'>{t('dashboard.ratings.overall_ratings')}</div>
        <div>
            <div className='flex flex-row items-center justify-center pb-10'>
                <WidgetIcon/>
                <div className='pl-2.5'><h3>{calculateOverall()}%</h3></div>
            </div>
            <div className='flex flex-row items-center body2 pb-2'>
                <div className='pr-2.5'><StatusDot status={UserStatus.Available}/></div>
                <div className='w-24'>{t('dashboard.ratings.very_satisfied')}</div>
                <div className='px-6 w-10'>{data.satisfiedCount}</div>
                <div className='pl-6 w-10'>{data.satisfiedPercent}%</div>
            </div>
            <div className='flex flex-row items-center body2 pb-2'>
                <div className='pr-2.5'><StatusDot status={UserStatus.Offline}/></div>
                <div className='w-24'>{t('dashboard.ratings.neutral')}</div>
                <div className='px-6 w-10'>{data.neutralCount}</div>
                <div className='pl-6 w-10'>{data.neutralPercent}%</div>
            </div>
            <div className='flex flex-row items-center body2'>
                <div className='pr-2.5'><StatusDot status={UserStatus.Busy}/></div>
                <div className='w-24'>{t('dashboard.ratings.unsatisfied')}</div>
                <div className='px-6 w-10'>{data.unsatisfiedCount}</div>
                <div className='pl-6 w-10'>{data.unsatisfiedPercent}%</div>
            </div>
        </div>
    </div>
}
export default DashboardRatingsWidget;
