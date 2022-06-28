import React, {useEffect, useState} from 'react';
import DropdownLabel from '@components/dropdown-label';
import {DropdownItemModel} from '@components/dropdown';
import Pagination from '@components/pagination';
import {CommunicationDirection} from '@shared/models';
import SearchInputField from '@components/search-input-field/search-input-field';
import SvgIcon, {Icon} from '@components/svg-icon';
import Table from '@components/table/table';
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
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router';
import {ContactsPath, PatientsPath, TicketsPath} from '@app/paths';
import {SortDirection} from '@shared/models/sort-direction';
import {getSortDirection, getSortOrder, updateSort} from '@shared/utils/sort-utils';
import './calls-log-list.scss';
import FilterDot from '@components/filter-dot/filter-dot';
import {selectIsCallsLogFiltered} from '@pages/calls-log/store/calls-log.selectors';
import {setIsCallsLogFiltered} from '@pages/calls-log/store/calls-log.slice';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {AddTicketReview, ViewTicketRatings} from '@components/ticket-rating';
import TicketDetailRating from '@pages/tickets/components/ticket-detail/ticket-detail-rating';
import {getContactsNames} from '@shared/services/contacts.service';
import {GetContactsNames} from '@constants/react-query-constants';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';

dayjs.extend(utc);

