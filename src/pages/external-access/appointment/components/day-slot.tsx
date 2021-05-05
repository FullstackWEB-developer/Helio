import dayjs from 'dayjs';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {setSelectedAppointmentSlot} from '@pages/external-access/appointment/store/appointments.slice';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

export interface DaySlotsProps {
    date: string,
    column: any,
    startDate: Date
}

const DaySlots = ({date, column, startDate}: DaySlotsProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    let maxSlots = 8;
    const [displayMore, setDisplayMore] = useState<boolean>(false);
    const selectSlot = (slot: AppointmentSlot) => {
        dispatch(setSelectedAppointmentSlot(slot));
        history.push('/o/appointment-reschedule-confirm');
    }

    const isBordered = (slotsDate: string, slots: AppointmentSlot[]) => {
        return slots.length > 0 && dayjs(slotsDate).isSame(startDate);
    }

    const showMore = () => {
        setDisplayMore(!displayMore);
    }

    const getShowMore = () => {
        return <div className='pb-4 2xl:pb-2 cursor-pointer' onClick={() => showMore()}>
            <div className='appointment-list-item h-12 2xl:h-12 reschedule-slot px-4 flex flex-col 2xl:flex-row items-center justify-center'>
                <div className='2xl:w-96 subtitle2'>
                    {displayMore ? t('common.show_less') : t('common.show_more')}
                </div>
            </div>
        </div>
    }

    const getSlot = (slot: AppointmentSlot) => {
        return <div key={slot.appointmentId} className='pb-4 md:w-full 2xl:pb-2 cursor-pointer'>
            <div className='appointment-list-item h-12 2xl:h-12 md:reschedule-slot px-4 flex flex-col 2xl:flex-row items-center justify-center'
                 onClick={() => selectSlot(slot)}>
                <div className='2xl:w-96 subtitle2'>
                    {slot.startTime} {dayjs(date).format('A')}
                </div>
            </div>
        </div>
    }

    if (!column || !column.slots) {
        return null;
    }
    let countToDisplay = ((column.slots.length > maxSlots && displayMore) || column.slots.length < maxSlots) ? column.slots.length : maxSlots;

    return <div className='p-1'>
        {column && <div
            className={'grid grid-flow-row auto-rows-max md:auto-rows-min p-2' + (isBordered(date, column.slots) ? ' border rounded' : '')}>
            {
                column.slots.slice(0, countToDisplay).map((slot: AppointmentSlot, index: number) => {
                    if (maxSlots && index + 1 === countToDisplay) {
                        return getShowMore()
                    }
                    return getSlot(slot)
                })
            }
        </div>
        }
    </div>
}

export default DaySlots;
