import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import {useDispatch, useSelector} from 'react-redux';
import {getList} from './services/tickets.service';
import {selectTicketFilter, selectTicketsPaging} from './store/tickets.selectors';
import {toggleTicketListFilter} from './store/tickets.slice';
import {Paging} from '@shared/models/paging.model';
import {TicketQuery} from './models/ticket-query';
import {TicketsPath} from '@app/paths';
import './tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import * as queryString from 'querystring';

const TicketsSearch = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const paging: Paging = useSelector(selectTicketsPaging);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let queries = queryString.parse(history.location.search);
        if (queries.searchTerm) {
            setSearchTerm(queries.searchTerm.toString());
        }
    }, [history.location.search]);

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

    const search = () => {
        const query: TicketQuery = {
            ...ticketFilter,
            ...paging,
            searchTerm: ''
        }
        dispatch(getList(query, true));
    }

    return <div className='flex flex-row border-b h-14'>
        <div className='pr-6 pl-5 border-r flex flex-row items-center'>
            <SvgIcon type={Icon.FilterList} onClick={() => dispatch(toggleTicketListFilter())}
                className='icon-medium'
                wrapperClassName='mr-6 cursor-pointer icon-medium'
                fillClass='filter-icon' />
            <SvgIcon type={Icon.Add} onClick={() => history.push(`${TicketsPath}/new`)}
                className='icon-medium'
                wrapperClassName='cursor-pointer icon-medium'
                fillClass='add-icon' />
        </div>
        <SearchInputField
            wrapperClassNames='relative w-full h-full'
            inputClassNames='border-b-0'
            hasBorderBottom={false}
            onChange={(value: string) => {setSearchTerm(value)}}
            onClear={search}
            value={searchTerm}
            onKeyDown={(e) => {searchList(e)}}
        />
    </div>
};

export default TicketsSearch;
