import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
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
    dayjs.extend(customParseFormat);
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

    const getShowMore = (slot: AppointmentSlot) => {
        return <div key={slot.appointmentId} className='pb-4 cursor-pointer' onClick={() => setDisplayMore(!displayMore)}>
            <div className='appointment-list-item h-12 w-56 md:w-80 lg:w-32 reschedule-slot px-4 flex flex-col flex-row items-center justify-center'>
                <div className='body2'>
                    {displayMore ? t('common.show_less') : t('common.show_more')}
                </div>
            </div>
        </div>
    }

    const getSlot = (slot: AppointmentSlot) => {
        return <div key={slot.appointmentId} className='pb-4 md:w-full cursor-pointer'>
            <div className='appointment-list-item h-12 w-56 md:w-80 lg:w-32 reschedule-slot px-4 flex flex-col flex-row items-center justify-center'
                 onClick={() => selectSlot(slot)}>
                <div className='body2'>
                    {dayjs(slot.startTime, 'HH:mm').format('h:mm A')}
                </div>
            </div>
        </div>
    }

    if (!column || !column.slots) {
        return <div className='w-36'> </div>;
    }
    let countToDisplay = ((column.slots.length > maxSlots && displayMore) || column.slots.length < maxSlots) ? column.slots.length : maxSlots;

    return <div className='pt-1'>
        {column && <div
            className={'grid grid-flow-row auto-rows-max md:auto-rows-min p-2' + (isBordered(date, column.slots) ? ' border rounded' : '')}>
            {
                column.slots.slice(0, countToDisplay).map((slot: AppointmentSlot, index: number) => {
                    if (maxSlots && index + 1 === countToDisplay) {
                        return getShowMore(slot)
                    }
                    return getSlot(slot)
                })
            }
        </div>
        }
    </div>
}

export default DaySlots;
