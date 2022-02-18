import {SmsNotificationData} from '@pages/sms/models';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSignalRConnectionContext} from '../contexts/signalRContext';
import {ChannelTypes, TicketMessagesDirection} from '@shared/models';
import {appendUnreadEmailTicketId, setLastEmailDate} from '@pages/email/store/email-slice';
import {appendUnreadSmsTicketId, setLastSmsDate} from '@pages/sms/store/sms.slice';
import {QueryTicketMessagesInfinite} from '@constants/react-query-constants';
import {useQueryClient} from 'react-query';

const IncomingTicketMessageUpdate = () => {

    const {smsIncoming} = useSignalRConnectionContext();
    const dispatch = useDispatch();
    const client = useQueryClient();
    useEffect(() => {
        if (!smsIncoming) {
            return () => { };
        }

        smsIncoming.on('ReceiveSmsMessage', onTicketMessageReceived);
        return () => {
            smsIncoming?.off('ReceiveSmsMessage', onTicketMessageReceived);
        }
    }, [smsIncoming]);

    const refreshCache = (channel: ChannelTypes, id: string) => {
        client.invalidateQueries([QueryTicketMessagesInfinite, channel, id], {
            exact: true
        }).then();
            }

    const onTicketMessageReceived = (data: SmsNotificationData) => {
        if (data.messageDirection === TicketMessagesDirection.Incoming && data.channelId === ChannelTypes[ChannelTypes.SMS]) {
            dispatch(appendUnreadSmsTicketId(data.ticketId));
            dispatch(setLastSmsDate());
            refreshCache(ChannelTypes.SMS, data.ticketId);
        } else if (data.messageDirection === TicketMessagesDirection.Incoming && data.channelId === ChannelTypes[ChannelTypes.Email]) {
            dispatch(appendUnreadEmailTicketId(data.ticketId));
            dispatch(setLastEmailDate());
            refreshCache(ChannelTypes.Email, data.ticketId);
        }
    }
    return null;
}

export default IncomingTicketMessageUpdate;
