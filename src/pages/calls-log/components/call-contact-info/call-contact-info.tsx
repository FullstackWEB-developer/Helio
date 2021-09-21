import AvatarLabel from '@components/avatar-label';
import SvgIcon, {Icon} from '@components/svg-icon';
import {CommunicationDirection} from '@shared/models';
import utils from '@shared/utils/utils';
import {TicketLogModel} from '../../../../shared/models/ticket-log.model';
import CallContactAgentInfo from './call-contact-agent-info';

interface CallContactInfoProps {
    value: TicketLogModel;
    type: 'from' | 'to'
}

export const CallContactInfo = ({value, type}: CallContactInfoProps) => {
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
                        agentId={value.assigneeUser}
                    />
                </span>
            }
        </>
    );
}

