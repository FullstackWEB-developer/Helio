import React, {useEffect, useState} from 'react';
import {getList} from './services/tickets.service';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectSearchTerm,
    selectTicketFilter,
    selectTicketQueryType,
    selectTicketsPaging
} from './store/tickets.selectors';
import {useTranslation} from 'react-i18next';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import {Paging} from '@shared/models/paging.model';
import {TicketQuery} from './models/ticket-query';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import Dropdown from '@components/dropdown/dropdown';
import {DropdownModel} from '@components/dropdown/dropdown.models';
import useComponentVisibility from '@shared/hooks/useComponentVisibility';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {TicketListQueryType} from './models/ticket-list-type';
import {setTicketListQueryType} from './store/tickets.slice'
import useCheckPermission from '@shared/hooks/useCheckPermission';

const TicketsHeader = () => {
    const {t} = useTranslation();
    const paging: Paging = useSelector(selectTicketsPaging);
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const ticketListQueryType = useSelector(selectTicketQueryType);
    const searchTerm: string = useSelector(selectSearchTerm);
    const isDefaultTeam = useCheckPermission('Tickets.DefaultToTeamView');
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(paging.page.toString());
    const [currentListQueryType, setCurrentListQueryType] = useState<string>(!isDefaultTeam ? TicketListQueryType.MyTicket.toString(): TicketListQueryType.AllTicket.toString());
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);
    const {id} = useSelector(selectAppUserDetails);

    const ticketListTypeDropdownModel: DropdownModel = {
        defaultValue: ticketListQueryType ?? currentListQueryType,
        items: [
            {label: t('tickets.my_tickets'), value: TicketListQueryType.MyTicket, className: 'text-xl py-1.5'},
            {label: t('tickets.all_tickets'), value: TicketListQueryType.AllTicket, className: 'text-xl py-1.5'}
        ],
        onClick: (value: string) => {
            setCurrentListQueryType(value);

            if (value === TicketListQueryType.AllTicket) {
                dispatch(getList({...ticketFilter, page: 1, assignedTo: []}));
            } else {
                dispatch(getList({ ...ticketFilter, page: 1, assignedTo: [id]}));
            }

            dispatch(setTicketListQueryType(value as TicketListQueryType));
            setIsVisible(false);
        }
    };

    const numOfItemsTo = ((paging.pageSize * paging.page) > paging.totalCount) ? paging.totalCount : (paging.pageSize * paging.page);
    let numOfItemsFrom = numOfItemsTo > (paging.pageSize * (paging.page - 1)) ? (paging.pageSize * (paging.page - 1)) : 1;
    if (numOfItemsFrom < 1) {
        numOfItemsFrom = 1;
    }

    useEffect(() => {
        setCurrentPage(paging.page.toString());
    }, [paging.page]);

    useEffect(() => {
        if (!ticketListQueryType) {
            return;
        }
        setCurrentListQueryType(ticketListQueryType.toString());
    }, [ticketListQueryType]);

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
        const query: TicketQuery = {
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

    const getTicketTitle = (listType: string) => {
        if (listType === TicketListQueryType.AllTicket) {
            return t('tickets.all_tickets');
        }

        return t('tickets.my_tickets');
    }


    return <div className='flex flex-row justify-between p-6 border-b'>
        <div ref={elementRef} className='relative pr-4'>
            <div className='relative flex flex-row items-center text-2xl font-bold cursor-pointer flex-nowrap' onClick={() => setIsVisible(!isVisible)}>
                <span className="select-none whitespace-nowrap">{getTicketTitle(currentListQueryType)} - {paging.totalCount}</span>
                <span className='px-4'>
                    <SvgIcon type={isVisible ? Icon.ArrowUp : Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon' />
                </span>
            </div>
            <div >
                {isVisible &&
                    <div className="absolute z-10 w-full mt-6 top-full right-4">
                        <Dropdown model={ticketListTypeDropdownModel} />
                    </div>
                }
            </div>
        </div>
        <div className='flex flex-row'>
            <div className='pt-2 pr-8 text-sm text-gray-400'>
                <span>{t('tickets.pagination', {numOfItemsFrom: numOfItemsFrom, numOfItemsTo: numOfItemsTo, totalCount: paging.totalCount})}</span>
            </div>
            <SvgIcon type={Icon.ArrowLeft} className='mt-1 cursor-pointer' fillClass='active-item-icon' onClick={() => previousPage()} />
            <input type='text' className='ml-6 mr-6 text-center border rounded-md w-11' value={currentPage}
                onChange={(e) => changePage(e)} onKeyDown={(e) => handleKey(e)} />
            <SvgIcon type={Icon.ArrowRight} className='mt-1 cursor-pointer' fillClass='active-item-icon' onClick={() => nextPage()} />
        </div>
    </div>
};

export default TicketsHeader;
