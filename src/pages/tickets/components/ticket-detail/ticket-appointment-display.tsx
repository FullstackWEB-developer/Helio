import React from 'react';
import {useSelector} from 'react-redux';
import {selectDepartmentById, selectProviderById} from '@shared/store/lookups/lookups.selectors';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {RootState} from '@app/store';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';

dayjs.extend(customParseFormat);

interface AppointmentDisplayProps {
    appointment: Appointment,
    border?: boolean,
    isDetailed?: boolean
}

const TicketAppointmentDisplay = ({appointment}: AppointmentDisplayProps) => {
    const department = useSelector((state: RootState) => selectDepartmentById(state, appointment.departmentId));
    const provider = useSelector((state: RootState) => selectProviderById(state, appointment.providerId));


    return (<div className='flex flex-col'>
        <div className='flex flex-row space-x-1'>
            <div className='body2-medium'>
                {dayjs(appointment.date).format('MMM, DD, YYYY')}
            </div>
            <div className='body2'>
                {dayjs.utc(appointment.startTime, 'HH:mm').format('[at] h:mm A')}
            </div>
        </div>
        <div className='subtitle2'>{appointment.patientAppointmentTypeName}</div>
        <div className='body2'>{provider?.displayName}</div>
        <div className='body2'>{department?.name}</div>
    </div>)
};

export default TicketAppointmentDisplay;
