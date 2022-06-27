import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import {useDispatch, useSelector} from 'react-redux';
import {exportTickets, getList} from './services/tickets.service';
import {selectIsTicketsFiltered, selectTicketFilter, selectTicketsPaging} from './store/tickets.selectors';
import {setTicketsFiltered, toggleTicketListFilter} from './store/tickets.slice';
import {Paging} from '@shared/models/paging.model';
import {TicketQuery} from './models/ticket-query';
import {TicketsPath} from '@app/paths';
import './tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import * as queryString from 'querystring';
import FilterDot from '@components/filter-dot/filter-dot';
import Button from '@components/button/button';
import './ticket-search.scss'
import {useQuery} from 'react-query';
import {ExportTicketList} from '@constants/react-query-constants';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

const TicketsSearch = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const paging: Paging = useSelector(selectTicketsPaging);
    const isFiltered = useSelector(selectIsTicketsFiltered);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        let queries = queryString.parse(history.location.search);
        if (queries.searchTerm) {
            setSearchTerm(queries.searchTerm.toString());
        }
    }, [history.location.search]);

    useEffect(() => {
        return () => {
            dispatch(setTicketsFiltered(false));
        }
    }, [dispatch]);

    const searchList = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === keyboardKeys.enter) {
            const query: TicketQuery = {
                ...ticketFilter,
                ...paging,
                searchTerm: searchTerm?.trim()
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

     const {isLoading: isExportingTicketList, isFetching: isFetchingExportingTicketList, refetch: exportList} = useQuery([ExportTicketList, ticketFilter], () => exportTickets(), {
         enabled:false,
         onError: () => {
             dispatch(addSnackbarMessage({
                 type: SnackbarType.Error,
                 message:'tickets.export_failed'
             }));
         }
     })

    return <div className='flex flex-row border-b ticket-search-bar box-content'>
        <div className='pr-6 pl-5 border-r flex flex-row items-center'>
            <div className='relative'>
                <SvgIcon type={Icon.FilterList} onClick={() => dispatch(toggleTicketListFilter())}
                className='icon-medium'
                wrapperClassName='mr-6 cursor-pointer icon-medium'
                fillClass='filter-icon' />
                {isFiltered && <div className='absolute bottom-1 right-6'>
                    <FilterDot />
                </div>}
            </div>
            <div className='flex flex-row space-x-4'>
                <Button disabled= {isExportingTicketList || isFetchingExportingTicketList} label='tickets.new' buttonType='small' onClick={() => history.push(`${TicketsPath}/new`)} icon={Icon.Add}/>
                <Button isLoading={isExportingTicketList || isFetchingExportingTicketList} label='tickets.export' buttonType='small' onClick={() => exportList()} icon={Icon.Download}/>
            </div>
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
