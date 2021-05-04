import React from 'react';
import {Ticket} from '../models/ticket';
import {SortDirection} from '../models/sort-direction';
import TicketListItem from './ticket-list-item';
import {useDispatch, useSelector} from 'react-redux';
import {selectTicketFilter} from '../store/tickets.selectors';
import {TicketQuery} from '../models/ticket-query';
import {getList} from '../services/tickets.service';
import TicketListHeaderCell, {getSortDirection, getSortOrder, updateSort} from './ticket-list-header-cell';
import {useTranslation} from 'react-i18next';

export interface TicketListContainerProps {
    dataSource: Ticket[]
}
const TicketListContainer = ({dataSource}: TicketListContainerProps) => {
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const applySort = (field: string | undefined, direction: SortDirection) => {
        if (!field) {
            return;
        }

        const sorts = updateSort([...ticketFilter.sorts || []], field, direction);
        const query = {...ticketFilter, sorts: [...sorts]};
        dispatch(getList(query));
    }

    return (
        <div className="">
            <div className='grid grid-flow-col auto-cols-min bg-gray-100 px-7 py-4 h-12 items-center body2-medium content-center'>
                <TicketListHeaderCell className='w-20'>{t('tickets.channel')}</TicketListHeaderCell>
                <TicketListHeaderCell
                    className='w-20'
                    field={'Id'}
                    isSortable
                    sortDirection={getSortDirection(ticketFilter.sorts, 'Id')}
                    sortOrder={getSortOrder(ticketFilter.sorts, 'Id')}
                    onClick={applySort}
                >
                    {t('tickets.id')}
                </TicketListHeaderCell>
                <TicketListHeaderCell className='w-60'>{t('tickets.subject')}</TicketListHeaderCell>
                <TicketListHeaderCell
                    className='w-36'
                    field={'DueDate'}
                    isSortable
                    sortDirection={getSortDirection(ticketFilter.sorts, 'DueDate')}
                    sortOrder={getSortOrder(ticketFilter.sorts, 'DueDate')}
                    onClick={applySort}
                >
                    {t('tickets.due_in')}
                </TicketListHeaderCell>
                <TicketListHeaderCell
                    className='w-40'
                    field={'Status'}
                    isSortable
                    sortDirection={getSortDirection(ticketFilter.sorts, 'Status')}
                    sortOrder={getSortOrder(ticketFilter.sorts, 'Status')}
                    onClick={applySort}
                >
                    {t('tickets.status')}
                </TicketListHeaderCell>
                <TicketListHeaderCell className='w-28'>{t('tickets.priority_label')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-36'>{t('tickets.type')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-44'>{t('tickets.reason')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-60'>{t('tickets.assigned_to')}</TicketListHeaderCell>
            </div>
            { dataSource.map(item => <TicketListItem key={item.id} item={item} />)}
        </div>
    )
}

export default TicketListContainer;
