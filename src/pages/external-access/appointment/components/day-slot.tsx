import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import {useTranslation} from 'react-i18next';
import {setSelectedAppointmentSlot} from '@pages/external-access/appointment/store/appointments.slice';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import './day-slot.scss';

export interface DaySlotsProps {
    column: any,
    hideShowMore?: boolean;
    showAllSlot?: boolean;
    slotClick?: (slot: AppointmentSlot) => void;
}
const MAX_SLOTS = 8;
const DaySlots = ({column, hideShowMore, showAllSlot, ...props}: DaySlotsProps) => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [displayMore, setDisplayMore] = useState<boolean>(false);

    useEffect(() => {
        if (!hideShowMore || showAllSlot === undefined) {
            return;
        }

        setDisplayMore(showAllSlot);

    }, [hideShowMore, showAllSlot]);


    const selectSlot = (slot: AppointmentSlot) => {
        if (props.slotClick) {
            props.slotClick(slot);
            return;
        }
        
        dispatch(setSelectedAppointmentSlot(slot));
        history.push('/o/appointment-reschedule-confirm');
    }

    const ShowMore = () => {
        return <div className='pb-4 cursor-pointer' onClick={() => setDisplayMore(!displayMore)}>
            <div className='flex flex-row flex-col items-center justify-center w-56 h-12 px-4 day-slot reschedule-slot md:w-80'>
                <div className='body2'>
                    {displayMore ? t('common.show_less') : t('common.show_more')}
                </div>
            </div>
        </div>
    }

    const Slot = ({value}: {value: AppointmentSlot}) => {
        return (<div className='pb-4 cursor-pointer md:w-full'>
            <div className='flex flex-row flex-col items-center justify-center w-56 h-12 px-4 day-slot reschedule-slot md:w-80 lg:w-32'
                onClick={() => selectSlot(value)}>
                <div className='body2'>
                    {dayjs(value.startTime, 'HH:mm').format('h:mm A')}
                </div>
            </div>
        </div>);
    }

    if (!column || !column.slots) {
        return (<div className='flex justify-center w-56 p-2 mx-2 md:w-80 reschedule-slot'>
            <p className='w-24 body3-small'>{t('external_access.schedule_appointment.no_open_slot')}</p>
        </div>);
    }

    const countToDisplay = ((column.slots.length > MAX_SLOTS && displayMore) || column.slots.length < MAX_SLOTS) ? column.slots.length : MAX_SLOTS;

    const SlotContainer = ({slot, index}: {slot: AppointmentSlot, index: number}) => {
        const currentSlot = <Slot value={slot} />;
        const nextIndex = index + 1;

        if (MAX_SLOTS >= column.slots.length && nextIndex > column.slots.length - 1) {
            return currentSlot;
        }

        if (MAX_SLOTS && nextIndex === countToDisplay) {
            return <>
                {displayMore && currentSlot}
                {!hideShowMore && <ShowMore />}
            </>
        }

        return currentSlot;
    }

    return <div className='pt-1'>
        {column &&
            <div className='grid grid-flow-row p-2 auto-rows-max md:auto-rows-min'>
                {column.slots.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()).slice(0, countToDisplay).map((slot: AppointmentSlot, index: number) =>
                    <SlotContainer key={index} slot={slot} index={slot.appointmentId} />)
                }
            </div>
        }
    </div>
}

export default DaySlots;
