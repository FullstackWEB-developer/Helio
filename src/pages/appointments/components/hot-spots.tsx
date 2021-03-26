import Modal from '../../../shared/components/modal/modal';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsHotspotsVisible} from '../../../shared/layout/store/layout.selectors';
import {useEffect} from 'react';
import {getDepartments, getProviders} from '../../../shared/services/lookups.service';
import {getHotSpots} from '../services/appointments.service';
import {toggleHotspots} from '../../../shared/layout/store/layout.slice';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {HotSpotInfo} from '../models/hotspot.model';
import DailyHotspots from './daily-hot-spots';
import {useTranslation} from 'react-i18next';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {useQuery} from 'react-query';

const HotSpots = () => {

    const displayHotspots = useSelector(selectIsHotspotsVisible);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {isLoading, error, data} = useQuery<HotSpotInfo[], Error>("hotspots", () =>
            getHotSpots(),
        {
            staleTime: 60000
        }
    );
    useEffect(() => {
        if (displayHotspots) {
            dispatch(getDepartments());
            dispatch(getProviders());
        }
    }, [dispatch, displayHotspots]);


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
            <Modal isOpen={displayHotspots} title={t('appointment.hot_spots.title')} onClose={() => dispatch(toggleHotspots())} isClosable={true}>
                <div className='w-full h-96  overflow-y-auto mb-10'>
                    <div data-test-id='hot-spot-modal-content'>{getContent()}</div>
                </div>
            </Modal>
        </div>
    );
}

export default withErrorLogging(HotSpots);
