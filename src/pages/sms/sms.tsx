import {useCallback, useEffect, useState} from 'react';
import classnames from 'classnames';
import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {DropdownItemModel} from '@components/dropdown';
import DropdownLabel from '@components/dropdown-label';
import SearchInputField from '@components/search-input-field/search-input-field';
import SvgIcon, {Icon} from '@components/svg-icon';
import {SmsChat, SmsFilter, SmsNewMessage, SmsSummaryList} from './components';
import {
    GetTicketMessage,
    QueryTicketMessagesInfinite,
    QueryTicketMessageSummaryByTicketId,
    QueryTicketMessageSummaryInfinite
} from '@constants/react-query-constants';
import {
    ChannelTypes,
    ContactExtended,
    TicketMessage,
    TicketMessageBase,
    TicketMessagesDirection,
    TicketMessageSummary,
    TicketMessageSummaryRequest
} from '@shared/models';
import {getChats, getMessage, getMessages, markRead, sendMessage} from './services/ticket-messages.service';
import {DATE_INPUT_LONG_FORMAT, DEBOUNCE_SEARCH_DELAY_MS} from '@constants/form-constants';
import useDebounce from '@shared/hooks/useDebounce';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {SmsFilterParamModel} from './components/sms-filter/sms-filter.model';
import utils from '@shared/utils/utils';
import {getBadgeValues, getTicketById, setAssignee} from '@pages/tickets/services/tickets.service';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {SmsNotificationData, SmsQueryType} from '@pages/sms/models';
import {DEFAULT_FILTER_VALUE, DEFAULT_MESSAGE_QUERY_PARAMS} from './constants';
import {getNextPage} from './utils';
import Spinner from '@components/spinner/Spinner';
import {useSignalRConnectionContext} from '@shared/contexts/signalRContext';
import './sms.scss';
import {useHistory, useLocation, useParams} from 'react-router';
import {SmsPath} from '@app/paths';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {setIsSmsFiltered, setSmsMessageSummaries} from '@pages/sms/store/sms.slice';
import {selectIsSmsFiltered, selectLastSmsDate, selectSmsSummaries, selectUnreadSmsMessages} from '@pages/sms/store/sms.selectors';
import FilterDot from '@components/filter-dot/filter-dot';
import { BadgeValues } from '@pages/tickets/models/badge-values.model';
import {getContactsNames} from '@shared/services/contacts.service';
import {GetContactsNames} from '@constants/react-query-constants';

