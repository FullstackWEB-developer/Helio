import React, {useEffect, useMemo, useState} from 'react';
import {ChannelTypes, TicketMessageSummary, TicketMessageSummaryRequest} from '@shared/models';
import {DEFAULT_FILTER_VALUE, DEFAULT_MESSAGE_QUERY_PARAMS} from '@pages/sms/constants';
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

const EmailLeftMenu = () => {
    const {id} = useSelector(selectAppUserDetails);
    const [filterParams, setFilterParams] = useState<EmailFilterModel>({...DEFAULT_FILTER_VALUE, assignedTo: id});
    const [emailQueryType, setEmailQueryType] = useState<EmailQueryType>();
    const [searchTerm, setSearchTerm] = useState<string>();
    const [messageSummaries, setMessageSummaries] = useState<TicketMessageSummary[]>([]);
    const isDefaultTeamView = useCheckPermission('EMAIL.DefaultToTeamView');
    const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
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
        setEmailQueryType(!isDefaultTeamView ? EmailQueryType.MyEmail : EmailQueryType.TeamEmail);
    }, [isDefaultTeamView]);

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

    const onNewEmail =() => {

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
                    onSearchTermChanged={(value) => setSearchTerm(value)}
                    onFilterClick={(data) => onFilterClick(data)}
                    onNewEmailClick={() => onNewEmail()} />
                {
                    loading &&
                    <div className='h-full'>
                        <Spinner fullScreen={true} />
                    </div>
                }
                {
                    !loading && !isFilterVisible && <EmailSummaryList searchTerm={searchTerm} onScroll={handleScroll} data={messageSummaries} isFetchingNextPage={isFetchingNextPage} />
                }
            </div>
        </div>
}

export default EmailLeftMenu;
