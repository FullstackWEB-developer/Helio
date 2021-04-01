import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Appointment } from '../../external-access/appointment/models/appointment';
import { selectDepartmentById, selectProviderById } from '../../../shared/store/lookups/lookups.selectors';
import { RootState } from '../../../app/store';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
interface AppointmentProps {
    appointment: Appointment,
    border?: boolean,
    isLast?: boolean
}

const AppointmentDisplay = ({ appointment, border, isLast }: AppointmentProps) => {
    const department = useSelector((state: RootState) => selectDepartmentById(state, appointment.departmentId));
    const provider = useSelector((state: RootState) => selectProviderById(state, appointment.providerId));
    const dateStr = () => {
        return (
            <Fragment>
                {`${dayjs(appointment.date).format('MMM, DD, YYYY')}`}
                {!isLast && <span className='subtitle2'>
                    {` at ${dayjs(appointment.startTime, 'HH:mm').format('h:mm A')} `}
                </span>}
            </Fragment>
        )
    }

    return <Fragment>
        { isLast ?
            <div className='pt-3'>
                    <div className='body2-medium'>
                        {dateStr()}
                        <span className='subtitle2'>{` ${appointment.patientAppointmentTypeName}`}</span>
                    </div>
                    <div className={`subtitle2 pb-3 ${border ? 'border-b' : ''}`}>
                        {provider?.displayName}, {department?.patientDepartmentName}
                    </div>
            </div> :
            <div className={`grid grid-cols-2 gap-4 pt-3 ${border ? 'border-b' : ''}`}>
                <div>
                    <div className='body2-medium'>{dateStr()}</div>
                    <div className={'subtitle2 pb-3'}>{provider?.displayName}</div>
                </div>
                <div>
                    <div className='subtitle2'>{appointment.patientAppointmentTypeName}</div>
                    <div className={'subtitle2 pb-3'}>{department?.patientDepartmentName}</div>
                </div>
            </div>
        }
    </Fragment>
};

export default AppointmentDisplay;
