import React, {useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {updateTicket} from '../../services/tickets.service';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {useDispatch} from 'react-redux';
import Logger from '@shared/services/logger';
import utils from '@shared/utils/utils';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import Button from '@components/button/button';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import ControlledTimeInput from '@components/controllers/ControlledTimeInput';
import {useForm} from 'react-hook-form';

interface TicketDetailEventLogProps {
    ticket: Ticket
}

const TicketDetailEventLog = ({ticket}: TicketDetailEventLogProps) => {
    dayjs.extend(relativeTime);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const logger = Logger.getInstance();
    const formatTemplate = 'ddd, MMM DD, YYYY h:mm A';
    const [isVisible, setIsVisible] = useState(false);
    const [dueDate, setDueDate] = useState(ticket ? ticket.dueDate : null);
    const {handleSubmit, control} = useForm();
    const openCalendar = () => {
        setIsVisible(!isVisible);
        setDueDate(ticket.dueDate);
    }

    const updateTicketMutation = useMutation(updateTicket);

    const setDateTime = async (dueDateTime: Date) => {
        if (ticket && ticket.id && dueDateTime) {
            const ticketData: Ticket = {
                dueDate: dueDateTime ? dueDateTime : undefined,
                status: ticket.status
            };
            updateTicketMutation.mutate({id: ticket.id, ticketData},
                {
                    onSuccess: (data) => {
                        setDueDate(dueDateTime);
                        setIsVisible(false);
                        dispatch(setTicket(data));
                    },
                    onError: (error) => {
                        logger.error('Error updating ticket', error);
                    }
                });
        }
    };

    const onSubmit = async (formData: any) => {
        if (!formData) {
            return;
        }

        const dateTime = utils.getDateTime(formData.date, formData.time);
        if (dateTime) {
            await setDateTime(dateTime.toDate());
        }
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
                            dueDate ?
                                (
                                    `${dayjs().to(dayjs.utc(ticket.dueDate))} (${utils.formatUtcDate(dueDate, 'MMM DD, YYYY h:mm A')})`
                                )
                                : t('common.not_available')
                        }
                    </div>
                </div>
            </div>
            <div className='cursor-pointer' onClick={() => openCalendar()}>
                <SvgIcon type={Icon.Calendar}
                         className='icon-medium h-8 w-8 pl-2 cursor-pointer'
                         fillClass='active-item-icon'/>
            </div>
        </div>
        {isVisible &&
        <form onSubmit={handleSubmit(onSubmit)}>
            <ControlledDateInput
                name='date'
                control={control}
                label='ticket_detail.info_panel.select_date'
                dataTestId='datetime-date'
            />
            <ControlledTimeInput
                name='time'
                control={control}
                label='ticket_detail.info_panel.select_time'
                dataTestId='datetime-time'
            />
            <div className='flex flex-row space-x-4 justify-end bg-secondary-50 mt-2'>
                <div className='flex items-center'>
                    <Button data-test-id='datetime-cancel-button'
                            type={'button'}
                            buttonType='secondary'
                            label={'common.cancel'}
                            onClick={() => setIsVisible(false)}
                    />
                </div>
                <div>
                    <Button data-test-id='datetime-save-button'
                            type={'submit'}
                            buttonType='small'
                            isLoading={updateTicketMutation.isLoading}
                            label={'common.save'} />
                </div>
            </div>
        </form>}
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
