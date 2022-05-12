import {useTranslation} from 'react-i18next';
import './extensions-context.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
import {useMemo, useState} from 'react';
import SearchInputField from '@components/search-input-field/search-input-field';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '@components/avatar';
import {setInternalCallDetails} from '@pages/ccp/store/ccp.slice';
import {selectAppUserDetails, selectInternalQueueStatuses} from '@shared/store/app-user/appuser.selectors';
import utils from '@shared/utils/utils';
import {useQuery} from 'react-query';
import {GetInternalQueues} from '@constants/react-query-constants';
import {getInternalQueues} from '@shared/services/user.service';
import Spinner from '@components/spinner/Spinner';
import {InternalQueueStatus} from '@pages/ccp/models/internal-queue-status';
import {setInternalQueueStatuses} from '@shared/store/app-user/appuser.slice';
import {UserStatus} from '@shared/store/app-user/app-user.models';

const ExtensionsContext = () => {
    const {t} = useTranslation();
    const AgentType = 'AGENT';
    const QueueType = 'STANDART';
    const [displayDescription, setDisplayDescription] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const users = useSelector(selectUserList);
    const dispatch = useDispatch();
    const currentUser = useSelector(selectAppUserDetails);
    const internalContacts = useSelector(selectInternalQueueStatuses);

    const {isLoading, isError} = useQuery(GetInternalQueues, () => getInternalQueues(), {
        onSuccess: (data) => {
            const newData = data.map(info => {
                if (info.queueType === AgentType) {
                    let user = users.find(a => a.id === info.userId);
                    return {
                        ...info,
                        user: user,
                        displayName: utils.stringJoin(' ', user?.firstName, user?.lastName)
                    }
                } else {
                    return {
                        ...info,
                        displayName: info.queueName
                    }
                }
            });
            dispatch(setInternalQueueStatuses(newData));
        }
    });

    const onDoubleClick = (contact: InternalQueueStatus) => {
        dispatch(setInternalCallDetails({
            type: contact.queueType,
            fromUserId: currentUser.id,
            queueArn: contact.queueArn,
            toUserId: contact.userId
        }));
        let phone = utils.getAppParameter("InternalCallPhoneNumber");
        utils.initiateACall(phone);
    }

    const sort = (items: InternalQueueStatus[]): InternalQueueStatus[] => {
        let list: InternalQueueStatus[] = [];
        let availableAgents = items.filter(a => a.queueType === AgentType && a.connectStatus === UserStatus.Available);
        if (!!availableAgents && availableAgents.length > 0) {
            list = list.concat(availableAgents.sort((a, b) => a?.queueName?.localeCompare(b?.queueName)));
        }

        let busyAgents = items.filter(a => a.queueType === AgentType && (a.connectStatus === UserStatus.Busy || a.connectStatus === UserStatus.OnCall));
        if (!!busyAgents && busyAgents.length > 0) {
            list = list.concat(busyAgents.sort((a, b) => a?.queueName?.localeCompare(b?.queueName)));
        }

        let afterWorkAgents = items.filter(a => a.queueType === AgentType && a.connectStatus === UserStatus.AfterWork);
        if (!!afterWorkAgents && afterWorkAgents.length > 0) {
            list = list.concat(afterWorkAgents.sort((a, b) => a?.queueName?.localeCompare(b?.queueName)));
        }

        let queues = items.filter(a => a.queueType === QueueType);
        if (!!queues && queues.length > 0) {
            list = list.concat(queues.sort((a, b) => a?.queueName?.localeCompare(b?.queueName)));
        }

        let nonAvailableCallForwardingEnabled = items.filter(a => a.queueType === AgentType && a.forwardingEnabled && a.connectStatus !== UserStatus.Available);
        if (!!nonAvailableCallForwardingEnabled && nonAvailableCallForwardingEnabled.length > 0) {
            list = list.concat(nonAvailableCallForwardingEnabled.sort((a, b) => a?.queueName?.localeCompare(b?.queueName)));
        }

        let nonAvailableAgents = items.filter(a => a.queueType === AgentType && !a.forwardingEnabled && a.connectStatus !== UserStatus.Available && a.connectStatus !== UserStatus.OnCall);
        if (!!nonAvailableAgents && nonAvailableAgents.length > 0) {
            list = list.concat(nonAvailableAgents.sort((a, b) => a?.queueName?.localeCompare(b?.queueName)));
        }

        return list;
    }

    const list = useMemo(() => {
        if (!!searchTerm) {
            return internalContacts.filter(a => a.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        return sort(internalContacts);
    }, [searchTerm, internalContacts]);

    if (isLoading) {
        return <Spinner fullScreen={true} />
    }

    if (isError) {
        return <div className='w-full h-full body3-medium justify-center flex flex-row'>{t('ccp.extensions_context.error_loading_extensions')}</div>
    }

    return <div className='flex flex-col'>
        <div className='h7 h-12 px-6 border-b flex items-center'>
            {t('ccp.extensions_context.title')}
        </div>
        {displayDescription && <div className='extensions-click-to-call body2 h-10 flex items-center px-4 justify-between'>
            {t('ccp.extensions_context.click_to_dial')}
            <div className='cursor-pointer' onClick={() => setDisplayDescription(false)}><SvgIcon type={Icon.Close} className='icon-small' /></div>
        </div>}
        <SearchInputField onChange={(value) => setSearchTerm(value)} />
        <div className={`overflow-y-auto ${displayDescription ? 'max-h-with-desc' : 'max-h-no-desc'}`}>
            <div className='flex flex-col'>
                {list.map((queue, index) => {
                    return <div key={index} className='border-b h-14 flex items-center px-4 cursor-pointer' onDoubleClick={() => onDoubleClick(queue)}>
                        <div className='flex flex-row space items-center'>
                            <Avatar displayStatus={true} userId={queue.userId} userPicture={queue.user?.profilePicture} userFullName={queue.displayName}
                                    enlargedStatusDot={true} />
                            <div className='pl-4 body3'>{queue.displayName}</div>
                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className='h-6' />
    </div>
}

export default ExtensionsContext;
