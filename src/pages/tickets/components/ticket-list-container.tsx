import React from 'react';
import {Ticket} from '../models/ticket';
import {SortDirection} from '@shared/models/sort-direction';
import TicketListItem from './ticket-list-item';
import {useDispatch, useSelector} from 'react-redux';
import {selectTicketFilter} from '../store/tickets.selectors';
import {TicketQuery} from '../models/ticket-query';
import {getList} from '../services/tickets.service';
import TicketListHeaderCell from './ticket-list-header-cell';
import {getSortDirection, getSortOrder, updateSort} from '@shared/utils/sort-utils';
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
            <div className='flex flex-row items-center content-center w-full h-12 py-4 bg-gray-100 auto-cols-min px-7 body2-medium'>
                <TicketListHeaderCell className='w-24'>{t('tickets.channel')}</TicketListHeaderCell>
                <TicketListHeaderCell
                    className='w-1/12 flex justify-center'
                    field={'Id'}
                    isSortable
                    sortDirection={getSortDirection(ticketFilter.sorts, 'Id')}
                    sortOrder={getSortOrder(ticketFilter.sorts, 'Id')}
                    onClick={applySort}
                >
                    {t('tickets.id')}
                </TicketListHeaderCell>
                <TicketListHeaderCell className='w-2/12'><div className='ml-2'>{t('tickets.subject')}</div></TicketListHeaderCell>
                <TicketListHeaderCell
                    className='w-1/12'
                    field={'DueDate'}
                    isSortable
                    sortDirection={getSortDirection(ticketFilter.sorts, 'DueDate')}
                    sortOrder={getSortOrder(ticketFilter.sorts, 'DueDate')}
                    onClick={applySort}
                >
                    {t('tickets.due_in')}
                </TicketListHeaderCell>
                <TicketListHeaderCell
                    className='w-2/12'
                    field={'CreatedOn'}
                    isSortable
                    sortDirection={getSortDirection(ticketFilter.sorts, 'CreatedOn')}
                    sortOrder={getSortOrder(ticketFilter.sorts, 'CreatedOn')}
                    onClick={applySort}
                >
                    {t('tickets.created_on')}
                </TicketListHeaderCell>
                <TicketListHeaderCell
                    className='w-2/12'
                    field={'Status'}
                    isSortable
                    sortDirection={getSortDirection(ticketFilter.sorts, 'Status')}
                    sortOrder={getSortOrder(ticketFilter.sorts, 'Status')}
                    onClick={applySort}
                >
                    {t('tickets.status')}
                </TicketListHeaderCell>
                <TicketListHeaderCell className='w-2/12'>{t('tickets.priority_label')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-2/12'>{t('tickets.type')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-2/12'>{t('tickets.reason')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-3/12'>{t('tickets.assigned_to')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-1/12 flex justify-center'>{t('tickets.rating')}</TicketListHeaderCell>
                <TicketListHeaderCell className='w-1/12'/>
            </div>
            { dataSource.map(item => <TicketListItem key={item.id} item={item} />)}
        </div>
    )
}

export default TicketListContainer;
