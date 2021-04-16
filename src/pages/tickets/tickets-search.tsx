import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import {useDispatch, useSelector} from 'react-redux';
import {getList} from './services/tickets.service';
import {selectTicketFilter, selectTicketsPaging} from './store/tickets.selectors';
import {toggleTicketListFilter} from './store/tickets.slice';
import {Paging} from '@shared/models/paging.model';
import {TicketQuery} from './models/ticket-query';
import {TicketsPath} from '../../app/paths';
import './tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

const TicketsSearch = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const paging: Paging = useSelector(selectTicketsPaging);

    const [searchTerm, setSearchTerm] = useState('');

    const searchList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === keyboardKeys.enter) {
            const query : TicketQuery = {
                ...ticketFilter,
                ...paging,
                searchTerm: searchTerm
            }
            dispatch(getList(query, true));
        }
    };

    return <div className='flex flex-row border-b'>
        <div className='pr-6 flex pl-5 pt-2 border-r flex-row'>
            <SvgIcon type={Icon.Filter} onClick={() => dispatch(toggleTicketListFilter())}
                     className='large cursor-pointer rounded-md h-10 w-12 p-1'
                     fillClass='filter-icon'/>
            <SvgIcon type={Icon.Edit} onClick={() => history.push(`${TicketsPath}/new`)}
                     className='large cursor-pointer bg-gray-800 rounded-md h-10 w-12 p-1'
                     fillClass='icon-white'/>
        </div>
        <div className='relative px-8 py-4 ml-4 w-full'>
            <span className='absolute inset-y-0 left-0 flex items-center pr-4 cursor-pointer'>
                <SvgIcon type={Icon.Search} className='small cursor-pointer' fillClass='search-icon'/>
            </span>
            <input type='text pl-4' className='focus:outline-none w-full' placeholder={t('tickets.search')}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => searchList(e)}
                value={searchTerm} />

        </div>
    </div>
};

export default TicketsSearch;
