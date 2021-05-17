import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {ChannelTypes} from '@pages/tickets/models/ticket-channel';
import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {TicketsPath} from 'src/app/paths';
import ContactTicketLabel from './contact-ticket-label';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utils from '@shared/utils/utils';
import TicketStatusDot from '@pages/tickets/components/ticket-status-dot';
import {ContactTicketsRequest} from '@pages/tickets/models/patient-tickets-request';
import {DefaultPagination} from '@shared/models/paging.model';
import {useQuery} from 'react-query';
import {OneMinute, QueryContactTickets} from '@constants/react-query-constants';
import {getContactTickets} from '@pages/tickets/services/tickets.service';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import utc from 'dayjs/plugin/utc';

interface ContactTicketsProps {
    contactId: string;
}

const ContactTickets = ({contactId}: ContactTicketsProps) => {
    const history = useHistory();
    const {t} = useTranslation();
    dayjs.extend(relativeTime);
    dayjs.extend(utc);
    const sysdate = Date.now();

    const query: ContactTicketsRequest = {
        contactId,
        ...DefaultPagination,
        pageSize: 10
    }

    const {isLoading, data: tickets} = useQuery<TicketBase[], Error>([QueryContactTickets, query], () =>
            getContactTickets(query),
        {
            staleTime: OneMinute
        }
    );

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

    const getTicket = (ticket: TicketBase) => {
        return <div className='py-4 border-b cursor-pointer' key={ticket.id}
                                        onClick={() => history.push(`${TicketsPath}/${ticket.ticketNumber}`)}>
            <div className='flex flex-row body2'>
                {
                    renderChannelIcon(ticket.channel)
                }
                <span className="mx-2">{ticket.ticketNumber}</span>
                <span className='flex-auto subtitle2'>{ticket.subject}</span>
                {
                    ticket.status && (
                        <div className='flex w-36 body3'>
                            <div>
                                <TicketStatusDot ticket={ticket}/>
                            </div>
                            <div className='pl-3'>
                                {ticket.status && t(`tickets.statuses.${(ticket.status)}`)}
                            </div>
                        </div>
                    )
                }
            </div>
            <div className='flex flex-row body2 items-center pt-1'>
                {
                    ticket.dueDate && (
                        <ContactTicketLabel labelText={t('tickets.overdue')}
                                            valueText={dayjs().to(dayjs.utc(ticket.dueDate).local())}
                                            isDanger={dayjs(ticket.dueDate).isBefore(sysdate)}/>
                    )
                }
                {
                    ticket.closedOn && (
                        <ContactTicketLabel labelText={t('tickets.closed')}
                                            valueText={utils.formatUtcDate(ticket.closedOn, 'MMM DD, YYYY h:mm a')}/>
                    )
                }
                {
                    ticket.createdOn && (
                        <ContactTicketLabel labelText={t('tickets.created')}
                                            valueText={utils.formatUtcDate(ticket.createdOn, 'MMM DD, YYYY h:mm a')}/>
                    )
                }
            </div>
        </div>
    }

    if (isLoading) {
        return <ThreeDots/>;
    }

    return <Fragment>
        <div className={'py-3 cursor-pointer align-middle border-b'}
             onClick={() => history.push(`${TicketsPath}/new?contactId=${contactId}`)}>
            <SvgIcon type={Icon.AddBlack}
                     className='icon-medium h-8 w-8 pl-2 cursor-pointer'
                     fillClass='active-item-icon'/>
        </div>
        {
            tickets && tickets.map(ticket => {
                return getTicket(ticket)
            })
        }
    </Fragment>
}

export default ContactTickets;
