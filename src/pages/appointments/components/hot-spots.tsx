import Modal from '../../../shared/components/modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsHotspotsVisible } from '../../../shared/layout/store/layout.selectors';
import { useEffect } from 'react';
import { getDepartments, getProviders } from '../../../shared/services/lookups.service';
import { getHotSpots } from '../services/appointments.service';
import { toggleHotspots } from '../../../shared/layout/store/layout.slice';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { HotSpotInfo } from '../models/hotspot.model';
import DailyHotspots from './daily-hot-spots';
import { selectHotSpots, selectIsHotspotsError, selectIsHotspotsLoading } from '../store/appointments.selectors';
import { useTranslation } from 'react-i18next';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import { clearHotSpotsData } from '../store/appointments.slice';

const HotSpots = () => {

    const displayHotspots = useSelector(selectIsHotspotsVisible);
    const hotSpots = useSelector(selectHotSpots);
    const isLoading = useSelector(selectIsHotspotsLoading);
    const isError = useSelector(selectIsHotspotsError);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        if (displayHotspots) {
            dispatch(getHotSpots());
            dispatch(getDepartments());
            dispatch(getProviders());
        }
        return () => {
            dispatch(clearHotSpotsData());
        }
    }, [dispatch, displayHotspots]);




    const hotSpotsView = hotSpots ? hotSpots.map((hotspot: HotSpotInfo) => {
        return <DailyHotspots dailyhotspot={hotspot} />
    }) : null;

    const getContent = () => {
        if (isLoading) {
            return <ThreeDots />;
        }
        if (isError) {
            return <div data-test-id='hot-spot-error'>{t('appointment.hot_spots.error')}</div>;
        }
        return hotSpotsView;
    }

    return (
        <div className='flex items-center justify-center justify-self-center' data-test-id='hot-spot-modal-parent'>
            <Modal isOpen={displayHotspots} title={t('appointment.hot_spots.title')} onClose={() => dispatch(toggleHotspots())} isClosable={true}>
                <div className='w-full h-full'>
                    <div data-test-id='hot-spot-modal-content'>{getContent()}</div>
                </div>
            </Modal>
        </div>
    );
}

export default withErrorLogging(HotSpots);
