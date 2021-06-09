import {useState} from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import {useTranslation} from 'react-i18next';
import {setSelectedAppointmentSlot} from '@pages/external-access/appointment/store/appointments.slice';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import './day-slot.scss';
export interface DaySlotsProps {
    column: any
}
const MAX_SLOTS = 8;
const DaySlots = ({column}: DaySlotsProps) => {
    dayjs.extend(customParseFormat);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [displayMore, setDisplayMore] = useState<boolean>(false);

    const selectSlot = (slot: AppointmentSlot) => {
        dispatch(setSelectedAppointmentSlot(slot));
        history.push('/o/appointment-reschedule-confirm');
    }

    const ShowMore = ({value}: {value: AppointmentSlot}) => {
        return <div className='pb-4 cursor-pointer' onClick={() => setDisplayMore(!displayMore)}>
            <div className='day-slot reschedule-slot h-12 w-56 md:w-80 px-4 flex flex-col flex-row items-center justify-center'>
                <div className='body2'>
                    {displayMore ? t('common.show_less') : t('common.show_more')}
                </div>
            </div>
        </div>
    }

    const Slot = ({value}: {value: AppointmentSlot}) => {
        return (<div className='pb-4 md:w-full cursor-pointer'>
            <div className='day-slot reschedule-slot h-12 w-56 md:w-80 lg:w-32 px-4 flex flex-col flex-row items-center justify-center'
                onClick={() => selectSlot(value)}>
                <div className='body2'>
                    {dayjs(value.startTime, 'HH:mm').format('h:mm A')}
                </div>
            </div>
        </div>);
    }

    if (!column || !column.slots) {
        return (<div className='w-56 md:w-80  reschedule-slot mx-2'> </div>);
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
                <ShowMore value={slot} />
            </>
        }

        return currentSlot;
    }

    return <div className='pt-1'>
        {column &&
            <div className='grid grid-flow-row auto-rows-max md:auto-rows-min p-2'>
                {column.slots.slice(0, countToDisplay).map((slot: AppointmentSlot, index: number) =>
                    <SlotContainer key={index} slot={slot} index={index} />)
                }
            </div>
        }
    </div>
}

export default DaySlots;