const CallsLogList = () => {

    const {t} = useTranslation();
    const canListenAnyRecording = useCheckPermission('Tickets.ListenAnyRecording');
    const isDefaultTeam = useCheckPermission('Calls.DefaultToTeamView');
    const canAddTicketReview = useCheckPermission('Tickets.AddReview');
    const canViewAnyReview = useCheckPermission('Tickets.ViewAnyReview');
    const appUser = useSelector(selectAppUserDetails);
    const isFiltered = useSelector(selectIsCallsLogFiltered);
    const history = useHistory();
    const dispatch = useDispatch();
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isPlayerOpen, setPlayerOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState<TicketLogModel>();
    const [addReviewForTicket, setAddReviewForTicket] = useState<string | undefined>();
    const [currentQueryType, setCurrentQueryType] = useState<CallLogQueryType>(!isDefaultTeam ? CallLogQueryType.MyCallLog : CallLogQueryType.TeamCallLog);
    const [pagingResult, setPagingResult] = useState({...DEFAULT_PAGING});
    const [rows, setRows] = useState<TicketLogModel[]>([]);
    const [displayRatingsForTicket, setDisplayRatingsForTicket] = useState<number | undefined>(undefined);
    const [contactIds, setContactIds] = useState<string[]>([]);
    const [pageResult, setPageResult] = useState<TicketLogModel[]>([]);
    const [callsLogFilter, setCallsLogFilter] = useState<TicketLogRequestModel>({
        ...DEFAULT_PAGING,
        assignedTo: !isDefaultTeam ? appUser?.id : '',
        sorts: ['createdOn Desc']
    });

    useEffect(() => {
        return () => {
            dispatch(setIsCallsLogFiltered(false));
        }
    }, [dispatch]);

    const navigateToTicketDetail = (ticketNumber: number) => {
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

        if (canAddTicketReview && !!data.assigneeUser) {
            options.push({
                label: 'ticket_log.add_review',
                value: '5',
                icon: <SvgIcon type={Icon.Comment} fillClass='rgba-062-fill' />
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

    const onPlayButtonClick = (data: TicketLogModel) => {
        setRowSelected(data);
        setPlayerOpen(true);
    }

    const onManagerReviewAdd = () => {
        setRows(rows.map(r => r.id === addReviewForTicket ? {...r, hasManagerReview: true} : r))
    }

    let tableModel = {
        columns: [
            {
                title: '',
                field: 'id',
                widthClass: 'w-24',
                render: (_: string, data: TicketLogModel) => getDirectionIcon(data.communicationDirection, data.contactStatus)
            },
            {
                title: 'ticket_log.from',
                field: 'from',
                widthClass: 'w-2/12',
                render: (_: string, data: TicketLogModel) => (
                    <CallContactInfo type='from' value={data} />
                )
            },
            {
                title: 'ticket_log.to',
                field: 'to',
                widthClass: 'w-2/12',
                render: (_: string, data: TicketLogModel) => (
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
                disableNoneSort: true,
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
                        <span className={classnames('body2 flex justify-center mr-4', {'text-danger': value === TicketLogContactStatus.Missed})}>
                            <ElipsisTooltipTextbox
                            value={t(`ticket_log.${TicketLogContactStatus[value]
                                    .toString()
                                    .replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '_' + match : match))
                                    .toLowerCase()}`)}
                            classNames={"truncate"} asSpan={true} />
                        </span>
                    );
                }
            },
            {
                title: 'ticket_log.call_type',
                field: 'communicationDirection',
                widthClass: 'w-1/12',
                render: (value: CommunicationDirection) =>
                    (<span className='body2'>{t(`ticket_log.${CommunicationDirection[value]?.toString()?.toLowerCase()}`)}</span>)
            },
            {
                title: 'ticket_log.recording',
                field: 'recordedConversationLink',
                widthClass: 'w-1/12 flex items-center justify-center',
                render: (value: string, data: TicketLogModel) => (
                    <>
                        {!!value &&
                            <SvgIcon
                                type={Icon.Play}
                                fillClass='rgba-05-fill'
                                disabled={data.contactAgent !== appUser.email && !canListenAnyRecording}
                                onClick={() => {
                                    onPlayButtonClick(data);
                                }}
                            />
                        }
                    </>
                )
            },
            {
                title: 'ticket_log.rating',
                field: 'patientRating',
                widthClass: 'w-1/12 flex flex-col items-center justify-center',
                render: (_, data: TicketLogModel) => (
                    <TicketDetailRating patientRating={data?.patientRating} ticketId={data?.id!} />
                )
            }, {
                title: 'ticket_log.review',
                field: 'hasManagerReview',
                widthClass: 'w-1/12 flex items-center justify-center',
                render: (value: boolean, record: TicketLogModel) => (value && canViewAnyReview) ? <SvgIcon onClick={() => setDisplayRatingsForTicket(record.ticketNumber)} type={Icon.Comment} className='cursor-pointer' fillClass='rgba-062-fill' /> : null
            },
            {
                title: '',
                field: '',
                widthClass: 'w-8 h-full items-center justify-center',
                render: (_: any, data: TicketLogModel) => {
                    return (<>
                        <MoreMenu
                            items={getMoreMenuOption(data)}
                            iconClassName='default-toolbar-icon'
                            iconFillClassname='cursor-pointer icon-medium'
                            menuClassName='more-menu-list'
                            containerClassName='h-full flex items-center justify-center more-menu'
                            closeOnMouseLeave={true}
                            onClick={(item: DropdownItemModel) => {
                                setRowSelected(data);
                                switch (item.value) {
                                    case '1':
                                        utils.initiateACall(data.originationNumber);
                                        if (!!data.patientId) {
                                            navigateToPatientDetail(data.patientId);
                                        } else if (!!data.contactId) {
                                            navigateToContactDetail(data.contactId);
                                        }
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
                                    case '5':
                                        setAddReviewForTicket(data.id)
                                        break;
                                }
                            }}
                        />
                    </>)
                }
            }
        ],
        rows: rows,
        hasRowsBottomBorder: true,
        headerClassName: 'h-12',
        rowClass: 'h-20 items-center hover:bg-gray-100 cursor-pointer call-log-row',
    };

    const {isLoading, isFetching} = useQuery([GetCallLogs, callsLogFilter], () => getCallsLog(callsLogFilter), {
        enabled: true,
        onSuccess: (response) => {
            const {results, ...paging} = response;
            setPagingResult({...paging});
            let resultRows = response.results.map(a => a.contactId).filter(Boolean) as string[];
            if(resultRows.length > 0){
                setPageResult(response.results);
                setContactIds(resultRows);
            }else{
                setRows(response.results);
                setContactIds([]);
            }
        }
    });

    const {isLoading: isLoadingContactNames, isFetching: isFetchingContactNames} = useQuery([GetContactsNames, contactIds], () => getContactsNames(contactIds),{
        enabled: contactIds.length > 0,
        onSuccess: data => {
            data.forEach(element => {
                let email = pageResult.find( x => x.contactId === element.id)
                if(email && element.firstName){
                    email.createdForName = element.firstName
                }

                if(email && element.lastName){
                    email.createdForName += " " + element.lastName
                }
            });
            setRows(pageResult);
        }
    });

    const onFilterSubmit = (filter: TicketLogRequestModel) => {
        const {page, pageSize, searchTerm, ...filterParameters} = filter;
        setCallsLogFilter({...callsLogFilter, ...filterParameters, ...DEFAULT_PAGING});
    }

    const onDropdownClick = (item: DropdownItemModel) => {
        const context = item.value as CallLogQueryType;
        setCurrentQueryType(context);
        if (context === CallLogQueryType.MyCallLog) {
            setCallsLogFilter({...callsLogFilter, assignedTo: appUser?.id});
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
                            value={currentQueryType}
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
                    <div className='relative flex flex-row items-center pl-6'>
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
                        onPressEnter={(inputValue) => setCallsLogFilter({...callsLogFilter, searchTerm: inputValue?.trim()})}
                    />
                </div>
                <div className='h-full overflow-y-auto'>
                    {(isLoading || isFetching || isLoadingContactNames || isFetchingContactNames) &&
                        <Spinner fullScreen />
                    }
                    {(!isLoading && !isFetching && !isLoadingContactNames && !isFetchingContactNames) &&
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

                    {addReviewForTicket && <AddTicketReview
                        ticketId={addReviewForTicket}
                        isOpen={!!addReviewForTicket}
                        onClose={() => setAddReviewForTicket(undefined)} 
                        onAdded={onManagerReviewAdd} />}

                    {displayRatingsForTicket && <ViewTicketRatings
                        onClose={() => setDisplayRatingsForTicket(undefined)}
                        isOpen={!!displayRatingsForTicket}
                        ticketNumber={displayRatingsForTicket} />}
                </div>
            </div>
        </div>
    )
}

export default CallsLogList;
