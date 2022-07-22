import React, {Fragment, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {Appointment} from '@pages/external-access/appointment/models';
import {selectAllProviderList, selectDepartmentById} from '@shared/store/lookups/lookups.selectors';
import {RootState} from '@app/store';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import {useQuery} from 'react-query';
import {AppointmentType} from '@pages/external-access/appointment/models';
import {AxiosError} from 'axios';
import {GetAppointmentType, OneMinute} from '@constants/react-query-constants';
import {
    getAppointmentTypeById
} from '@pages/appointments/services/appointments.service';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

interface AppointmentDisplayProps {
    appointment: Appointment,
    border?: boolean,
    isLast?: boolean,
    isDetailed?: boolean
}

const AppointmentDisplay = ({ appointment, border, isLast, isDetailed }: AppointmentDisplayProps) => {
    const department = useSelector((state: RootState) => selectDepartmentById(state, appointment.departmentId));
    const providers = useSelector(selectAllProviderList);
    const [appointmentTypeName, setAppointmentTypeName] = useState<string>('');

    const provider = useMemo(() => {
        return providers?.find(a => a.id === appointment.providerId);
    }, [providers, appointment.providerId]);

    useQuery<AppointmentType, AxiosError>([GetAppointmentType, appointment.appointmentTypeId], () => getAppointmentTypeById(appointment.appointmentTypeId), {
        enabled: !!appointment?.appointmentTypeId,
        cacheTime: 5 * OneMinute,
        staleTime: 0,
        onSuccess: (data) => {
            if (data && data.name) {
                setAppointmentTypeName(data.name);
            } else {
                setAppointmentTypeName(appointment.patientAppointmentTypeName);
            }
        },
        onError: () => {
            setAppointmentTypeName(appointment.patientAppointmentTypeName);
        }
    });
    const dateStr = () => {
        return (
            <Fragment>
                {`${dayjs(appointment.date).format('MMM, DD, YYYY')}`}
                {!isLast && <span className='subtitle2'>
                    {` ${dayjs.utc(appointment.startTime, 'HH:mm').format('[at] h:mm A')} `}
                </span>}
            </Fragment>
        )
    }

    const getAppointment = () => {
        return <div className={`pt-3 ${getBorder()}`}>
            <div className='body2-medium'>
                {dateStr()}
                <span className='subtitle2 pl-4'>{` ${appointmentTypeName}`}</span>
            </div>
            <div className='subtitle2'>
                {provider?.displayName ? `${provider.displayName}, ` : ''} {department?.patientDepartmentName}
                {(appointment.notes && appointment.notes.length > 0) && appointment.notes.map((note) => {
                    return <div className='subtitle2' key={note.noteId}>{note.noteText}</div>
                })}
            </div>
        </div>
    }

    const getBorder = () => {
        return border ? 'border-b' : '';
    }

    return <Fragment>
        { isLast ? getAppointment() :
            isDetailed ? <Fragment>
                {getAppointment()}
            </Fragment> :
            <div className={`pt-2 ${getBorder()}`}>
                <div>
                    <div className='body2-medium'>{dateStr()}</div>
                    <div className={'subtitle2'}>{provider?.displayName}</div>
                </div>
                <div>
                    <div className='subtitle2'>{appointmentTypeName}</div>
                    <div className={'subtitle2'}>{department?.patientDepartmentName}</div>
                </div>
            </div>
        }
    </Fragment>
};

export default AppointmentDisplay;
