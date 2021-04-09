import React, {useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {ReactComponent as CalendarIcon} from '@icons/Icon-Calendar-24px.svg';
import {Ticket} from '../../models/ticket';
import {updateTicket} from '../../services/tickets.service';
import DateTime from '@components/datetime/datetime';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {useDispatch} from 'react-redux';
import Logger from '@shared/services/logger';
import utils from '@shared/utils/utils';

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

    const openCalendar = () => {
        setIsVisible(true);
        setDueDate(ticket.dueDate);
    }

    const updateTicketMutation = useMutation(updateTicket);

    const setDateTime = async (dueDateTime: Date) => {
        if (ticket && ticket.id && dueDateTime) {
            const ticketData: Ticket = {
                dueDate: dueDateTime ? dueDateTime : undefined
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

    return <div className={'py-4 mx-auto flex flex-col'}>
        <dl>
            <div className='sm:grid sm:grid-cols-2'>
                <dt className='subtitle2 py-1'>
                    {t('ticket_detail.info_panel.due')}
                </dt>
                <dd className='body2 flex flex-row'>
                    <span className='py-1'>
                        {
                            dueDate ?
                                (
                                    `${dayjs().to(dayjs(dueDate))} ${utils.formatUtcDate(dueDate, 'D/M/YY h:mm A')}`
                                )
                            : t('common.not_available')
                        }
                    </span>
                    <div className = 'pt-0.5 pl-4 cursor-pointer' onClick={() => openCalendar()}>
                        <CalendarIcon className='h-8 w-8 pl-2 cursor-pointer' />
                    </div>
                </dd>
            </div>
        </dl>
        <DateTime
            isVisible={isVisible}
            placeholderDate='Select date'
            placeholderTime='Select time'
            setDateTime={setDateTime}
            setIsVisible={setIsVisible}
        />
        <dl>
            <div className='sm:grid sm:grid-cols-2'>
                <dt className='subtitle2 mt-6'>
                    {t('ticket_detail.info_panel.created_on')}
                </dt>
                <dd className='body2 mt-6'>
                    {utils.formatUtcDate(ticket?.createdOn, formatTemplate)}
                </dd>
                <dt className='subtitle2'>
                    {t('ticket_detail.info_panel.assigned_on')}
                </dt>
                <dd className='body2'>
                    {utils.formatUtcDate(ticket?.assignedOn, formatTemplate)}
                </dd>
                <dt className='subtitle2'>
                    {t('ticket_detail.info_panel.updated_on')}
                </dt>
                <dd className='body2'>
                    {utils.formatUtcDate(ticket?.modifiedOn, formatTemplate)}
                </dd>
                <dt className='subtitle2'>
                    {t('ticket_detail.info_panel.closed_on')}
                </dt>
                <dd className='body2'>
                    {utils.formatUtcDate(ticket?.closedOn, formatTemplate)}
                </dd>
            </div>
        </dl>
    </div>
}

export default withErrorLogging(TicketDetailEventLog);
