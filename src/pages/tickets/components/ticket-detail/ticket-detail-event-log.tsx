import React, {useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {updateTicket} from '../../services/tickets.service';
import DateTime from '@components/datetime/datetime';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {useDispatch} from 'react-redux';
import Logger from '@shared/services/logger';
import utils from '@shared/utils/utils';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

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
                                    `${dayjs().to(dayjs(dueDate))} (${utils.formatUtcDate(dueDate, 'MMM DD, YYYY h:mm A')})`
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
        <DateTime
            isVisible={isVisible}
            placeholderDate='Select date'
            placeholderTime='Select time'
            setDateTime={setDateTime}
            setIsVisible={setIsVisible}
        />
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
