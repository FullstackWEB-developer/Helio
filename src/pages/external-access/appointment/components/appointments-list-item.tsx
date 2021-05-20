import React, { Fragment, useEffect } from 'react';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import './appointment-list-item.scss';
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {selectDepartmentList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {getDepartments, getProviders} from '@shared/services/lookups.service';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

interface AppointmentDetailProps {
    data: Appointment | AppointmentSlot
}

const AppointmentsListItem = ({ data }: AppointmentDetailProps) => {
    dayjs.extend(customParseFormat);
    const dispatch = useDispatch();
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);
    useEffect(() => {
        dispatch(getProviders());
        dispatch(getDepartments());
    }, [dispatch]);


    const providerName = providers ? providers.find(a => a.id === data.providerId)?.displayName : '';
    const departmentName = departments ? departments.find(a => a.id === data.departmentId)?.name : '';

    const getItem = (item: Appointment | AppointmentSlot) => {
        if ('startDateTime' in item && item.startDateTime) {
            return <Fragment>
                <div className='2xl:w-96 subtitle2'>
                    {
                        `${dayjs(item.startDateTime).format('ddd, MMM DD, YYYY')}
                        ${dayjs(item.startTime, 'hh:mm').format('h:mm A')}`
                    }
                </div>
                <div className='2xl:w-96 body2'>{item.patientAppointmentTypeName}</div>
                <div className='flex flex-col body2'>
                    <div>{providerName}</div>
                    <div>{departmentName}</div>
                </div>
            </Fragment>
        }

        return <Fragment>
            <div className='2xl:w-96 subtitle2'>
                {utils.formatUtcDate(item.date, 'ddd, MMM DD, YYYY')} {item.startTime} {utils.formatUtcDate(item.date, 'A')}
            </div>
            <div className='2xl:w-96 body2'>{providerName}</div>
            <div className='2xl:w-96 body2'>{departmentName}</div>
        </Fragment>
    }

    return (
        <div className='pb-4 2xl:pb-2'>
           <div className='appointment-list-item h-32 2xl:h-16 px-4 flex flex-col 2xl:flex-row items-center justify-center 2xl:justify-start'>
               {getItem(data)}
           </div>
        </div>
    );
}

export default AppointmentsListItem;
