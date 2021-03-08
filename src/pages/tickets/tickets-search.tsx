import { ReactComponent as EditIcon } from '../../shared/icons/Icon-Create-White-24px.svg';
import { ReactComponent as SearchIcon } from '../../shared/icons/Icon-Search-16px.svg';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { keyboardKeys } from '../../shared/components/search-bar/constants/keyboard-keys';
import { useDispatch, useSelector } from 'react-redux';
import { getList } from './services/tickets.service';
import { selectTicketsPaging } from './store/tickets.selectors';
import { ReactComponent as FilterIcon } from '../../shared/icons/Icon-Filter-24px.svg';
import { toggleTicketListFilter } from './store/tickets.slice';
import {Paging} from '../../shared/models/paging.model';
import {TicketQuery} from './models/ticket-query';

const TicketsSearch = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const paging: Paging = useSelector(selectTicketsPaging);

    const [searchTerm, setSearchTerm] = useState('');

    const searchList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === keyboardKeys.enter) {
            const query : TicketQuery = {
                ...paging,
                searchTerm: searchTerm
            }
            dispatch(getList(query));
        }
    };

    return <div className='flex flex-row border-b'>
        <div className='pr-6 flex pl-5 pt-2 border-r flex-row'>
            <FilterIcon onClick={() => dispatch(toggleTicketListFilter())} className='cursor-pointer mr-4 rounded-md h-10 w-12 p-1' />
            <EditIcon className='cursor-pointer bg-gray-800 rounded-md h-10 w-12 p-1' onClick={() => history.push('my_tickets/new')} />
        </div>
        <div className='relative px-8 py-4 ml-4 w-full'>
            <span className='absolute inset-y-0 left-0 flex items-center pr-4 cursor-pointer'>
                <SearchIcon />
            </span>
            <input type='text pl-4' className='focus:outline-none w-full' placeholder={t('tickets.search')}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => searchList(e)}
                value={searchTerm} />

        </div>
    </div>
};

export default TicketsSearch;
