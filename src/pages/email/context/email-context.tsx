import React, {createContext, ReactNode, useState} from 'react';
import {ChannelTypes, TicketMessageSummary, TicketMessageSummaryRequest} from '@shared/models';
import {EmailContextType} from '@pages/email/context/email-context-type';
import {useInfiniteQuery} from 'react-query';
import {QueryTicketMessageSummaryInfinite} from '@constants/react-query-constants';
import {getChats} from '@pages/sms/services/ticket-messages.service';
import {getNextPage} from '@pages/sms/utils';
import utils from '@shared/utils/utils';
import {EmailQueryType} from '@pages/email/models/email-query-type';
import dayjs from 'dayjs';
import {DEFAULT_MESSAGE_QUERY_PARAMS} from '@pages/email/constants';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';

export const EmailContext = createContext<EmailContextType | null>(null);

const EmailProvider =({children}: {children: ReactNode}) => {
    const [messageSummaries, setMessageSummaries] = useState<TicketMessageSummary[]>([]);
    const {id} = useSelector(selectAppUserDetails);
    const [emailQueryType, setEmailQueryType] = useState<EmailQueryType>();
    const isDefaultTeamView = useCheckPermission('Email.DefaultToTeamView');
    const [queryParams, setQueryParams] = useState<TicketMessageSummaryRequest>({
        channel: ChannelTypes.Email,
        assignedTo: !isDefaultTeamView ? id : '',
        fromDate: utils.toShortISOLocalString(dayjs().utc().subtract(7, 'day').toDate()),
        ...DEFAULT_MESSAGE_QUERY_PARAMS
    });

    const getEmailsQuery = useInfiniteQuery([QueryTicketMessageSummaryInfinite, queryParams],
        ({pageParam = 1}) => getChats({...queryParams, page: pageParam}), {
            enabled: !!emailQueryType,
            getNextPageParam: (lastPage) => getNextPage(lastPage),
            onSuccess: (result) => {
                setMessageSummaries(utils.accumulateInfiniteData(result))
            }
        });

    return (<EmailContext.Provider value={{messageSummaries,
        emailQueryType,
        setEmailQueryType,
        queryParams,
        setQueryParams,
        getEmailsQuery,
        isDefaultTeamView,
        setMessageSummaries}}>
                {children}
    </EmailContext.Provider>)

}

export default EmailProvider;
