import {SmsNotificationData} from '@pages/sms/models';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSignalRConnectionContext} from '../contexts/signalRContext';
import {ChannelTypes, TicketMessagesDirection} from '@shared/models';
import {setLastEmailDate} from '@pages/email/store/email-slice';
import {setLastSmsDate} from '@pages/sms/store/sms.slice';
import {QueryTicketMessagesInfinite} from '@constants/react-query-constants';
import {useQueryClient} from 'react-query';
import { getBadgeValues } from '@pages/tickets/services/tickets.service';
import { BadgeValues } from '@pages/tickets/models/badge-values.model';
import { LogLevel } from '@microsoft/signalr';
import RealTimeConnectionLogger from '@shared/websockets/real-time-connection-logger';

const IncomingTicketMessageUpdate = () => {

    const realtimeConnectionLogger = new RealTimeConnectionLogger();
    const {smsIncoming} = useSignalRConnectionContext();
    const dispatch = useDispatch();
    const client = useQueryClient();
    useEffect(() => {
        if (!smsIncoming) {
            return () => { };
        }
        const onTicketMessageReceived = (data: SmsNotificationData) => {
            realtimeConnectionLogger.log(LogLevel.Error, `New Message Received From IncomingTicketMessageUpdate Websocket ${JSON.stringify(data)}`);
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

        realtimeConnectionLogger.log(LogLevel.Error, `Connection to IncomingTicketMessageUpdate Websocket succeeded.`);
        smsIncoming.on('ReceiveSmsMessage', onTicketMessageReceived);
        smsIncoming.onclose(error => {
            if (error) {
                realtimeConnectionLogger.log(LogLevel.Error, `Connection to IncomingTicketMessageUpdate failed: ${JSON.stringify(error)}.`);
            }
        });
        return () => {
            smsIncoming?.off('ReceiveSmsMessage', onTicketMessageReceived);
        }
    }, [smsIncoming, realtimeConnectionLogger]);

    const refreshCache = (channel: ChannelTypes, id: string) => {
        client.invalidateQueries([QueryTicketMessagesInfinite, channel, id], {
            exact: true
        }).then();
    }

    return null;
}

export default IncomingTicketMessageUpdate;
