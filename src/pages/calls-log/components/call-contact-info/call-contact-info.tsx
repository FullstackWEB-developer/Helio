import {CommunicationDirection} from '@shared/models';
import utils from '@shared/utils/utils';
import {TicketLogModel} from '@shared/models/ticket-log.model';
import CallContactAgentInfo from './call-contact-agent-info';
import {useSelector} from 'react-redux';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import AvatarLabel from '@components/avatar-label';

interface CallContactInfoProps {
    value: TicketLogModel;
    type: 'from' | 'to'
}

export const CallContactInfo = ({value, type}: CallContactInfoProps) => {
    const userList = useSelector(selectUserList);

    if (value.communicationDirection === CommunicationDirection.Internal) {
        let user= userList.find(a => a.id === (type === 'from' ? value.fromUserId : value.toUserId));
        if(user) {
            return <AvatarLabel firstName={user.firstName}
                                lastName={user.lastName}/>
        }
    }

    return (
        <>
            {
                ((type === 'from' && value.communicationDirection === CommunicationDirection.Inbound) ||
                    (type === 'to' && value.communicationDirection === CommunicationDirection.Outbound)
                ) &&
                <span className='body2'>
                    {value.createdForName ?? utils.applyPhoneMask(value.originationNumber)}
                </span>
            }
            {
                ((type === 'to' && value.communicationDirection === CommunicationDirection.Inbound) ||
                    (type === 'from' && value.communicationDirection === CommunicationDirection.Outbound)
                ) &&
                <span>
                    <CallContactAgentInfo
                        type='VOICE'
                        agentId={value.assigneeUser}
                    />
                </span>
            }
        </>
    );
}

