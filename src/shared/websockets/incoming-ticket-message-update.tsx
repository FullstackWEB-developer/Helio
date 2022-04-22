import {SmsNotificationData} from '@pages/sms/models';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSignalRConnectionContext} from '../contexts/signalRContext';
import {ChannelTypes, TicketMessagesDirection} from '@shared/models';
import {setLastEmailDate} from '@pages/email/store/email-slice';
import {setLastSmsDate} from '@pages/sms/store/sms.slice';
import {QueryTicketMessagesInfinite} from '@constants/react-query-constants';
import { TicketAssignedNotification } from '@pages/tickets/models/ticket-assigned-notification.model';
import {useQueryClient} from 'react-query';
import { getBadgeValues } from '@pages/tickets/services/tickets.service';
import { BadgeValues } from '@pages/tickets/models/badge-values.model';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';

const IncomingTicketMessageUpdate = () => {

    const {smsIncoming} = useSignalRConnectionContext();
    const dispatch = useDispatch();
    const client = useQueryClient();
    const currentUser = useSelector(selectAppUserDetails);
    useEffect(() => {
        if (!smsIncoming) {
            return () => { };
        }

        smsIncoming.on('ReceiveSmsMessage', onTicketMessageReceived);
        smsIncoming.on('ReceiveBadgeValueUpdateEvent', onReceiveBadgeValueUpdateEvent);
        return () => {
            smsIncoming?.off('ReceiveSmsMessage', onTicketMessageReceived);
            smsIncoming?.off('ReceiveBadgeValueUpdateEvent', onReceiveBadgeValueUpdateEvent);
        }
    }, [smsIncoming]);

    const refreshCache = (channel: ChannelTypes, id: string) => {
        client.invalidateQueries([QueryTicketMessagesInfinite, channel, id], {
            exact: true
        }).then();
    }

    const onTicketMessageReceived = (data: SmsNotificationData) => {
        if (data.messageDirection === TicketMessagesDirection.Incoming && data.channelId === ChannelTypes[ChannelTypes.SMS]) {
            dispatch(getBadgeValues(BadgeValues.SMSOnly))
            dispatch(setLastSmsDate());
            refreshCache(ChannelTypes.SMS, data.ticketId);
        } else if (data.messageDirection === TicketMessagesDirection.Incoming && data.channelId === ChannelTypes[ChannelTypes.Email]) {
            dispatch(getBadgeValues(BadgeValues.EmailOnly))
            dispatch(setLastEmailDate());
            refreshCache(ChannelTypes.Email, data.ticketId);
        }
    }

    const onReceiveBadgeValueUpdateEvent = (data: TicketAssignedNotification) => {
        if(data.fromUser === currentUser.id || data.toUser === currentUser.id){
            dispatch(getBadgeValues(BadgeValues.All))
        }
    }
    return null;
}

export default IncomingTicketMessageUpdate;
