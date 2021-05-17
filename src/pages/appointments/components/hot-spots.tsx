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
import Tabs from '@components/tab/Tabs';
import Tab from '@components/tab/Tab';
import dayjs from 'dayjs';
import {BadgeNumber} from '@icons/BadgeNumber';

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
        const title = <div className='flex flex-row items-center'>
            <div>{dayjs(hotspot.date).format('ddd, MMM DD, YYYY')}</div>
            <div className='pl-2'><BadgeNumber type='gray' number={hotspot.details.reduce((a, b) => a + b.count, 0)}/>
            </div>
        </div>
        return <Tab key={hotspot.date.toString()} title={title}><DailyHotspots dailyhotspot={hotspot}/></Tab>
    }) : [];

    const getContent = () => {
        if (isLoading) {
            return <ThreeDots/>;
        }
        if (error) {
            return <div data-test-id='hot-spot-error'> {error.message} - {t('appointment.hot_spots.error')}</div>;
        }
        return <Tabs>{hotSpotsView}</Tabs>;
    }

    return (
        <div className='flex items-center justify-center justify-self-center' data-test-id='hot-spot-modal-parent'>
            <Modal isOpen={true} title={t('appointment.hot_spots.title')} onClose={() => dispatch(toggleHotspots())}
                   isClosable={true}>
                <div className='w-full mb-10'>
                    <div data-test-id='hot-spot-modal-content'>{getContent()}</div>
                </div>
            </Modal>
        </div>
    );
}

export default withErrorLogging(HotSpots);
