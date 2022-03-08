import './my-stats.scss';
import Card from '@components/card/card';
import React from 'react';
import {
    CallsChatPerformance,
    ManagerRatings,
    RecentManagerReviews,
    TicketsPerformance
} from '@pages/application/components';
import {useTranslation} from 'react-i18next';
import DashboardPatientRatingsWidget from '@pages/dashboard/components/dashboard-patients-ratings-widget';

const MyStats = () => {

    const {t} = useTranslation();

    return <div className='h-full w-full myStats flex flex-col px-6 overflow-y-auto'>
        <div className='pt-6 pb-4 flex flex-row justify-between'>
            <h5>{t('my_stats.title')}</h5>
            <div className='body2'>
                {t('my_stats.last_7_days')}
            </div>
        </div>
        <div className='pb-8'>
            <Card hasBorderRadius title='my_stats.tickets_performance.title'>
                <div className='pl-12'>
                    <TicketsPerformance/>
                </div>
            </Card>
        </div>
        <div className='pb-8'>
            <Card hasBorderRadius title='my_stats.calls_chats.title'>
                <div className='pl-12'>
                    <CallsChatPerformance/>
                </div>
            </Card>
        </div>
        <div className='flex flex-row space-x-4 flex flex-col md:flex-row grid-cols-12 grid space-y-8 xl:space-y-0 xl:space-x-8'>
            <div className='col-span-12 md:col-span-3'>
                <Card hasBorderRadius title='dashboard.patient_ratings.title' hasFullHeight={true}>
                    <DashboardPatientRatingsWidget/>
                </Card>
            </div>
            <div className='col-span-12 md:col-span-9'>
                <Card hasBorderRadius title='my_stats.recent_manager_reviews.title'>
                    <RecentManagerReviews/>
                </Card>
            </div>
        </div>
    </div>
}

export default MyStats;
