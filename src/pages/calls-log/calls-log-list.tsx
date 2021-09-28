import {useEffect, useState} from 'react';
import DropdownLabel from '@components/dropdown-label';
import {DropdownItemModel} from '@components/dropdown';
import Pagination from '@components/pagination';
import {CommunicationDirection} from '@shared/models';
import SearchInputField from '@components/search-input-field/search-input-field';
import SvgIcon, {Icon} from '@components/svg-icon';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import {useQuery} from 'react-query';
import {getCallsLog} from './services/call-log.service';
import {TicketLogModel, TicketLogRequestModel, TicketLogContactStatus} from '@shared/models/ticket-log.model';
import {CallLogQueryType} from './models/call-log-query';
import {GetCallLogs} from '@constants/react-query-constants';
import {CallContactInfo} from './components/call-contact-info/call-contact-info';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {DATE_FORMAT, TIME_FORMAT} from '@constants/form-constants';
import {useTranslation} from 'react-i18next';
import MoreMenu from '@components/more-menu';
import CallsLogFilter from './components/call-log-filter/call-log-filter';
import CallLogPlayer from './components/call-log-player/call-log-player';
import utils from '@shared/utils/utils';
import classnames from 'classnames';
import {DEFAULT_PAGING} from '@shared/constants/table-constants';
import Spinner from '@components/spinner/Spinner';
import {authenticationSelector} from '@shared/store/app-user/appuser.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {showCcp} from '@shared/layout/store/layout.slice';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Logger from '@shared/services/logger';
import {useHistory} from 'react-router';
import {ContactsPath, PatientsPath, TicketsPath} from '@app/paths';
import {SortDirection} from '@shared/models/sort-direction';
import {getSortDirection, getSortOrder, updateSort} from '@shared/utils/sort-utils';
import './calls-log-list.scss';
import FilterDot from '@components/filter-dot/filter-dot';
import {selectIsCallsLogFiltered} from '@pages/calls-log/store/calls-log.selectors';
import {setIsCallsLogFiltered} from '@pages/calls-log/store/calls-log.slice';

dayjs.extend(utc);

