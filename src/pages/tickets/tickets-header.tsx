import React, { useEffect, useState } from 'react';
import { getList } from './services/tickets.service';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchTerm, selectTicketFilter, selectTicketsPaging } from './store/tickets.selectors';
import { useTranslation } from 'react-i18next';
import { keyboardKeys } from '@components/search-bar/constants/keyboard-keys';
import { Paging } from '@shared/models/paging.model';
import { TicketQuery } from './models/ticket-query';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';

const TicketsHeader = () => {
    const { t } = useTranslation();
    const paging: Paging = useSelector(selectTicketsPaging);
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const searchTerm: string = useSelector(selectSearchTerm);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(paging.page.toString());

    const numOfItemsTo = ((paging.pageSize * paging.page) > paging.totalCount) ? paging.totalCount : (paging.pageSize * paging.page);
    let numOfItemsFrom = numOfItemsTo > (paging.pageSize * (paging.page - 1)) ? (paging.pageSize * (paging.page - 1)) : 1;
    if (numOfItemsFrom < 1 ) {
        numOfItemsFrom = 1;
    }

    useEffect(() => {
        setCurrentPage(paging.page.toString());
    }, [paging.page]);

    const nextPage = () => {
        if (paging.page < paging.totalPages) {
            const nextPaging: Paging = {
                ...paging,
                page: paging.page + 1
            };
            fetchTickets(nextPaging);
        }
    };

    const previousPage = () => {
        if (paging.page > 1) {
            const previousPaging: Paging = {
                ...paging,
                page: paging.page - 1
            };
            fetchTickets(previousPaging);
        }
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === keyboardKeys.enter) {
            if (!currentPage) {
                return;
            }
            const newPaging: Paging = {
                ...paging,
                page: parseInt(currentPage)
            };
            fetchTickets(newPaging);
        }
    };

    const fetchTickets = (newPaging: Paging) => {
        const query : TicketQuery = {
            ...ticketFilter,
            ...newPaging
        }
        if (searchTerm) {
            query.searchTerm = searchTerm;
        }
        dispatch(getList(query));
    }

    const changePage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = e.target.value;
        if (parseInt(page) < 1 || parseInt(page) > paging.totalPages) {
            return;
        }
        setCurrentPage(page);
    };

    return <div className='grid grid-cols-4 border-b p-6'>
        <div className='grid justify-items-start'>
            <div className='text-3xl font-bold relative'>
                {t('tickets.all_tickets')} - {paging.totalCount}
                <span className='absolute pt-2 pl-4'>
                    <SvgIcon type={Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon'/>
                </span>
            </div>
        </div>
        <div className='grid col-start-4 col-end-4 justify-items-end'>
            <div className='flex flex-row'>
                <div className='text-gray-400 pr-8 pt-2 text-sm'>
                    <span>{t('tickets.pagination', { numOfItemsFrom: numOfItemsFrom, numOfItemsTo: numOfItemsTo, totalCount: paging.totalCount })}</span>
                </div>
                <SvgIcon type={Icon.ArrowLeft} className='cursor-pointer mt-1' fillClass='active-item-icon' onClick={() => previousPage()}/>
                <input type='text' className='border rounded-md w-11 text-center ml-6 mr-6' value={currentPage}
                    onChange={(e) => changePage(e)} onKeyDown={(e) => handleKey(e)}/>
                <SvgIcon type={Icon.ArrowRight} className='cursor-pointer mt-1' fillClass='active-item-icon' onClick={() => nextPage()}/>
            </div>
        </div>
    </div>
};

export default TicketsHeader;
