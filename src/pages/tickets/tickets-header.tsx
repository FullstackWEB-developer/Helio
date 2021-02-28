import { ReactComponent as ArrowDownIcon } from '../../shared/icons/Icon-Arrow-down-16px.svg';
import { ReactComponent as ArrowLeftIcon } from '../../shared/icons/Icon-Arrows-Left-24px.svg';
import { ReactComponent as ArrowRightIcon } from '../../shared/icons/Icon-Arrows-Right-24px.svg';
import React, { useEffect, useState } from 'react';
import { Paging } from './store/tickets.initial-state';
import { getList } from './services/tickets.service';
import { useDispatch, useSelector } from 'react-redux';
import { selectTicketsPaging } from './store/tickets.selectors';
import { useTranslation } from 'react-i18next';
import { keyboardKeys } from '../../shared/components/search-bar/constants/keyboard-keys';

const TicketsHeader = () => {
    const { t } = useTranslation();
    const paging: Paging = useSelector(selectTicketsPaging);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(paging.page.toString());

    const numOfItemsTo = paging.pageSize * paging.page > paging.totalCount ? paging.totalCount : paging.pageSize * paging.page;
    const numOfItemsFrom = numOfItemsTo > (paging.pageSize - 1) ? (paging.pageSize - 1) : 0;

    useEffect(() => {
        setCurrentPage(paging.page.toString());
    }, [paging.page]);

    const nextPage = () => {
        if (paging.page < paging.totalPages) {
            const nextPaging: Paging = {
                ...paging,
                page: paging.page + 1
            };

            dispatch(getList(nextPaging))
        }
    };

    const previousPage = () => {
        if (paging.page > 0) {
            const previousPaging: Paging = {
                ...paging,
                page: paging.page - 1
            };
            dispatch(getList(previousPaging))
        }
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === keyboardKeys.enter) {
            const newPaging: Paging = {
                ...paging,
                page: parseInt(currentPage, 10)
            };
            dispatch(getList(newPaging));
        }
    };

    const changePage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(e.target.value);
    };

    return <div className='grid grid-cols-4 border-b p-6'>
        <div className='grid justify-items-start'>
            <div className='text-3xl font-bold relative'>
                {t('tickets.all_tickets')} - {paging.totalCount}
                <span className='absolute pt-2 pl-5'> <ArrowDownIcon className='cursor-pointer' /></span>
            </div>
        </div>
        <div className='grid col-start-4 col-end-4 justify-items-end'>
            <div className='flex flex-row'>
                <div className='text-gray-400 pr-8 pt-2 text-sm'>
                    <span>{t('tickets.pagination', { numOfItemsFrom: numOfItemsFrom, numOfItemsTo: numOfItemsTo, totalCount: paging.totalCount })}</span>
                </div>
                <ArrowLeftIcon className='cursor-pointer mt-1' onClick={() => previousPage()} />
                <input type='text' className='border rounded-md w-11 text-center ml-6 mr-6' value={currentPage}
                    onChange={(e) => changePage(e)} onKeyDown={(e) => handleKey(e)}></input>
                <ArrowRightIcon className='cursor-pointer mt-1' onClick={() => nextPage()} />
            </div>
        </div>
    </div>
};

export default TicketsHeader;
