import Modal from '@shared/components/modal/modal';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import {getHotSpots} from '../services/appointments.service';
import {toggleHotspots} from '@shared/layout/store/layout.slice';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {HotSpotInfo} from '../models/hotspot.model';
import DailyHotspots from './daily-hot-spots';
import {useTranslation} from 'react-i18next';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {useQuery} from 'react-query';
import {OneMinute, QueryHotSpots} from '@constants/react-query-constants';

const HotSpots = () => {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {isLoading, error, data} = useQuery<HotSpotInfo[], Error>(QueryHotSpots, () =>
            getHotSpots(),
        {
            staleTime: OneMinute,

        }
    );
    useEffect(() => {
        dispatch(getDepartments());
        dispatch(getProviders());
    }, [dispatch]);


    const hotSpotsView = data ? data.map((hotspot: HotSpotInfo) => {
        return <DailyHotspots dailyhotspot={hotspot} key={hotspot.date.toString()}/>
    }) : null;

    const getContent = () => {
        if (isLoading) {
            return <ThreeDots/>;
        }
        if (error) {
            return <div data-test-id='hot-spot-error'> {error.message} - {t('appointment.hot_spots.error')}</div>;
        }
        return hotSpotsView;
    }

    return (
        <div className='flex items-center justify-center justify-self-center' data-test-id='hot-spot-modal-parent'>
            <Modal isOpen={true} title={t('appointment.hot_spots.title')} onClose={() => dispatch(toggleHotspots())}
                   isClosable={true}>
                <div className='w-full h-96  overflow-y-auto mb-10'>
                    <div data-test-id='hot-spot-modal-content'>{getContent()}</div>
                </div>
            </Modal>
        </div>
    );
}

export default withErrorLogging(HotSpots);
