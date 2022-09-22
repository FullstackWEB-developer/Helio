import Avatar from '@components/avatar';
import {InternalQueueStatus} from '@pages/ccp/models/internal-queue-status';
import {setInternalCallDetails} from '@pages/ccp/store/ccp.slice';
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {selectAppUserDetails, selectLiveAgentStatuses} from '@shared/store/app-user/appuser.selectors';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import React, {useMemo} from 'react';
import SvgIcon, {Icon} from '@components/svg-icon';
import TooltipWrapper from '@components/tooltip/tooltip-wrapper';
import './internal-contact-item.scss';
import {useTranslation} from 'react-i18next';

export interface InternalContactItemProps {
    queue: InternalQueueStatus;
}
export const InternalContactItem = ({queue} : InternalContactItemProps) => {

    const users = useSelector(selectUserList);
    const currentUser = useSelector(selectAppUserDetails);
    const voiceCounter = useSelector(selectVoiceCounter);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const liveAgentStatuses = useSelector(selectLiveAgentStatuses);
    const liveAgentInfo = liveAgentStatuses?.find(a => a.userId === queue.userId);

    const startQuickConnect = (contact: InternalQueueStatus) => {
        const endPoint = {
            type: contact.quickConnectEndPoint.type,
            queue: contact.quickConnectEndPoint.queue,
            name: contact.quickConnectEndPoint.name,
            agentLogin: null,
            phoneNumber: null,
            endpointId: contact.quickConnectEndPoint.endpointId,
            endpointARN: contact.quickConnectEndPoint.endpointARN
        };
        window.CCP?.contact?.addConnection(endPoint as any);
    }

    const startInternalCall = (contact: InternalQueueStatus) => {
        const dialingUser = users.find(u => u.id == contact.userId);
        dispatch(setInternalCallDetails({
            type: contact.queueType,
            fromUserId: currentUser.id,
            queueArn: contact.queueArn,
            toUserId: contact.userId,
            diallingUserFullname: dialingUser ? `${dialingUser.firstName} ${dialingUser.lastName}` : ''
        }));
        let phone = utils.getAppParameter("InternalCallPhoneNumber");
        utils.initiateACall(phone);
    }

    const onDoubleClick = (contact: InternalQueueStatus) => {
        if (voiceCounter > 0) {
            startQuickConnect(contact);
        } else {
            startInternalCall(contact);
        }
    }

    const ChatIcon = () => {
        return <div  className='flex justify-center items-center h-10 w-10 rounded-full internal-contact-chat-icon'>
            <SvgIcon fillClass='white-icon' type={Icon.Chat}/>
        </div>;
    }

    const CallIcon = () => {
        return <div className='flex justify-center items-center h-10 w-10 rounded-full internal-contact-call-icon'>
            <SvgIcon fillClass='white-icon' type={Icon.Phone}/>
        </div>;
    }

    const renderIcons = () => {
        let items: JSX.Element[] = [];
        if (!liveAgentInfo) {
            return;
        }
        if (liveAgentInfo.calls && liveAgentInfo.calls.length > 0) {
            items = liveAgentInfo.calls.map(item => {
                return <TooltipWrapper placement='top' content={utils.formatPhone(item.customerData)}>
                    <CallIcon />
                </TooltipWrapper>
            })
        }
        if (liveAgentInfo.chats && liveAgentInfo.chats.length > 0) {
            items = items.concat(liveAgentInfo.chats.map(item => {
                return <TooltipWrapper placement='top' content={item.customerData}>
                    <ChatIcon />
                </TooltipWrapper>
            }));
        }

        return items;
    }

    const getAgentNote = useMemo(() => {
        if (!liveAgentInfo) {
            return;
        }
        if (liveAgentInfo.chats && liveAgentInfo.chats.length > 0 && liveAgentInfo.calls && liveAgentInfo.calls.length > 0) {
            return 'ccp.extensions_context.cannot_redirect_chats_calls';
        }
        if (liveAgentInfo.chats && liveAgentInfo.chats.length > 0) {
            return 'ccp.extensions_context.cannot_redirect_calls';
        }
        if ( liveAgentInfo.calls && liveAgentInfo.calls.length > 0) {
            return 'ccp.extensions_context.cannot_redirect_chats_calls';
        }
    }, [liveAgentInfo]);

    return <div className='border-b h-14 flex items-center px-4 cursor-pointer' onDoubleClick={() => onDoubleClick(queue)}>
        <div className='flex flex-row justify-between w-full'>
            <div className='flex flex-row space items-center'>
                <Avatar displayStatus={true} userId={queue.userId} userPicture={queue.user?.profilePicture} userFullName={queue.displayName}
                        enlargedStatusDot={true} />
                <div className='flex flex-col pl-4 body3'>
                    <div>
                        {queue.displayName}
                    </div>
                    {getAgentNote && <div className='body3-small'>
                        {t(getAgentNote)}
                    </div>}
                </div>
            </div>
            <div className='flex flex-row space-x-2'>
                {renderIcons()}
            </div>
        </div>
    </div>;
}

export default InternalContactItem;
