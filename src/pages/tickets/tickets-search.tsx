import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import {useDispatch, useSelector} from 'react-redux';
import {exportTickets, getList} from './services/tickets.service';
import {selectIsTicketsFiltered, selectTicketFilter, selectTicketsPaging} from './store/tickets.selectors';
import {selectUserOptions} from '@shared/store/lookups/lookups.selectors';
import {setTicketsFiltered, toggleTicketListFilter} from './store/tickets.slice';
import {Paging} from '@shared/models/paging.model';
import {TicketQuery} from './models/ticket-query';
import {TicketsPath} from '@app/paths';
import './tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {useForm} from 'react-hook-form';
import {Icon} from '@components/svg-icon/icon';
import SearchInputField from '@components/search-input-field/search-input-field';
import Modal from '@components/modal/modal';
import * as queryString from 'querystring';
import FilterDot from '@components/filter-dot/filter-dot';
import Button from '@components/button/button';
import ControlledSelect from '@components/controllers/controlled-select';
import './ticket-search.scss'
import {useQuery} from 'react-query';
import {ExportTicketList} from '@constants/react-query-constants';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {Option} from '@components/option/option';
export interface TicketSearchProps {
    selectedTickets: string[],
    isAssignModalOpen: boolean,
    setAssignModalOpen: (value: boolean) => void,
    isAssigneeChangeInProgress: boolean;
    handleOnSubmit: (a: any) => void
}

const TicketsSearch = ({selectedTickets, isAssignModalOpen, setAssignModalOpen, handleOnSubmit, isAssigneeChangeInProgress = false}: TicketSearchProps) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation();
    const ticketFilter: TicketQuery = useSelector(selectTicketFilter);
    const userList = useSelector(selectUserOptions);
    const paging: Paging = useSelector(selectTicketsPaging);
    const isFiltered = useSelector(selectIsTicketsFiltered);
    const [searchTerm, setSearchTerm] = useState('');

    const {control, handleSubmit, formState} = useForm({mode: 'all'});
    const {isValid} = formState;

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

    const handleMultipleAssignAction = (formData: any) => {
        handleOnSubmit(
            {
                ...formData,
                ticketIdList: selectedTickets
            }
        )
        
        setAssignModalOpen(false);

    }
    const search = () => {
        const query: TicketQuery = {
            ...ticketFilter,
            ...paging,
            searchTerm: ''
        }
        dispatch(getList(query, true));
    }

    const getUserOptions = (): Option[] => {
        const cloned = [...userList];
        return cloned;
    }

    const {isLoading: isExportingTicketList, isFetching: isFetchingExportingTicketList, refetch: exportList} = useQuery([ExportTicketList, ticketFilter], () => exportTickets(), {
        enabled: false,
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'tickets.export_failed'
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
                <Button disabled={isExportingTicketList || isFetchingExportingTicketList} label='tickets.new' buttonType='small' onClick={() => history.push(`${TicketsPath}/new`)} icon={Icon.Add} />
                <Button disabled={isExportingTicketList || isFetchingExportingTicketList || !selectedTickets.length} label='tickets.assign' buttonType='small' onClick={() => setAssignModalOpen(true)} />
                <Button isLoading={isExportingTicketList || isFetchingExportingTicketList} label='tickets.export' buttonType='small' onClick={() => exportList()} icon={Icon.Download} />
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
        <Modal
            isDraggable={true}
            className='w-1/4 h-1/2'
            isOpen={isAssignModalOpen}
            title={"tickets.assign_tickets"}
            onClose={() => {setAssignModalOpen(false)}}
            isClosable={true}
            closeableOnEscapeKeyPress={true}
            hasOverlay={true}
            titleClassName="px-6 pb-2 pt-9 h7"
            contentClassName='px-6 h-3/4'>
            <form className='flex flex-col h-full' onSubmit={handleSubmit(handleMultipleAssignAction)}>
                <span className='body2 pt-6 pb-4'>{t('tickets.assign_tickets_modal_text')} </span>
                <div className='w-3/4'>
                    <ControlledSelect
                        name='assignee'
                        label='tickets.agent'
                        required={true}
                        options={getUserOptions()}
                        control={control}
                    />
                </div>
                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        buttonType='small'
                        disabled={!isValid}
                        isLoading={isAssigneeChangeInProgress}
                        label='tickets.assign'
                    />
                    <Button label='common.cancel' className='mx-6' buttonType='secondary'
                        onClick={() => setAssignModalOpen(false)} />
                </div>
            </form>
        </Modal>
    </div>
};

export default TicketsSearch;
