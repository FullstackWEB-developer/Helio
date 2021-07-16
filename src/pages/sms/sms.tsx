import {useEffect, useState, useCallback} from 'react';
import classnames from 'classnames';
import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {DropdownItemModel} from '@components/dropdown';
import DropdownLabel from '@components/dropdown-label';
import SearchInputField from '@components/search-input-field/search-input-field';
import SvgIcon, {Icon} from '@components/svg-icon';
import {SmsChat, SmsSummaryList, SmsFilter, SmsNewMessage} from './components';
import {GetTicketMessage, QueryTicketMessagesInfinite, QueryTicketMessageSummaryInfinite} from '@constants/react-query-constants';
import {ChannelTypes, TicketMessage, TicketMessageBase, TicketMessageSummary, TicketMessageSummaryRequest} from '@shared/models';
import {getChats, getMessage, getMessages, markRead, sendMessage} from './services/ticket-messages.service';
import {DATE_INPUT_LONG_FORMAT, DEBOUNCE_SEARCH_DELAY_MS} from '@constants/form-constants';
import useDebounce from '@shared/hooks/useDebounce';
import {authenticationSelector} from '@shared/store/app-user/appuser.selectors';
import {SmsFilterParamModel} from './components/sms-filter/sms-filter.model';
import utils from '@shared/utils/utils';
import {setAssignee} from '@pages/tickets/services/tickets.service';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import {SmsQueryType} from './models/sms-query-type';
import {DEFAULT_FILTER_VALUE, DEFAULT_MESSAGE_QUERY_PARAMS} from './constants';
import {getNextPage, messageSummaryTruncate} from './utils';
import Spinner from '@components/spinner/Spinner';
import {useSignalRConnectionContext} from '@shared/contexts/signalRContext';
import {SmsNotificationData} from './models/sms-notification-data';
import './sms.scss';

