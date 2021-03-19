import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { ReactComponent as CalendarIcon } from '../../../../shared/icons/Icon-Calendar-24px.svg';
import { Ticket } from '../../models/ticket';
import { updateTicket } from '../../services/tickets.service';
import DateTime from '../../../../shared/components/datetime/datetime';

interface TicketDetailEventLogProps {
    ticket: Ticket
}

const TicketDetailEventLog = ({ ticket }: TicketDetailEventLogProps ) => {
    dayjs.extend(relativeTime);
    const { t } = useTranslation();
    const formatTemplate = 'ddd, MMM DD, YYYY h:mm A';
    const [isVisible, setIsVisible] = useState(false);
    const [dueDate, setDueDate] = useState(ticket ? ticket.dueDate : null);

    const openCalendar = () => {
        setIsVisible(true);
        setDueDate(ticket.dueDate);
    }

    const setDateTime = async (dueDateTime: Date) => {
        if (ticket && ticket.id && dueDateTime) {
            const ticketData: Ticket = {
                dueDate: dueDateTime ? dueDateTime : undefined
            };
            await updateTicket(ticket.id, ticketData).then(() => {
                setDueDate(dueDateTime);
                setIsVisible(false);
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
                                    `${dayjs().to(dayjs(dueDate))} ${dayjs(dueDate).format('D/M/YY h:mm A')}`
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
                    {dayjs(ticket?.createdOn).format(formatTemplate)}
                </dd>
                <dt className='subtitle2'>
                    {t('ticket_detail.info_panel.assigned_on')}
                </dt>
                <dd className='body2'>
                    {ticket?.assignedOn ? dayjs(ticket?.assignedOn).format(formatTemplate) : ''}
                </dd>
                <dt className='subtitle2'>
                    {t('ticket_detail.info_panel.updated_on')}
                </dt>
                <dd className='body2'>
                    {ticket?.modifiedOn ? dayjs(ticket?.modifiedOn).format(formatTemplate) : ''}
                </dd>
                <dt className='subtitle2'>
                    {t('ticket_detail.info_panel.closed_on')}
                </dt>
                <dd className='body2'>
                    {ticket?.closedOn ? dayjs(ticket?.closedOn).format(formatTemplate) : ''}
                </dd>
            </div>
        </dl>
    </div>
}

export default withErrorLogging(TicketDetailEventLog);