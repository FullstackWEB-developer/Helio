import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {ChannelTypes, TicketMessageSummary, TicketMessageSummaryRequest} from '@shared/models';
import {EmailContextType} from '@pages/email/context/email-context-type';
import {useInfiniteQuery} from 'react-query';
import {QueryTicketMessageSummaryInfinite} from '@constants/react-query-constants';
import {getChats} from '@pages/sms/services/ticket-messages.service';
import {getNextPage} from '@pages/sms/utils';
import utils from '@shared/utils/utils';
import {EmailQueryType} from '@pages/email/models/email-query-type';
import {DEFAULT_MESSAGE_QUERY_PARAMS} from '@pages/email/constants';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {useDispatch, useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {selectLastEmailDate} from '@pages/email/store/email.selectors';
import {setMessageSummaries} from '@pages/email/store/email-slice';
import {useQuery} from 'react-query';
import {getContactsNames} from '@shared/services/contacts.service';
import {GetContactsNames} from '@constants/react-query-constants';
export const EmailContext = createContext<EmailContextType | null>(null);

const EmailProvider =({children}: {children: ReactNode}) => {
    const lastEmailDate = useSelector(selectLastEmailDate);
    const dispatch = useDispatch();
    const {id} = useSelector(selectAppUserDetails);
    const [emailQueryType, setEmailQueryType] = useState<EmailQueryType>();
    const [contactIds, setContactIds] = useState<string[]>([]);
    const [pageResult, setPageResult] = useState<TicketMessageSummary[]>([]);
    const isDefaultTeamView = useCheckPermission('Email.DefaultToTeamView');
    const [queryParams, setQueryParams] = useState<TicketMessageSummaryRequest>({
        channel: ChannelTypes.Email,
        assignedTo: !isDefaultTeamView ? id : '',
        fromDate: '',
        ...DEFAULT_MESSAGE_QUERY_PARAMS
    });

    useEffect(() => {
        getEmailsQuery.refetch().then();
    }, [lastEmailDate]);

    const {isLoading: isLoadingContactNames, isFetching: isFetchingContactNames} = useQuery([GetContactsNames, contactIds], () => getContactsNames(contactIds),{
                enabled: contactIds.length > 0,
                onSuccess: data => {
                    let copyOfPageResult = [...pageResult];
                    data.forEach(element => {
                        let index = copyOfPageResult.findIndex( x => x.contactId === element.id);
                        let email = Object.assign({}, pageResult.find( x => x.contactId === element.id))
                        if(email && element.firstName){
                            email.createdForName = element.firstName
                        }

                        if(email && element.lastName){
                            email.createdForName += " " + element.lastName
                        }
                        copyOfPageResult[index]=email;
                    });
                    setPageResult(copyOfPageResult);
                    dispatch(setMessageSummaries(copyOfPageResult));
                }
            });

    const getEmailsQuery = useInfiniteQuery([QueryTicketMessageSummaryInfinite, queryParams],
        ({pageParam = 1}) => getChats({...queryParams, page: pageParam}), {
            enabled: !!emailQueryType,
            getNextPageParam: (lastPage) => getNextPage(lastPage),
            onSuccess: (result) => {
                let pageResult = utils.accumulateInfiniteData(result);
                let tempContactIds = pageResult.map(a => a.contactId).filter(Boolean) as string[]
                setPageResult(utils.accumulateInfiniteData(result));
                setContactIds(tempContactIds);
                dispatch(setMessageSummaries(pageResult));
            }
        });

    return (<EmailContext.Provider value={{
        emailQueryType,
        setEmailQueryType,
        queryParams,
        setQueryParams,
        getEmailsQuery,
        isDefaultTeamView,
        isLoadingContactNames,
        isFetchingContactNames}}>
                {children}
    </EmailContext.Provider>)

}

export default EmailProvider;
