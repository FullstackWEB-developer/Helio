import React, {useEffect} from 'react';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import './appointment-table-item.scss';
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllProviderList, selectLocationList} from '@shared/store/lookups/lookups.selectors';
import {getAllProviders, getLocations} from '@shared/services/lookups.service';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {AppointmentTableData} from '@pages/external-access/appointment/components/appointment-table-type';
import Button from '@components/button/button';
import classnames from 'classnames';

interface AppointmentDetailProps {
    data: AppointmentTableData,
    isDetailsColumnVisible?: boolean,
    isActionColumnVisible?: boolean,
    isRowHoverDisabled?: boolean,
    onClick?: (appointment: AppointmentTableData) => void,
    onActionClick?: (appointment: AppointmentTableData) => void,
}

const AppointmentTableItem = ({data,
    isDetailsColumnVisible = true,
    isActionColumnVisible = true,
    isRowHoverDisabled = false,
    onClick,
    onActionClick
}: AppointmentDetailProps) => {
    dayjs.extend(customParseFormat);
    const dispatch = useDispatch();
    const departments = useSelector(selectLocationList);
    const providers = useSelector(selectAllProviderList);
    useEffect(() => {
        dispatch(getAllProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const providerName = providers ? providers.find(a => a.id === data.providerId)?.displayName : '';
    const departmentName = departments ? departments.find(a => a.id === data.departmentId)?.name : '';

    const getAppointmentDate = (appointment: Appointment | AppointmentSlot) => {
        if ('startDateTime' in appointment && appointment.startDateTime) {
            return `${dayjs(appointment.startDateTime).format('ddd, MMM DD, YYYY')} ${dayjs(appointment.startTime, 'hh:mm').format('h:mm A')}`;
        } else {
            return `${utils.formatUtcDate(appointment.date, 'ddd, MMM DD, YYYY')} ${appointment.startTime} ${utils.formatUtcDate(appointment.date, 'A')}`;
        }
    }

    const getClassName = () => {
        return classnames('appointment-table-row px-6 py-3.5 flex border-b body2 h-12', {
            'cursor-pointer': !!onClick,
            'hover:bg-gray-100': !isRowHoverDisabled
        });

    }
    return (
        <div className={getClassName()} onClick={() => onClick && onClick(data)}>
            <div className={classnames('flex w-11/12 xl:w-4/12 items-center subtitle2', {'appointment-date': !isRowHoverDisabled})}>
                {getAppointmentDate(data)}
            </div>
            {isDetailsColumnVisible &&
                <div className='hidden xl:flex w-3/12 pr-1 items-center'>{data.patientAppointmentTypeName}</div>
            }
            <div className='hidden xl:flex w-3/12 pr-1 items-center'>{providerName}</div>
            <div className='hidden xl:flex w-3/12 pr-1 items-center'>{departmentName}</div>
            {isActionColumnVisible &&
                <div className='hidden xl:flex w-3/12 items-center'>
                    <Button
                        buttonType='link'
                        label='external_access.appointments.reschedule'
                        type='button'
                        onClick={() => onActionClick && onActionClick(data)}
                    />
                </div>
            }
        </div>
    );
}

export default AppointmentTableItem;
