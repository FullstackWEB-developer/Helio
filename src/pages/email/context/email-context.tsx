import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {ChannelTypes, TicketMessageSummaryRequest} from '@shared/models';
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
import {useDispatch, useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {selectLastEmailDate} from '@pages/email/store/email.selectors';
import {setMessageSummaries} from '@pages/email/store/email-slice';

export const EmailContext = createContext<EmailContextType | null>(null);

const EmailProvider =({children}: {children: ReactNode}) => {
    const lastEmailDate = useSelector(selectLastEmailDate);
    const dispatch = useDispatch();
    const {id} = useSelector(selectAppUserDetails);
    const [emailQueryType, setEmailQueryType] = useState<EmailQueryType>();
    const isDefaultTeamView = useCheckPermission('Email.DefaultToTeamView');
    const [queryParams, setQueryParams] = useState<TicketMessageSummaryRequest>({
        channel: ChannelTypes.Email,
        assignedTo: !isDefaultTeamView ? id : '',
        fromDate: utils.toShortISOLocalString(dayjs().utc().subtract(7, 'day').toDate()),
        ...DEFAULT_MESSAGE_QUERY_PARAMS
    });

    useEffect(() => {
        getEmailsQuery.refetch().then();
    }, [lastEmailDate])

    const getEmailsQuery = useInfiniteQuery([QueryTicketMessageSummaryInfinite, queryParams],
        ({pageParam = 1}) => getChats({...queryParams, page: pageParam}), {
            enabled: !!emailQueryType,
            getNextPageParam: (lastPage) => getNextPage(lastPage),
            onSuccess: (result) => {
                dispatch(setMessageSummaries(utils.accumulateInfiniteData(result)));
            }
        });

    return (<EmailContext.Provider value={{
        emailQueryType,
        setEmailQueryType,
        queryParams,
        setQueryParams,
        getEmailsQuery,
        isDefaultTeamView}}>
                {children}
    </EmailContext.Provider>)

}

export default EmailProvider;
