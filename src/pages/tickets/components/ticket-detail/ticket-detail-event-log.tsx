import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import utils from '@shared/utils/utils';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import ControlledTimeInput from '@components/controllers/ControlledTimeInput';
import {Control} from 'react-hook-form';
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';
import {useDispatch, useSelector} from 'react-redux';
import {selectTicketUpdateModel} from '@pages/tickets/store/tickets.selectors';
import {setTicketUpdateModel} from '@pages/tickets/store/tickets.slice';
interface TicketDetailEventLogProps {
    ticket: Ticket,
    control: Control<TicketUpdateModel>,
    isVisible: boolean,
    setIsVisible: (isVisible: boolean) => void
}

const TicketDetailEventLog = ({ticket, control, isVisible, setIsVisible}: TicketDetailEventLogProps) => {
    dayjs.extend(relativeTime);
    const {t} = useTranslation();
    const formatTemplate = 'ddd, MMM DD, YYYY h:mm A';
    const dispatch = useDispatch();


    const openCalendar = () => {
        setIsVisible(!isVisible);
    }

    const updateModel = useSelector(selectTicketUpdateModel);

    const handleDateChange = (date: Date | undefined) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            dueDate: date
        }));
    }

    const handleTimeChange = (time: string | undefined) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            dueTime: time
        }));
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        <div className='flex justify-between w-full'>
            <div className='flex flex-row items-center'>
                <div className='body2-medium pr-2'>
                    {t('ticket_detail.info_panel.due')}
                </div>
                <div className='body2 flex flex-row'>
                    <div className='py-1'>
                        {
                            updateModel.storedDueDate ?
                                (
                                    `${dayjs().to(dayjs.utc(ticket.dueDate))} (${utils.formatUtcDate(updateModel.storedDueDate, 'MMM DD, YYYY h:mm A')})`
                                )
                                : t('common.not_available')
                        }
                    </div>
                </div>
            </div>
            <div className='cursor-pointer' onClick={() => openCalendar()}>
                <SvgIcon type={Icon.Calendar}
                    className='icon-medium h-8 w-8 pl-2 cursor-pointer'
                    fillClass='active-item-icon' />
            </div>
        </div>

        {
            isVisible &&
            <>
                <ControlledDateInput
                    name='date'
                    control={control}
                    label='ticket_detail.info_panel.select_date'
                    dataTestId='datetime-date'
                    onChange={handleDateChange}
                    value={updateModel.dueDate}
                />
                <ControlledTimeInput
                    name='time'
                    control={control}
                    label='ticket_detail.info_panel.select_time'
                    dataTestId='datetime-time'
                    onChange={handleTimeChange}
                    defaultValue={updateModel.dueTime}
                    value={updateModel.dueTime}
                />
            </>
        }

        <dl>
            <div className='sm:grid sm:grid-cols-2'>
                <dt className='body2-medium mt-6'>
                    {t('ticket_detail.info_panel.created_on')}
                </dt>
                <dd className='body2 mt-6'>
                    {utils.formatUtcDate(ticket?.createdOn, formatTemplate)}
                </dd>
                <dt className='body2-medium'>
                    {t('ticket_detail.info_panel.assigned_on')}
                </dt>
                <dd className='body2'>
                    {utils.formatUtcDate(ticket?.assignedOn, formatTemplate)}
                </dd>
                <dt className='body2-medium'>
                    {t('ticket_detail.info_panel.updated_on')}
                </dt>
                <dd className='body2'>
                    {utils.formatUtcDate(ticket?.modifiedOn, formatTemplate)}
                </dd>
                <dt className='body2-medium'>
                    {t('ticket_detail.info_panel.closed_on')}
                </dt>
                <dd className='body2'>
                    {utils.formatUtcDate(ticket?.closedOn, formatTemplate)}
                </dd>
            </div>
        </dl>
    </div>;
}

export default withErrorLogging(TicketDetailEventLog);