interface SmsLocationState {
    contact?: ContactExtended,
    patient?: ExtendedPatient
}
const Sms = () => {
    const {t} = useTranslation();
    const isDefaultTeamView = useCheckPermission('SMS.DefaultToTeamView');
    const {id, fullName} = useSelector(selectAppUserDetails);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const isFiltered = useSelector(selectIsSmsFiltered);
    const [queryParams, setQueryParams] = useState<TicketMessageSummaryRequest>({
        channel: ChannelTypes.SMS,
        assignedTo: !isDefaultTeamView ? id : '',
        ...DEFAULT_MESSAGE_QUERY_PARAMS
    });
    const [searchTerm, setSearchTerm] = useState('');
    const lastSmsDate = useSelector(selectLastSmsDate);
    const unreadSMSList = useSelector(selectUnreadSmsMessages);
    const [debounceSearchTerm] = useDebounce(searchTerm, DEBOUNCE_SEARCH_DELAY_MS);
    const [selectedTicketSummary, setSelectedTicketSummary] = useState<TicketMessageSummary>();
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [isNewSmsChat, setIsNewSmsChat] = useState(false);
    const [filterParam, setFilterParam] = useState<SmsFilterParamModel>({...DEFAULT_FILTER_VALUE, assignedTo: id});
    const [smsQueryType, setSmsQueryType] = useState<SmsQueryType>();
    const {smsIncoming} = useSignalRConnectionContext();
    const {state} = useLocation<SmsLocationState>();
    const [newMessageId, setNewMessageId] = useState('');
    const {ticketId} = useParams<{ticketId?: string}>();
    const [lastMessageSendTime, setLastMessageSendTime] = useState<Date>();
    const [contactIds, setContactIds] = useState<string[]>([]);
    const [pageResult, setPageResult] = useState<TicketMessageSummary[]>([]);
    const history = useHistory();
    const dispatch = useDispatch();
    const summaryMessages = useSelector(selectSmsSummaries);

    const {isLoading: isLoadingContactNames, isFetching: isFetchingContactNames} = useQuery([GetContactsNames, contactIds], () => getContactsNames(contactIds),{
        enabled: contactIds.length > 0,
        onSuccess: data => {
            let copyOfPageResult = [...pageResult];
            data.forEach(element => {
                let index = copyOfPageResult.findIndex( x => x.contactId === element.id);
                let sms = Object.assign({}, pageResult.find( x => x.contactId === element.id))
                if(sms && element.firstName){
                    sms.createdForName = element.firstName
                }

                if(sms && element.lastName){
                    sms.createdForName += " " + element.lastName
                }
                copyOfPageResult[index]=sms;
            });
            setPageResult(copyOfPageResult);
            dispatch(setSmsMessageSummaries(copyOfPageResult));
        }
    });

    const {fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchTicketSummaries} = useInfiniteQuery([QueryTicketMessageSummaryInfinite, queryParams],
        ({pageParam = 1}) => getChats({...queryParams, page: pageParam}), {
        enabled: !!smsQueryType,
        getNextPageParam: (lastPage) => getNextPage(lastPage),
        onSuccess: (result) => {
            let pageResult = utils.accumulateInfiniteData(result);
            let tempContactIds = pageResult.map(a => a.contactId).filter(Boolean) as string[]
            setPageResult(utils.accumulateInfiniteData(result));
            setContactIds(tempContactIds);
            dispatch(setSmsMessageSummaries(pageResult));
        }
    });

    const {refetch: fetchTicket, isFetching: isTicketFetching} = useQuery(["Query", ticketId], () => getTicketById(ticketId!), {
        enabled: false,
        onSuccess: (ticket) => {
            const summary = createSummaryFromTicket(ticket);
            setSelectedTicketSummary(summary);
        }
    });

    const {refetch: ticketSummaryRefetch, isFetching: isTicketSummaryFetching} = useQuery([QueryTicketMessageSummaryByTicketId, ticketId],
        () => getChats({ticketId: ticketId, channel: ChannelTypes.SMS}), {
        enabled: false,
        onSuccess: async (response) => {
            if (response.results.length > 0) {
                const summary = {...response.results[0]};
                setSelectedTicketSummary(summary);
                removeUnreadCount(summary);
            } else if (response.results.length === 0) {
                //Switching to new message, need to fetch ticket again
                fetchTicket().then()
            }
        }
    });

    useEffect(() => {
        refetchTicketSummaries().then()
    }, [lastSmsDate, queryParams])

    useEffect(() => {
        return () => {
            dispatch(setIsSmsFiltered(false));
        }
    }, [dispatch]);

    useEffect(() => {
        setSmsQueryType(isDefaultTeamView ? SmsQueryType.MyTeam : SmsQueryType.MySms);
    }, [isDefaultTeamView]);

    useEffect(() => {
        if(!isNewSmsChat && !!ticketId) {
            ticketSummaryRefetch().then();
        }
    }, [ticketSummaryRefetch, ticketId, isNewSmsChat]);

    useEffect(() => {
        if (!!state?.contact || !!state?.patient) {
            setIsNewSmsChat(true);
        }
    }, [state]);

    const {
        refetch: messageQueryRefetch,
        isFetching: messageQueryIsFetching,
        isFetchingNextPage: isMessageQueryFetchingNextPage,
        fetchNextPage: messageNextPage,
        hasNextPage: messageHasNextPage,
        data: messagePages,
        isError: messageHasError
    }
        = useInfiniteQuery([QueryTicketMessagesInfinite],
            ({pageParam = 1}) => getMessages(selectedTicketSummary?.ticketId || '', ChannelTypes.SMS, {...DEFAULT_MESSAGE_QUERY_PARAMS, page: pageParam}),
            {
                enabled: false,
                getNextPageParam: (lastPage) => getNextPage(lastPage),
                onSuccess: (result) => {
                    setMessages(utils.accumulateInfiniteData(result));
                },
                onError: () => {setMessages([])}
            });

    const pushMessage = (newMessage: TicketMessage) => {
        const messagesHistory = [...messages, newMessage];
        setMessages(messagesHistory);
        if (messagePages && messagePages.pages.length > 0) {
            messagePages.pages[0].results = messagesHistory;
        }
    }

    const removeUnreadCount = (summary: TicketMessageSummary) => {
        if (summary.unreadCount > 0) {
            markReadMutation.mutate({ticketId: summary.ticketId, channel: ChannelTypes.SMS}, {
                onSuccess: () => {
                    dispatch(getBadgeValues(BadgeValues.SMSOnly))
                }
            });
        }
    }

    useQuery([GetTicketMessage, newMessageId], () => getMessage(newMessageId),
        {
            enabled: !!newMessageId,
            onSuccess: (result) => {
                const isTicketSummarySelected = summaryMessages && selectedTicketSummary?.ticketId === result.ticketId;
                if (isTicketSummarySelected && result.createdBy !== id) {
                    pushMessage(result);
                }
            },
            onSettled: () => {
                setNewMessageId('');
            }
        });

    const sendMessageMutation = useMutation(sendMessage, {
        onSuccess: (response) => {
            response.createdOn = dayjs().utc().local().toDate();
            pushMessage(response);
            setLastMessageSendTime(response.createdOn);
            refetchTicketSummaries().then();
        }
    });

    const markReadMutation = useMutation(({ticketId, channel}: {ticketId: string, channel: ChannelTypes}) => markRead(ticketId, channel, TicketMessagesDirection.Incoming));

    const receiveSMS = useCallback((data: SmsNotificationData) => {
        const messageIndex = summaryMessages.findIndex(p => p.ticketId === data.ticketId);
        if (messageIndex < 0) {
            refetchTicketSummaries().then();
        }
        setNewMessageId(data.messageId);
    }, [refetchTicketSummaries, summaryMessages]);

    useEffect(() => {
        if (!smsIncoming) {
            return () => { };
        }

        smsIncoming.on('ReceiveSmsMessage', receiveSMS);
        return () => {
            smsIncoming?.off('ReceiveSmsMessage', receiveSMS);
        }
    }, [receiveSMS, smsIncoming]);

    const messageFetchMore = () => {
        if (messageHasNextPage) {
            messageNextPage().then();
        }
    }

    const changeAssigneeMutation = useMutation(setAssignee);


    useEffect(() => {
        if (selectedTicketSummary) {
            setMessages([]);
            messageQueryRefetch().then();
        }
    }, [selectedTicketSummary, messageQueryRefetch]);

    useEffect(() => {
        setQueryParams({...queryParams, searchTerm: debounceSearchTerm?.trim(), page: 1});
    }, [debounceSearchTerm]);

    const fetchMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }

    const onDropdownClick = (item: DropdownItemModel) => {
        const context = item.value as SmsQueryType;
        changeQueryType(context);
    }

    const changeQueryType = (context: SmsQueryType) => {
        if (smsQueryType === context) {
            return;
        }

        if (context === SmsQueryType.MyTeam) {
            setQueryParams({...queryParams, assignedTo: undefined});
            setFilterParam({...filterParam, assignedTo: undefined});
        } else {
            setQueryParams({...queryParams, assignedTo: id});
            setFilterParam({...filterParam, assignedTo: id});
        }
        setSmsQueryType(context);
    }


    const onMessageListScroll = (event: any) => {
        if (event.target.scrollHeight <= event.target.scrollTop + event.target.clientHeight) {
            fetchMore();
        }
    }

    const onMessageListClick = (summary: TicketMessageSummary) => {
        if (summary.ticketId !== selectedTicketSummary?.ticketId) {

            setIsNewSmsChat(false);
            history.replace(`${SmsPath}/${summary.ticketId}`)
        }
    }


    const onSendMessage = (toAddress: string, text: string) => {
        if (!selectedTicketSummary) {
            return;
        }
        const message: TicketMessageBase = {
            channel: ChannelTypes.SMS,
            body: text,
            toAddress,
            ticketId: selectedTicketSummary.ticketId,
            direction: TicketMessagesDirection.Outgoing
        }
        if (selectedTicketSummary.patientId) {
            message.patientId = selectedTicketSummary.patientId
        }
        if (selectedTicketSummary.contactId) {
            message.contactId = selectedTicketSummary.contactId
        }
        if (!selectedTicketSummary.assignedTo || selectedTicketSummary.assignedTo !== id) {
            changeAssigneeMutation.mutate({assignee: id, ticketId: selectedTicketSummary.ticketId});
        }
        sendMessageMutation.mutate(message);
    }

    const getTimePeriodLabel = (value: string) => {
        switch (value) {
            case '0':
                return t('common.time_periods.today');
            case '1':
                return t('common.time_periods.last_7_days');
            case '2':
                return t('common.time_periods.last_30_days');
            case '3':
                return t('common.time_periods.date_range_value', {
                    from: dayjs(filterParam.fromDate).format(DATE_INPUT_LONG_FORMAT),
                    to: dayjs(filterParam.toDate).format(DATE_INPUT_LONG_FORMAT)
                });
            default:
                return '';
        }
    }

    const onSearchChanged = (value: string) => {
        setSearchTerm(value);
    }
    const onFilterClick = (value: SmsFilterParamModel) => {
        setQueryParams({
            ...queryParams,
            fromDate: utils.toShortISOLocalString(value.fromDate),
            toDate: utils.toShortISOLocalString(value.toDate),
            assignedTo: value.assignedTo
        });

        if (value.assignedTo === id){
            setSmsQueryType(SmsQueryType.MySms)
        } else if (value.assignedTo === '') {
            setSmsQueryType(SmsQueryType.MyTeam)
        }
        
        setFilterVisible(false);
        setFilterParam(value);
    }

    const createSummaryFromTicket = (ticket: TicketBase) => {
        const summary: TicketMessageSummary = {
            ticketId: ticket.id,
            ticketNumber: ticket.ticketNumber,
            messageSummary: t('sms.chat.new.draft'),
            messageCreatedOn: new Date(),
            unreadCount: 0,
            assignedTo: ticket.assignee,
            reason: ticket.reason,
            patientId: ticket.patientId,
            contactId: ticket.contactId,
            createdForName: ticket.createdForName,
            ticketType: Number(ticket.type),
            messageCreatedByName: fullName,
            createdForEndpoint: ''
        };
        return summary;
    }

    const onOpenNewChat = (ticket: TicketBase) => {
        const summary = createSummaryFromTicket(ticket);
        setMessages([]);

        dispatch(setSmsMessageSummaries([summary, ...summaryMessages]));
        setIsNewSmsChat(false);
        setSelectedTicketSummary(summary);
    }

    const onNewChatClick = () => {
        setIsNewSmsChat(true);
        setSelectedTicketSummary(undefined);
        history.replace({pathname: SmsPath});
    }
    const getSmsChatSection = () => {
        if (messageQueryIsFetching && !isMessageQueryFetchingNextPage) {
            return (<Spinner fullScreen />);
        }
        if (isTicketSummaryFetching) {
            return (<Spinner fullScreen />);
        }
        if (isTicketFetching) {
            return (<Spinner fullScreen />);
        }
        if (selectedTicketSummary) {
            return (
                <SmsChat
                    info={selectedTicketSummary}
                    messages={messages}
                    isError={messageHasError}
                    isLoading={isMessageQueryFetchingNextPage || isTicketFetching}
                    isSending={sendMessageMutation.isLoading}
                    isBottomFocus={sendMessageMutation.isLoading || !!newMessageId}
                    onSendClick={onSendMessage}
                    onFetchMore={messageFetchMore}
                    lastMessageSendTime = {lastMessageSendTime}
                />
            );
        }
        return <></>
    }

    const getMessageListSection = () => {
        return (<>
            <SmsSummaryList
                className={classnames({'hidden': isFilterVisible})}
                data={summaryMessages}
                selectedTicketId={selectedTicketSummary?.ticketId}
                searchTerm={searchTerm}
                onScroll={onMessageListScroll}
                onClick={onMessageListClick}
                isLoading={isFetchingNextPage || isLoadingContactNames || isFetchingContactNames}
            />
            <SmsFilter
                defaultValue={DEFAULT_FILTER_VALUE}
                value={filterParam}
                className={classnames({'hidden': !isFilterVisible})}
                isUserFilterEnabled={smsQueryType === SmsQueryType.MyTeam}
                onCloseClick={() => setFilterVisible(false)}
                onFilterClick={onFilterClick}
            />
        </>);
    }

    useEffect(() => {
        if (selectedTicketSummary) {
            dispatch(getBadgeValues(BadgeValues.SMSOnly))
            markReadMutation.mutate({ticketId: selectedTicketSummary.ticketId, channel: ChannelTypes.SMS});
        }
    }, [unreadSMSList, unreadSMSList])

    return (
        <div className='flex flex-row w-full sms'>
            <div className='flex flex-col pt-6 border-r sms-sidebar'>
                <div className='pb-2 pl-5 border-b'>
                    <DropdownLabel
                        items={[
                            {label: 'sms.query_type.my_sms', value: SmsQueryType.MySms},
                            {label: 'sms.query_type.team_sms', value: SmsQueryType.MyTeam}
                        ]}
                        value={smsQueryType}
                        onClick={(item) => onDropdownClick(item)}
                    />
                </div>
                <div className={classnames({'hidden': isFilterVisible})}>
                    <div className='flex-none border-b'>
                        <div className='flex flex-row justify-between pt-4 pb-4 pl-5 pr-4'>
                            <div className='subtitle2'>{getTimePeriodLabel(filterParam.timePeriod)}</div>
                            <div className='flex flex-row'>
                                <SvgIcon
                                    type={Icon.Note}
                                    className='cursor-pointer icon-medium'
                                    fillClass='default-toolbar-icon'
                                    wrapperClassName='mr-7'
                                    onClick={onNewChatClick}
                                />
                                <div className='relative flex flex-row items-center'>
                                    <SvgIcon
                                        type={Icon.FilterList}
                                        fillClass='default-toolbar-icon'
                                        className='cursor-pointer icon-medium'
                                        onClick={() => setFilterVisible(true)}
                                    />
                                    
                                    {isFiltered && <div className='absolute bottom-0 right-0'>
                                        <FilterDot />
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <SearchInputField
                        wrapperClassNames='h-12 flex-none'
                        iconWrapperClassName='pl-5'
                        placeholder={t('sms.filter.search_placeholder')}
                        value={searchTerm}
                        onChange={onSearchChanged}
                    />
                </div>
                {getMessageListSection()}
            </div>
            <div className='sms-message'>
                {isNewSmsChat &&
                    <SmsNewMessage
                        onTicketSelect={onOpenNewChat}
                        selectedContact={state?.contact}
                        selectedPatient={state?.patient}
                    />
                }
                {!isNewSmsChat && getSmsChatSection()}
            </div>
        </div>
    )
}

export default Sms;
