import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { keyboardKeys } from '@components/search-bar/constants/keyboard-keys';
import { useDispatch, useSelector } from 'react-redux';
import { getList } from './services/tickets.service';
import { selectTicketFilter, selectTicketsPaging } from './store/tickets.selectors';
import { toggleTicketListFilter } from './store/tickets.slice';
import { Paging } from '@shared/models/paging.model';
import { TicketQuery } from './models/ticket-query';
import { TicketsPath } from '../../app/paths';
import './tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';

const TicketsSearch = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const paging: Paging = useSelector(selectTicketsPaging);

    const [searchTerm, setSearchTerm] = useState('');

    const searchList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === keyboardKeys.enter) {
            const query: TicketQuery = {
                ...ticketFilter,
                ...paging,
                searchTerm: searchTerm
            }
            dispatch(getList(query, true));
        }
    };

    return <div className='flex flex-row border-b h-14'>
        <div className='pr-6 flex pl-5 pt-2 border-r flex-row'>
            <SvgIcon type={Icon.Filter} onClick={() => dispatch(toggleTicketListFilter())}
                     className='icon-large cursor-pointer rounded-md h-8 w-10 p-1'
                     fillClass='filter-icon'/>
            <span className='cursor-pointer bg-gray-800 rounded-md h-8 w-10 flex content-center justify-center pt-0.5'>
                <SvgIcon type={Icon.Edit} onClick={() => history.push(`${TicketsPath}/new`)}
                         className='icon-medium-18'
                         fillClass='icon-white'/>
            </span>
        </div>        
        <SearchInputField
            wrapperClassNames='relative w-full h-full'
            inputClassNames='border-b-0'
            onChange={(value: string) => { setSearchTerm(value) }}
            value={searchTerm}
            onKeyDown={(e)=>{ searchList(e)}}
        />
    </div>
};

export default TicketsSearch;
