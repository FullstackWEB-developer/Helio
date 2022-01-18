import React, {useEffect, useMemo, useState} from 'react';
import {ChannelTypes, TicketMessageSummary, TicketMessageSummaryRequest} from '@shared/models';
import {DEFAULT_FILTER_VALUE, DEFAULT_MESSAGE_QUERY_PARAMS} from '../constants';
import {DropdownItemModel} from '@components/dropdown';
import {EmailQueryType} from '@pages/email/models/email-query-type';
import {useInfiniteQuery} from 'react-query';
import {QueryTicketMessageSummaryInfinite} from '@constants/react-query-constants';
import {getChats} from '@pages/sms/services/ticket-messages.service';
import {getNextPage} from '@pages/sms/utils';
import utils from '@shared/utils/utils';
import {useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import DropdownLabel from '@components/dropdown-label';
import {EmailFilterModel} from '@pages/email/components/email-filter/email-filter.model';
import EmailFilterBar from '@pages/email/components/email-filter/email-filter-bar';
import EmailSummaryList from '@pages/email/components/email-summary-list/email-summary-list';
import Spinner from '@components/spinner/Spinner';
import dayjs from 'dayjs';
import useDebounce from '../../../shared/hooks/useDebounce';
import {DEBOUNCE_SEARCH_DELAY_MS} from '@constants/form-constants';

const EmailLeftMenu = () => {
    const {id} = useSelector(selectAppUserDetails);
    const [emailQueryType, setEmailQueryType] = useState<EmailQueryType>();
    const [searchTerm, setSearchTerm] = useState<string>();
    const [messageSummaries, setMessageSummaries] = useState<TicketMessageSummary[]>([]);
    const isDefaultTeamView = useCheckPermission('Email.DefaultToTeamView');
    const [filterParams, setFilterParams] = useState<EmailFilterModel>({...DEFAULT_FILTER_VALUE, assignedTo: isDefaultTeamView ? '' : id});
    const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
    const [debounceSearchTerm] = useDebounce(searchTerm, DEBOUNCE_SEARCH_DELAY_MS);

    const [queryParams, setQueryParams] = useState<TicketMessageSummaryRequest>({
        channel: ChannelTypes.Email,
        assignedTo: !isDefaultTeamView ? id : '',
        fromDate: utils.toShortISOLocalString(dayjs().utc().subtract(7, 'day').toDate()),
        ...DEFAULT_MESSAGE_QUERY_PARAMS
    });

    const {fetchNextPage, isFetchingNextPage, isFetching, isLoading} = useInfiniteQuery([QueryTicketMessageSummaryInfinite, queryParams],
        ({pageParam = 1}) => getChats({...queryParams, page: pageParam}), {
            enabled: !!emailQueryType,
            getNextPageParam: (lastPage) => getNextPage(lastPage),
            onSuccess: (result) => {
                setMessageSummaries(utils.accumulateInfiniteData(result))
            }
        });

    useEffect(() => {
        setQueryParams({...queryParams, searchTerm: debounceSearchTerm, page: 1});
    }, [debounceSearchTerm]);

    useEffect(() => {
        setEmailQueryType(isDefaultTeamView ? EmailQueryType.TeamEmail : EmailQueryType.MyEmail);
    }, [isDefaultTeamView]);

    useEffect(() => {
        if (!filterParams) {
            return;
        }
        if (filterParams.assignedTo === id){
            setEmailQueryType(EmailQueryType.MyEmail)
        } else if (filterParams.assignedTo === '') {
            setEmailQueryType(EmailQueryType.TeamEmail)
        }
    }, [filterParams, id])

    const onDropdownClick = (item: DropdownItemModel) => {
        const context = item.value as EmailQueryType;
        changeQueryType(context);
    }

    const changeQueryType = (context: EmailQueryType) => {
        if (emailQueryType === context) {
            return;
        }

        if (context === EmailQueryType.TeamEmail) {
            setQueryParams({...queryParams, assignedTo: undefined});
            setFilterParams({...filterParams, assignedTo: undefined});
        } else {
            setQueryParams({...queryParams, assignedTo: id});
            setFilterParams({...filterParams, assignedTo: id});
        }
        setEmailQueryType(context);
    }
    const handleScroll = (event: any) => {
        const target = event.target;
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            fetchNextPage().then();
        }
    }

    const loading = useMemo(() => {
        return (isLoading || isFetching) && !isFetchingNextPage
    }, [isFetching, isFetchingNextPage, isLoading])

    const onFilterClick = (value: EmailFilterModel) => {
        setQueryParams({
            ...queryParams,
            fromDate: utils.toShortISOLocalString(value.fromDate),
            toDate: utils.toShortISOLocalString(value.toDate),
            assignedTo: value.assignedTo
        });
        setFilterVisible(false);
        setFilterParams(value);
    }

    return <div className='flex flex-row email'>
            <div className='flex flex-col pt-6 border-r email-sidebar'>
                <div className='pb-2 pl-5 border-b'>
                    <DropdownLabel
                        items={[
                            {label: 'email.query_type.my_email', value: EmailQueryType.MyEmail},
                            {label: 'email.query_type.team_email', value: EmailQueryType.TeamEmail}
                        ]}
                        value={emailQueryType}
                        onClick={(item) => onDropdownClick(item)}
                    />
                </div>
                <EmailFilterBar
                    isFilterVisible={isFilterVisible}
                    setFilterVisible={setFilterVisible}
                    emailQueryType={emailQueryType}
                    filter={filterParams}
                    onSearchTermChanged={setSearchTerm}
                    onFilterClick={onFilterClick}/>
                {
                    loading &&
                    <div className='h-full'>
                        <Spinner fullScreen={true} />
                    </div>
                }
                {
                    !loading && !isFilterVisible && <EmailSummaryList
                        searchTerm={searchTerm}
                        onScroll={handleScroll}
                        data={messageSummaries}
                        isFetchingNextPage={isFetchingNextPage} />
                }
            </div>
        </div>
}

export default EmailLeftMenu;