const Sms = () => {
    const {t} = useTranslation();
    const {username, name: userFullName} = useSelector(authenticationSelector);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [queryParams, setQueryParams] = useState<TicketMessageSummaryRequest>({
        channel: ChannelTypes.SMS,
        assignedTo: username,
        ...DEFAULT_MESSAGE_QUERY_PARAMS
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceSearchTerm] = useDebounce(searchTerm, DEBOUNCE_SEARCH_DELAY_MS);
    const [selectedTicketSummary, setSelectedTicketSummary] = useState<TicketMessageSummary>();
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [isNewSmsChat, setIsNewSmsChat] = useState(false);
    const [filterParam, setFilterParam] = useState<SmsFilterParamModel>(DEFAULT_FILTER_VALUE);
    const [summaryMessages, setSummaryMessages] = useState<TicketMessageSummary[]>([])
    const [smsQueryType, setSmsQueryType] = useState(SmsQueryType.MySms);
    const [newMessageId, setNewMessageId] = useState('');
    const {smsIncoming} = useSignalRConnectionContext();

    const dropdownItem: DropdownItemModel[] = [
        {label: t('sms.query_type.my_sms'), value: SmsQueryType.MySms},
        {label: t('sms.query_type.team_sms'), value: SmsQueryType.MyTeam}
    ];

    const {fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch} = useInfiniteQuery([QueryTicketMessageSummaryInfinite],
        ({pageParam = 1}) => getChats({...queryParams, page: pageParam}), {
        getNextPageParam: (lastPage) => getNextPage(lastPage),
        onSuccess: (result) => {
            setSummaryMessages(utils.accumulateInfiniteData(result))
        }
    });

    const {
        refetch: messageQueryRefetch,
        isFetching: messageQueryIsFetching,
        isFetchingNextPage: isMessageQueryFetchingNextPage,
        fetchNextPage: messageNextPage,
        hasNextPage: messageHasNextPage,
        data: messagePages
    }
        = useInfiniteQuery([QueryTicketMessagesInfinite],
            ({pageParam = 1}) => getMessages(selectedTicketSummary?.ticketId || '', ChannelTypes.SMS, {...DEFAULT_MESSAGE_QUERY_PARAMS, page: pageParam}),
            {
                enabled: false,
                getNextPageParam: (lastPage) => getNextPage(lastPage),
                onSuccess: (result) => {
                    setMessages(utils.accumulateInfiniteData(result));
                }
            });

    const pushMessage = (newMessage: TicketMessage) => {
        const messagesHistory = [...messages, newMessage];
        setMessages(messagesHistory);
        if (messagePages && messagePages.pages.length > 0) {
            messagePages.pages[0].results = messagesHistory;
        }
    }

    const modifySummaryMessage = (ticketId: string, unreadCountIncrease?: number, messageSummaryBody?: string) => {
        const messageIndex = summaryMessages.findIndex(p => p.ticketId === ticketId);
        if (messageIndex < 0) {
            return;
        }
        const currentSummaryMessagesClone = summaryMessages.slice();
        const currentSummaryMessage = currentSummaryMessagesClone[messageIndex];
        if (unreadCountIncrease) {
            currentSummaryMessage.unreadCount += unreadCountIncrease;
        }
        if (messageSummaryBody) {
            currentSummaryMessage.messageSummary = messageSummaryTruncate(messageSummaryBody);
        }
        setSummaryMessages(currentSummaryMessagesClone);
    }

    const getNewMessageQuery = useQuery([GetTicketMessage, newMessageId], () => getMessage(newMessageId),
        {
            enabled: !!newMessageId,
            onSuccess: (result) => {
                const isTicketSummarySelected = summaryMessages && selectedTicketSummary?.ticketId === result.ticketId;
                modifySummaryMessage(result.ticketId, !isTicketSummarySelected ? 1 : undefined, result.body);
                pushMessage(result);
            },
            onSettled: () => {
                setNewMessageId('');
            }
        });

    const sendMessageMutation = useMutation(sendMessage, {
        onSuccess: (response) => {
            pushMessage(response);
            modifySummaryMessage(response.ticketId, undefined, response.body);
        }
    });

    const markReadMutation = useMutation(
        ({ticketId, channel}: {ticketId: string, channel: ChannelTypes}) => markRead(ticketId, channel),
        {
            onSuccess: (data) => {
                modifySummaryMessage(data.ticketId, 0);
            }
        });

    const receiveSMS = useCallback((data: SmsNotificationData) => {
        const messageIndex = summaryMessages.findIndex(p => p.ticketId === data.ticketId);
        if (messageIndex < 0) {
            refetch();
        }
        setNewMessageId(data.messageId);
    }, [refetch, summaryMessages]);

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
            messageNextPage();
        }
    }

    const changeAssigneeMutation = useMutation(setAssignee);

    useEffect(() => {
        refetch();
    }, [queryParams, refetch]);

    useEffect(() => {
        if (selectedTicketSummary) {
            messageQueryRefetch();
        }
    }, [selectedTicketSummary, messageQueryRefetch]);

    useEffect(() => {
        setQueryParams({...queryParams, searchTerm: debounceSearchTerm, page: 1});
    }, [debounceSearchTerm]);

    const fetchMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }

    const onDropdownClick = (item: DropdownItemModel) => {
        const context = item.value as SmsQueryType;

        if (context === SmsQueryType.MyTeam) {
            setQueryParams({...queryParams, assignedTo: undefined});
        } else {
            setQueryParams({...queryParams, assignedTo: username});
        }
        setSmsQueryType(context);
    }

    const onMessageListScroll = ({currentTarget}: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (currentTarget.scrollHeight - currentTarget.scrollTop === currentTarget.clientHeight) {
            fetchMore();
        }
    }

    const onMessageListClick = (summary: TicketMessageSummary) => {
        if (summary.ticketId !== selectedTicketSummary?.ticketId) {
            setSelectedTicketSummary(summary);
            setIsNewSmsChat(false);
            markReadMutation.mutate({ticketId: summary.ticketId, channel: ChannelTypes.SMS});
        }
    }

    const onSendMessage = (text: string) => {
        if (!selectedTicketSummary) {
            return;
        }
        const message: TicketMessageBase = {
            channel: ChannelTypes.SMS,
            body: text,
            ticketId: selectedTicketSummary.ticketId
        }
        if (!selectedTicketSummary.assignedTo || selectedTicketSummary.assignedTo !== username) {
            changeAssigneeMutation.mutate({assignee: username, ticketId: selectedTicketSummary.ticketId});
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
        setQueryParams({...queryParams, searchTerm: value});
        setSearchTerm(value);
    }
    const onFilterClick = (value: SmsFilterParamModel) => {
        setQueryParams({
            ...queryParams,
            fromDate: utils.toShortISOLocalString(value.fromDate),
            toDate: utils.toShortISOLocalString(value.toDate),
            assignedTo: value.assignedTo
        });
        setFilterVisible(false);
        setFilterParam(value);
    }

    const onOpenNewChat = (ticket: TicketBase) => {
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
            messageCreatedByName: userFullName
        };

        setMessages([]);
        setSummaryMessages([summary, ...summaryMessages]);
        setIsNewSmsChat(false);
        setSelectedTicketSummary(summary);
    }

    const onNewChatClick = () => {
        setIsNewSmsChat(true);
        setSelectedTicketSummary(undefined);
    }
    const getSmsChatSection = () => {
        if (messageQueryIsFetching && !isMessageQueryFetchingNextPage) {
            return (<Spinner fullScreen />);
        }
        if (selectedTicketSummary) {
            return (
                <SmsChat
                    info={selectedTicketSummary}
                    messages={messages}
                    isLoading={isMessageQueryFetchingNextPage}
                    isSending={sendMessageMutation.isLoading}
                    isBottomFocus={sendMessageMutation.isLoading || getNewMessageQuery.isLoading}
                    onSendClick={onSendMessage}
                    onFetchMore={messageFetchMore}
                />
            );
        }
        return <></>
    }

    const getMessageListSection = () => {
        if (isFetching && !isFetchingNextPage) {
            return (<Spinner fullScreen />);
        }
        return (<>
            <SmsSummaryList
                className={classnames({'hidden': isFilterVisible})}
                data={summaryMessages}
                selectedTicketId={selectedTicketSummary?.ticketId}
                onScroll={onMessageListScroll}
                onClick={onMessageListClick}
                isLoading={isFetchingNextPage}
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

    return (
        <div className='flex flex-row w-full sms'>
            <div className='flex flex-col pt-6 border-r sms-sidebar'>
                <div className='pb-2 pl-5 border-b'>
                    <DropdownLabel
                        items={dropdownItem}
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
                                <SvgIcon
                                    type={Icon.FilterList}
                                    fillClass='default-toolbar-icon'
                                    className='cursor-pointer icon-medium'
                                    onClick={() => setFilterVisible(true)}
                                />
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
                    />
                }
                {!isNewSmsChat && getSmsChatSection()}
            </div>
        </div>
    )
}

export default Sms;