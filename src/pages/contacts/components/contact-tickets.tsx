import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {ChannelTypes} from '@pages/tickets/models/ticket-channel';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {TicketsPath} from 'src/app/paths';
import ContactTicketStatusDisplay from './contact-ticket-status';
import ContactTicketLabel from './contact-ticket-label';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utils from '@shared/utils/utils';

interface ContactTicketsProps {
    contactId?: string | number;
}
const ContactTickets = ({contactId}: ContactTicketsProps) => {
    const history = useHistory();
    const {t} = useTranslation();
    dayjs.extend(relativeTime);
    const sysdate = Date.now();
    const tickets: TicketBase[] = [
        {
            id: '6435361d-0c00-4096-b057-552fbb07fc86',
            ticketNumber: 2730,
            status: 5,
            type: '1',
            priority: 1,
            channel: 1,
            subject: 'Ticket for chat',
            dueDate: '',
            createdOn: '2021-04-27T08:32:16.660794',
            closedOn: '2021-04-27T08:37:20.167354'
        },
        {
            id: '6435361d-0c00-4096-b057-552fbb07fc86',
            ticketNumber: 2731,
            status: 3,
            type: '1',
            priority: 1,
            channel: 2,
            subject: 'Ticket for call',
            dueDate: '2021-04-28T08:32:16.660794',
            createdOn: '2021-04-27T08:32:16.660794',
            closedOn: ''
        },
        {
            id: '6435361d-0c00-4096-b057-552fbb07fc86',
            ticketNumber: 2732,
            status: 2,
            type: '1',
            priority: 1,
            channel: 3,
            subject: 'Ticket from web',
            dueDate: '2021-04-28T08:32:16.660794',
            createdOn: '2021-04-27T08:32:16.660794',
            closedOn: '2021-04-29T08:32:16.660794'
        }
    ];
    const renderChannelIcon = (channel: number) => {
        switch (channel) {
            case ChannelTypes.Chat:
                return <SvgIcon type={Icon.Chat} fillClass='contact-light-fill' />;
            case ChannelTypes.PhoneCall:
                return <SvgIcon type={Icon.Phone} fillClass='contact-light-fill' />;
            case ChannelTypes.WebSite:
                return <SvgIcon type={Icon.Web} fillClass='contact-light-fill' />;
            case ChannelTypes.UserCreated:
                return <SvgIcon type={Icon.Sms} fillClass='contact-light-fill' />;
            default:
                return channel;
        }
    }
    return (
        <>
            <div className={'py-3 cursor-pointer align-middle border-b'}
                onClick={() => history.push(`${TicketsPath}/new`)}>
                <SvgIcon type={Icon.AddBlack}
                    className='icon-medium h-8 w-8 pl-2 cursor-pointer'
                    fillClass='active-item-icon' />
            </div>
            {
                tickets && tickets.map(ticket => {
                    return (
                        <div className='py-4 border-b cursor-pointer'>
                            <div className='flex flex-row body2'>
                                {
                                    renderChannelIcon(ticket.channel)
                                }
                                <span className="mx-2">{ticket.ticketNumber}</span>
                                <span className='flex-auto subtitle2'>{ticket.subject}</span>
                                {
                                    ticket.status && (
                                        <div className='flex w-36 body3'>
                                            <ContactTicketStatusDisplay status={ticket.status} iconClass='w-5 mt-0.5' />
                                        </div>
                                    )
                                }
                            </div>
                            <div className='flex flex-row body2 items-center pt-1'>
                                {
                                    ticket.dueDate && (
                                        <ContactTicketLabel labelText={t('tickets.overdue')}
                                            valueText={dayjs().to(dayjs(ticket.dueDate))}
                                            isDanger={dayjs(ticket.dueDate).isBefore(sysdate)} />
                                    )
                                }
                                {
                                    ticket.closedOn && (
                                        <ContactTicketLabel labelText={t('tickets.closed')} valueText={utils.formatUtcDate(dayjs(ticket.closedOn).toDate(), 'MMM DD, YYYY h:mm a')} />
                                    )
                                }
                                {
                                    ticket.createdOn && (
                                        <ContactTicketLabel labelText={t('tickets.created')} valueText={utils.formatUtcDate(dayjs(ticket.createdOn).toDate(), 'MMM DD, YYYY h:mm a')} />
                                    )
                                }
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default ContactTickets;