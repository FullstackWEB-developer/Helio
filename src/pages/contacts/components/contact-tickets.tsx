import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import React, {Fragment, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {TicketsPath} from 'src/app/paths';
import ContactTicketLabel from './contact-ticket-label';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utils from '@shared/utils/utils';
import {ContactTicketsRequest} from '@pages/tickets/models/patient-tickets-request';
import {DefaultPagination, Paging} from '@shared/models/paging.model';
import {useQuery} from 'react-query';
import {QueryContactTickets} from '@constants/react-query-constants';
import {getContactTickets} from '@pages/tickets/services/tickets.service';
import utc from 'dayjs/plugin/utc';
import TicketListHeaderCell from '@pages/tickets/components/ticket-list-header-cell';
import {
    getSortDirection,
    getSortOrder,
    updateSort
} from '@shared/utils/sort-utils';
import {SortDirection} from '@shared/models/sort-direction';
import {TicketQuery} from '@pages/tickets/models/ticket-query';
import TicketChannelIcon from '@pages/tickets/components/ticket-channel-icon';
import TicketStatus from '@pages/tickets/components/ticket-status';
import Spinner from '@components/spinner/Spinner';
import Pagination from '@components/pagination/pagination';

interface ContactTicketsProps {
    contactId: string;
}

const ContactTickets = ({contactId}: ContactTicketsProps) => {
    const history = useHistory();
    const {t} = useTranslation();
    dayjs.extend(relativeTime);
    dayjs.extend(utc);
    const sysdate = dayjs.utc();
    const pageSize = 5;
    const [contactTicketFilter, setContactTicketFilter] = useState<TicketQuery>({
        ...DefaultPagination,
        pageSize
    });

    
    const [paginationProperties, setPaginationProperties] = useState<Paging>({...DefaultPagination, pageSize})
    const [query, setQuery] = useState<ContactTicketsRequest>({...paginationProperties, contactId});

    const {isLoading, isFetching, data, refetch} = useQuery([QueryContactTickets, contactTicketFilter], () =>
        getContactTickets(query),
        {
            onSuccess: (data) => {
                setPaginationProperties({
                    pageSize: data.pageSize,
                    page: data.page,
                    totalCount: data.totalCount,
                    totalPages: data.totalPages
                });
            }
        }
    );

    const applySort = (field: string | undefined, direction: SortDirection) => {
        if (!field) {
            return;
        }
        const sorts = updateSort([...contactTicketFilter.sorts || []], field, direction);
        const newFilters = {...contactTicketFilter, sorts: [...sorts], page: 1}
        setContactTicketFilter(newFilters);
        const newQuery = {...query, ...newFilters};
        setQuery(newQuery);        
    }

    const formatDueDate = (dueDate: Date) => {
        const [days, hours, minute] = utils.getRelativeTime(dueDate);
        return days || hours ? utils.formatRelativeTime(days, hours, minute, true, 'min')
            : ` In ${utils.formatRelativeTime(days, hours, minute, true, 'min')}`;
    }

    const getDueDate = (dueDate: Date) => {
        return dayjs.utc(dueDate).isBefore(sysdate) ?
            <ContactTicketLabel labelText={t('tickets.overdue')}
                valueText={formatDueDate(dueDate)}
                isDanger={true} /> :
            <ContactTicketLabel labelText=''
                valueText={formatDueDate(dueDate)}
                isDanger={false} />
    }

    const handlePageChange = (p: Paging) => {
        setPaginationProperties(p);
        setContactTicketFilter({...contactTicketFilter, ...p});
        setQuery({...query, ...p})
    }
    
    const onTicketSelect = (ticket: TicketBase) => {
        history.push(`${TicketsPath}/${ticket.ticketNumber}`)
    };

    const getTicket = (ticket: TicketBase) => {
        return <div className='relative flex flex-row items-center w-full px-6 py-3 border-b auto-cols-max body2 hover:bg-gray-100 h-18'
            key={ticket.id}
            >
            <div className='w-24 cursor-pointer' onClick={() => onTicketSelect(ticket)}>
                <TicketChannelIcon channel={ticket.channel} />
            </div>
            <div className='w-2/12 cursor-pointer' onClick={() => onTicketSelect(ticket)}>
                {ticket.ticketNumber}
            </div>
            <div className='w-3/12 cursor-pointer max-w-xs truncate subtitle2' onClick={() => onTicketSelect(ticket)}>
                <span>{ticket.subject ? ticket.subject : '-'}</span>
            </div>
            <div className='w-3/12 body3 cursor-pointer' onClick={() => onTicketSelect(ticket)}>
                {
                    ticket.dueDate && <Fragment>{getDueDate(ticket.dueDate)}</Fragment>
                }
            </div>
            <div className='w-2/12 h-full'>
                <TicketStatus onUpdated={() => refetch().then()} ticket={ticket} isArrow={false} />
            </div>
        </div>
    };

    return <Fragment>
        <div className={'flex items-center justify-between py-3 border-b'}>
            <div className='flex items-center body2' onClick={() => history.push(`${TicketsPath}/new?contactId=${contactId}`)}>
                <SvgIcon type={Icon.Add}
                    className='pl-1 cursor-pointer icon-large'
                    fillClass='active-item-icon' />
                <span className='pl-2 cursor-pointer contact-accent-color hover:underline'>{`${t('contacts.contact_details.create_ticket')}`}</span>
            </div>
            {
                paginationProperties?.totalCount !== 0 &&
                <Pagination value={paginationProperties} onChange={handlePageChange} />
            }
        </div>
        <div className='flex flex-row items-center content-center w-full h-12 px-6 py-4 bg-gray-100 auto-cols-min body2-medium'>
            <TicketListHeaderCell className='w-24'>{t('tickets.channel')}</TicketListHeaderCell>
            <TicketListHeaderCell
                className='w-2/12'
                field={'Id'}
                isSortable
                sortDirection={getSortDirection(contactTicketFilter.sorts, 'Id')}
                sortOrder={getSortOrder(contactTicketFilter.sorts, 'Id')}
                onClick={applySort}
            >
                {t('tickets.id')}
            </TicketListHeaderCell>
            <TicketListHeaderCell className='w-3/12'>{t('tickets.subject')}</TicketListHeaderCell>
            <TicketListHeaderCell
                className='w-3/12'
                field={'DueDate'}
                isSortable
                sortDirection={getSortDirection(contactTicketFilter.sorts, 'DueDate')}
                sortOrder={getSortOrder(contactTicketFilter.sorts, 'DueDate')}
                onClick={applySort}
            >
                {t('tickets.due_in')}
            </TicketListHeaderCell>
            <TicketListHeaderCell
                className='w-2/12'
                field={'Status'}
                isSortable
                sortDirection={getSortDirection(contactTicketFilter.sorts, 'Status')}
                sortOrder={getSortOrder(contactTicketFilter.sorts, 'Status')}
                onClick={applySort}
            >
                {t('tickets.status')}
            </TicketListHeaderCell>
        </div>
        {
            (isLoading || isFetching) ? <Spinner fullScreen className='pt-4' /> :
                (
                    data && data.results.length > 0 ? data.results.map((ticket: TicketBase) => {
                        return getTicket(ticket)
                    }) : <div className='w-full mt-5 text-center subtitle3-small'>{t('contacts.contact_details.no_tickets')}</div>
                )
        }
    </Fragment>
}

export default ContactTickets;
