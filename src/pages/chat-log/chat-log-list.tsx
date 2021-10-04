import {useEffect, useState} from 'react';
import DropdownLabel from '@components/dropdown-label';
import {DropdownItemModel} from '@components/dropdown';
import Pagination from '@components/pagination';
import SearchInputField from '@components/search-input-field/search-input-field';
import SvgIcon, {Icon} from '@components/svg-icon';
import Table from '@components/table/table';
import {useQuery} from 'react-query';
import {ChatLogQueryType} from './models/chat-log-query';
import {useDispatch, useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {useHistory} from 'react-router';
import {TicketLogModel, TicketLogRequestModel} from '@shared/models/ticket-log.model';
import {DEFAULT_PAGING} from '@shared/constants/table-constants';
import {GetCallLogs, QueryGetPatientById, QueryTickets} from '@constants/react-query-constants';
import {getChatsLog} from './services/chats-log.services';
import Spinner from '@components/spinner/Spinner';
import {DATE_FORMAT, TIME_FORMAT} from '@constants/form-constants';
import dayjs from 'dayjs';
import utils from '@shared/utils/utils';
import {useTranslation} from 'react-i18next';
import './chat-log-list.scss';
import CallContactAgentInfo from '@pages/calls-log/components/call-contact-info/call-contact-agent-info';
import Modal from '@components/modal/modal';
import ChatTranscript from '@pages/tickets/components/ticket-detail/chat-transcript';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {getTicketByNumber} from '@pages/tickets/services/tickets.service';
import {Ticket} from '@pages/tickets/models/ticket';
import {ContactsPath, PatientsPath, TicketsPath} from '@app/paths';
import MoreMenu from '@components/more-menu';
import CallsLogFilter from '@pages/calls-log/components/call-log-filter/call-log-filter';
import {getSortDirection, getSortOrder, updateSort} from '@shared/utils/sort-utils';
import {SortDirection} from '@shared/models/sort-direction';
import FilterDot from '@components/filter-dot/filter-dot';
import {selectIsChatLogFiltered} from '@pages/chat-log/store/chat-log.selectors';
import {setIsChatLogFiltered} from '@pages/chat-log/store/chat-log.slice';

const ChatsLogList = () => {
    const {t} = useTranslation();
    const appUser = useSelector(selectAppUserDetails);
    const history = useHistory();
    const [pagingResult, setPagingResult] = useState({...DEFAULT_PAGING});
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isChatTranscriptOpen, setChatTranscriptOpen] = useState(false);
    const [ticketNumber, setTicketNumber] = useState<string>();
    const isFiltered = useSelector(selectIsChatLogFiltered);
    const [rows, setRows] = useState<TicketLogModel[]>([]);
    const dispatch = useDispatch();
    const dropdownItem: DropdownItemModel[] = [
        {label: 'ticket_log.my_chat_log', value: ChatLogQueryType.MyChatLog},
        {label: 'ticket_log.team_chat_log', value: ChatLogQueryType.TeamChatLog}
    ];
    const [chatsLogFilter, setChatsLogFilter] = useState<TicketLogRequestModel>({
        ...DEFAULT_PAGING,
        assignedTo: appUser.id,
        sorts:['createdOn Desc']
    });

    useEffect(() => {
        return () => {
            dispatch(setIsChatLogFiltered(false));
        }
    }, [dispatch]);

    const navigateToTicketDetail = (ticketNumber: string) => {
        history.push(`${TicketsPath}/${ticketNumber}`);
    }

    const navigateToContactDetail = (contactId: string) => {
        history.push(`${ContactsPath}/${contactId}`);
    }

    const navigateToPatientDetail = (patientId: string) => {
        history.push(`${PatientsPath}/${patientId}`);
    }

    const applySort = (field: string | undefined, direction: SortDirection) => {
        if (!field) {
            return;
        }

        const sorts = updateSort([...chatsLogFilter.sorts || []], field, direction);
        const query = {...chatsLogFilter, sorts: [...sorts]};
        setChatsLogFilter(query);
    }

    const getMoreMenuOption = (data: TicketLogModel) => {
        const options: DropdownItemModel[] = [
            {
                label: 'ticket_log.ticket_details',
                value: '2',
                icon: <SvgIcon type={Icon.Tickets} fillClass='rgba-05-fill' />
            }
        ];

        if (data.contactId) {
            options.push({
                label: 'ticket_log.contact_details',
                value: '3',
                icon: <SvgIcon type={Icon.Contacts} fillClass='rgba-05-fill' />
            });
        }

        if (data.patientId) {
            options.push({
                label: 'ticket_log.patient_details',
                value: '4',
                icon: <SvgIcon type={Icon.Contacts} fillClass='rgba-05-fill' />
            });
        }

        return options;
    }

    const onDropdownClick = (item: DropdownItemModel) => {
        const context = item.value as ChatLogQueryType;
        if (context === ChatLogQueryType.MyChatLog) {
            setChatsLogFilter({...chatsLogFilter, assignedTo: appUser.id});
        } else {
            setChatsLogFilter({...chatsLogFilter, assignedTo: ''});
        }
    }

    const {
        isLoading: isTicketLoading,
        isFetching: isTicketFetching,
        data: ticket
    } = useQuery<Ticket, Error>([QueryTickets, ticketNumber], () =>
        getTicketByNumber(Number(ticketNumber)),
        {
            enabled: !!ticketNumber,
        }
    );

    const {
        isLoading: isPatientLoading,
        isFetching: isPatientFetching,
        data: patient
    } = useQuery<ExtendedPatient, Error>([QueryGetPatientById, ticket?.patientId], () =>
        getPatientByIdWithQuery(ticket?.patientId as number),
        {
            enabled: !!ticket
        }
    );

    let mainTableModel = {
        columns: [
            {
                title: 'ticket_log.from',
                field: 'from',
                widthClass: 'w-2/12',
                render: (_ : string, data: TicketLogModel) => (
                    <span className='body2'>
                        {data.createdForName}
                    </span>
                )
            },
            {
                title: 'ticket_log.to',
                field: 'assigneeUser',
                widthClass: 'w-2/12',
                render: (assigneeUser: string) => (
                    <CallContactAgentInfo
                        type='CHAT'
                        agentId={assigneeUser}
                    />
                )
            },
            {
                title: 'ticket_log.date_and_time',
                field: 'createdOn',
                widthClass: 'w-2/12',
                isSortable: true,
                sortDirection: getSortDirection(chatsLogFilter.sorts, 'createdOn'),
                disableNoneSort: true,
                sortOrder: getSortOrder(chatsLogFilter.sorts, 'createdOn'),
                onClick: (field: string | undefined, direction: SortDirection) => {
                    applySort(field, direction);
                },
                render: (value: string) => {
                    const dateValue = dayjs.utc(value).local();
                    return (
                        <span className='body3-small'>
                            <span className='mr-5'>{dateValue.format(DATE_FORMAT)}</span>
                            <span>{dateValue.format(TIME_FORMAT)}</span>
                        </span>
                    );
                }
            },
            {
                title: 'ticket_log.duration',
                field: 'agentInteractionDuration',
                widthClass: 'w-1/12',
                render: (_: number, data: TicketLogModel) => {
                    return (
                        <span className='body2'>{utils.getTimeDiffInFormattedSeconds(data.contactDisconnectTimestamp, data.contactInitiationTimestamp)}</span>
                    )
                }
            },
            {
                title: 'ticket_log.status',
                field: 'contactStatus',
                widthClass: 'w-1/12',
                render: (_: string, data: TicketLogModel) => {
                    return (
                        <span className='body2'>
                            {data.agentInteractionDuration && data.agentInteractionDuration > 0 &&
                                t('ticket_log.answered')
                            }
                        </span>
                    );
                }
            },
            {
                title: 'ticket_log.transcript',
                field: 'recordedConversationLink',
                widthClass: 'w-24 flex items-center justify-center',
                render: (value: string, data: TicketLogModel) => (
                    <>
                        {!!value &&
                            <SvgIcon
                                type={Icon.View}
                                fillClass='rgba-05-fill'
                                onClick={() => {
                                    setTicketNumber(data.ticketNumber);
                                    setChatTranscriptOpen(true);
                                }}
                            />
                        }
                    </>
                )
            },
            {
                title: 'ticket_log.rating',
                field: 'ratingScore',
                widthClass: 'w-24 flex items-center justify-center',
                render: (value?: number) => (
                    <>
                        {value === undefined &&
                            null
                        }
                        {value === -1 &&
                            <SvgIcon type={Icon.RatingDissatisfied}
                                fillClass='danger-icon'
                            />
                        }
                        {value === 0 &&
                            <SvgIcon type={Icon.RatingSatisfied}
                                fillClass='warning-icon'
                            />
                        }
                        {value === 1 &&
                            <SvgIcon type={Icon.RatingVerySatisfied}
                                fillClass='success-icon'
                            />
                        }
                    </>
                )
            },
            {
                title: '',
                field: '',
                widthClass: 'w-48 h-full items-center justify-center',
                render: (_ : any, data: TicketLogModel) => {
                    return (<>
                        <MoreMenu
                            items={getMoreMenuOption(data)}
                            iconClassName='default-toolbar-icon'
                            iconFillClassname='cursor-pointer icon-medium'
                            menuClassName='more-menu-list'
                            containerClassName='h-full flex items-center justify-center more-menu'
                            onClick={(item: DropdownItemModel) => {
                                switch (item.value) {
                                    case '2':
                                        navigateToTicketDetail(data.ticketNumber);
                                        break;
                                    case '3':
                                        if (!data.contactId) {
                                            break;
                                        }
                                        navigateToContactDetail(data.contactId);
                                        break;
                                    case '4':
                                        if (!data.patientId) {
                                            break;
                                        }
                                        navigateToPatientDetail(data.patientId)
                                        break;
                                }
                            }}
                        />
                    </>)
                }
            }
        ],
        rows,
        hasRowsBottomBorder: true,
        headerClassName: 'h-12 px-7',
        rowClass: 'h-20 items-center hover:bg-gray-100 cursor-pointer chat-log-row px-7',
    };


    const {isLoading, isFetching} = useQuery([GetCallLogs, chatsLogFilter], () => getChatsLog(chatsLogFilter), {
        enabled: true,
        onSuccess: (response) => {
            const {results, ...paging} = response;
            setPagingResult({...paging});
            setRows(response.results);
        }
    });

    const onFilterSubmit = (filter: TicketLogRequestModel) => {
        const {page, pageSize, searchTerm, ...filterParameters} = filter;
        setChatsLogFilter({...chatsLogFilter, ...filterParameters, ...DEFAULT_PAGING});
    }

    return (
        <div className='flex flex-row flex-auto chats-log'>
            <CallsLogFilter isOpen={isFilterOpen} isCallTypeHide logType='Chat' onSubmit={onFilterSubmit} />
            <div className='flex flex-col flex-1 w-full'>
                <div className='flex flex-row items-center justify-between w-full px-6 border-b chats-log-header'>
                    <div>
                        <DropdownLabel
                            items={dropdownItem}
                            value={ChatLogQueryType.MyChatLog}
                            onClick={onDropdownClick}
                        />
                    </div>
                    <div>
                        <Pagination
                            value={pagingResult}
                            onChange={(p) => {
                                setChatsLogFilter({...chatsLogFilter, page: p.page, pageSize: p.pageSize});
                            }}
                        />
                    </div>
                </div>
                <div className='flex flex-row border-b h-14'>
                    <div className='flex flex-row items-center pl-6 border-r relative'>
                        <SvgIcon
                            type={Icon.FilterList}
                            className='icon-medium'
                            wrapperClassName='mr-6 cursor-pointer icon-medium'
                            fillClass='filter-icon'
                            onClick={() => setFilterOpen(!isFilterOpen)}
                        />
                        {isFiltered && <div className='absolute bottom-3.5 right-6'>
                            <FilterDot />
                        </div>}
                    </div>
                    <SearchInputField
                        wrapperClassNames='relative w-full h-full'
                        inputClassNames='border-b-0'
                        hasBorderBottom={false}
                        placeholder='ticket_log.search_chats_placeholder'
                        onPressEnter={(inputValue) => setChatsLogFilter({...chatsLogFilter, searchTerm: inputValue})}
                    />
                </div>
                <div className='overflow-y-auto'>
                    {(isLoading || isFetching) &&
                        <Spinner fullScreen />
                    }
                    {(!isLoading && !isFetching) &&
                        <Table model={mainTableModel} />
                    }
                </div>
            </div>
            <div className='flex items-center justify-center'>
                <Modal isOpen={isChatTranscriptOpen}
                    title='ticket_detail.chat_transcript.title'
                    isClosable={true}
                    isDraggable={true}
                    onClose={() => setChatTranscriptOpen(false)}>
                    {(isPatientLoading || isPatientFetching || isTicketFetching || isTicketLoading) &&
                        <Spinner />
                    }
                    {(ticket && !isPatientLoading && !isPatientFetching && !isTicketFetching && !isTicketLoading) &&
                        <ChatTranscript ticket={ticket} patient={patient} />
                    }
                </Modal>
            </div>
        </div>
    );
}

export default ChatsLogList;