const CallsLogList = () => {

    const {t} = useTranslation();
    const auth = useSelector(authenticationSelector);
    const isFiltered = useSelector(selectIsCallsLogFiltered);
    const history = useHistory();

    const dispatch = useDispatch();
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isPlayerOpen, setPlayerOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState<TicketLogModel>();
    const [pagingResult, setPagingResult] = useState({...DEFAULT_PAGING});
    const [callsLogFilter, setCallsLogFilter] = useState<TicketLogRequestModel>({
        ...DEFAULT_PAGING,
        assignedTo: auth.id,
        sorts:['createdOn Desc']
    });
    const logger = Logger.getInstance();

    useEffect(() => {
        return () => {
            dispatch(setIsCallsLogFiltered(false));
        }
    }, [dispatch]);

    const initiateACall = (phoneToDial?: string) => {
        dispatch(showCcp());
        if (window.CCP.agent && phoneToDial) {
            const endpoint = connect.Endpoint.byPhoneNumber(phoneToDial);
            window.CCP.agent.connect(endpoint, {
                failure: (e: any) => {
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: 'contacts.contact_details.error_dialing_phone'
                    }));
                    logger.error(t('contacts.contact_details.error_dialing_phone'), e);
                }
            })
        }
    }

    const navigateToTicketDetail = (ticketNumber: string) => {
        history.push(`${TicketsPath}/${ticketNumber}`);
    }

    const navigateToContactDetail = (contactId: string) => {
        history.push(`${ContactsPath}/${contactId}`);
    }

    const navigateToPatientDetail = (patientId: string) => {
        history.push(`${PatientsPath}/${patientId}`);
    }

    const dropdownItem: DropdownItemModel[] = [
        {label: 'ticket_log.my_call_log', value: CallLogQueryType.MyCallLog},
        {label: 'ticket_log.team_call_log', value: CallLogQueryType.TeamCallLog}
    ];

    const getMoreMenuOption = (data: TicketLogModel) => {
        const options: DropdownItemModel[] = [
            {
                label: 'ticket_log.call',
                value: '1',
                icon: <SvgIcon type={Icon.Phone} fillClass='rgba-05-fill' />
            },
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


    const getDirectionIcon = (direction: CommunicationDirection, contactStatus?: TicketLogContactStatus) => {

        if (contactStatus === undefined || contactStatus === null) {
            return null;
        }

        if (contactStatus === TicketLogContactStatus.Answered) {
            if (direction === CommunicationDirection.Inbound) {
                return <SvgIcon type={Icon.CallInbound} fillClass='rgba-038-fill' />
            } else {
                return <SvgIcon type={Icon.CallOutbound} fillClass='rgba-038-fill' />
            }
        }
        return <SvgIcon type={Icon.CallMissedOutgoing} fillClass='danger-icon ' />
    }

    const applySort = (field: string | undefined, direction: SortDirection) => {
        if (!field) {
            return;
        }

        const sorts = updateSort([...callsLogFilter.sorts || []], field, direction);
        const query = {...callsLogFilter, sorts: [...sorts]};
        setCallsLogFilter(query);
    }

    const getTableModel = (): TableModel => ({
        columns: [
            {
                title: '',
                field: 'id',
                widthClass: 'w-24',
                render: (_, data: TicketLogModel) => getDirectionIcon(data.communicationDirection, data.contactStatus)
            },
            {
                title: 'ticket_log.from',
                field: 'from',
                widthClass: 'w-2/12',
                render: (_, data: TicketLogModel) => (
                    <CallContactInfo type='from' value={data} />
                )
            },
            {
                title: 'ticket_log.to',
                field: 'to',
                widthClass: 'w-2/12',
                render: (_, data: TicketLogModel) => (
                    <CallContactInfo type='to' value={data} />
                )
            },
            {
                title: 'ticket_log.date_and_time',
                field: 'createdOn',
                isSortable: true,
                widthClass: 'w-2/12',
                sortDirection: getSortDirection(callsLogFilter.sorts, 'createdOn'),
                sortOrder: getSortOrder(callsLogFilter.sorts, 'createdOn'),
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
                render: (field: number) => {
                    return (
                        <span className='body2'>{utils.formatTime(field)}</span>
                    )
                }
            },
            {
                title: 'ticket_log.status',
                field: 'contactStatus',
                widthClass: 'w-1/12',
                render: (value?: TicketLogContactStatus) => {
                    if (!value) {
                        return (<></>);
                    }
                    return (
                        <span className={classnames('body2', {'text-danger': value === TicketLogContactStatus.Missed})}>
                            {
                                t(`ticket_log.${TicketLogContactStatus[value]
                                    .toString()
                                    .replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '_' + match : match))
                                    .toLowerCase()}`)
                            }
                        </span>
                    );
                }
            },
            {
                title: 'ticket_log.call_type',
                field: 'communicationDirection',
                widthClass: 'w-1/12',
                render: (value: CommunicationDirection) =>
                    (<span className='body2'>{t(`ticket_log.${CommunicationDirection[value].toString().toLowerCase()}`)}</span>)
            },
            {
                title: 'ticket_log.recording',
                field: 'recordedConversationLink',
                widthClass: 'w-24 flex items-center justify-center',
                render: (value: string, data: TicketLogModel) => (
                    <>
                        {!!value &&
                            <SvgIcon
                                type={Icon.Play}
                                fillClass='rgba-05-fill'
                                onClick={() => {
                                    setRowSelected(data);
                                    setPlayerOpen(true);
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
                widthClass: 'w-8 h-full items-center justify-center',
                render: (_, data: TicketLogModel) => {
                    return (<>
                        <MoreMenu
                            items={getMoreMenuOption(data)}
                            iconClassName='default-toolbar-icon'
                            iconFillClassname='cursor-pointer icon-medium'
                            menuClassName='w-48 top-14 more-menu-list'
                            containerClassName='h-full flex items-center justify-center more-menu'
                            onClick={(item: DropdownItemModel) => {
                                setRowSelected(data);
                                switch (item.value) {
                                    case '1':
                                        initiateACall(data.originationNumber);
                                        break;
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
        rows: [],
        hasRowsBottomBorder: true,
        headerClassName: 'h-12',
        rowClass: 'h-20 items-center hover:bg-gray-100 cursor-pointer call-log-row',
    });
    const [tableModel, setTableModel] = useState(getTableModel());

    const {isLoading, isFetching} = useQuery([GetCallLogs, callsLogFilter], () => getCallsLog(callsLogFilter), {
        enabled: true,
        onSuccess: (response) => {
            const {results, ...paging} = response;
            setPagingResult({...paging});
            setTableModel({...getTableModel(), rows: response.results});
        }
    });

    const onFilterSubmit = (filter: TicketLogRequestModel) => {
        const {page, pageSize, searchTerm, ...filterParameters} = filter;
        setCallsLogFilter({...callsLogFilter, ...filterParameters, ...DEFAULT_PAGING});
    }

    const onDropdownClick = (item: DropdownItemModel) => {
        const context = item.value as CallLogQueryType;
        if (context === CallLogQueryType.MyCallLog) {
            setCallsLogFilter({...callsLogFilter, assignedTo: auth.id});
        } else {
            setCallsLogFilter({...callsLogFilter, assignedTo: ''});
        }
    }

    return (
        <div className='flex flex-row flex-auto calls-log'>
            <CallsLogFilter isOpen={isFilterOpen} onSubmit={onFilterSubmit} logType='Call' />
            <div className='flex flex-col flex-1 w-full'>
                <div className='flex flex-row items-center justify-between w-full px-6 border-b calls-log-header'>
                    <div>
                        <DropdownLabel
                            items={dropdownItem}
                            value={CallLogQueryType.MyCallLog}
                            onClick={onDropdownClick}
                        />
                    </div>
                    <div>
                        <Pagination
                            value={pagingResult}
                            onChange={(p) => {
                                setCallsLogFilter({...callsLogFilter, page: p.page, pageSize: p.pageSize});
                            }}
                        />
                    </div>
                </div>
                <div className='flex flex-row border-b h-14'>
                    <div className='flex flex-row items-center pl-6 relative'>
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
                        wrapperClassNames='relative w-full h-full border-l'
                        hasBorderBottom={false}
                        inputClassNames='border-b-0'
                        placeholder='ticket_log.search_calls_placeholder'
                        onPressEnter={(inputValue) => setCallsLogFilter({...callsLogFilter, searchTerm: inputValue})}
                    />
                </div>
                <div className='h-full overflow-y-auto'>
                    {(isLoading || isFetching) &&
                        <Spinner fullScreen />
                    }
                    {(!isLoading && !isFetching) &&
                        <Table model={tableModel} />
                    }
                    {rowSelected && !!rowSelected.recordedConversationLink &&
                        <CallLogPlayer
                            ticketId={rowSelected.id}
                            title={rowSelected.createdForName ?? utils.applyPhoneMask(rowSelected.originationNumber)}
                            isOpen={isPlayerOpen}
                            agentId={rowSelected.assigneeUser}
                            subTitle={t(`ticket_log.${CommunicationDirection[rowSelected.communicationDirection].toString().toLowerCase()}`)}
                            onClose={() => setPlayerOpen(false)}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default CallsLogList;
