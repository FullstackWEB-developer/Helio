import React, {useContext, useEffect, useMemo, useState} from 'react';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from '@microsoft/signalr';
import RealTimeConnectionLogger from '@shared/websockets/real-time-connection-logger';
import {useDispatch, useSelector} from 'react-redux';
import {ChannelTypes, TicketMessagesDirection} from '@shared/models';
import {setMarkAsRead} from '@pages/external-access/ticket-sms/store/ticket-sms.slice';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import utils from '@shared/utils/utils';
import {useMutation} from 'react-query';
import {markRead} from '@pages/sms/services/ticket-messages.service';
import usePageVisibility from '@shared/hooks/usePageVisibility';
import {selectTicketSmsMarkAsRead} from '@pages/external-access/ticket-sms/store/ticket-sms.selectors';
import {
    RealtimeTicketMessageContext
} from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-context';

export interface RealtimeTicketMessageProcessorProps {
    type : ChannelTypes.Email | ChannelTypes.SMS;
}

const RealtimeTicketMessageProcessor = ({type} : RealtimeTicketMessageProcessorProps) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const request = useSelector(selectRedirectLink);
    const markAsRead = useSelector(selectTicketSmsMarkAsRead);
    const dispatch = useDispatch();
    const isPageVisible = usePageVisibility();
    const {setLastMessageDate} = useContext(RealtimeTicketMessageContext)!;

    const realtimeConnectionLogger = useMemo(() => {
        return new RealTimeConnectionLogger();
    }, []);

    useEffect(() => {
        if (request?.ticketId) {
            const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}ticket-message?ticketId=${request.ticketId}`;
            const newConnection = new HubConnectionBuilder()
                .withUrl(hubUrl)
                .withAutomaticReconnect()
                .configureLogging(realtimeConnectionLogger)
                .build();

            setConnection(newConnection);
        }
    }, [request?.ticketId, realtimeConnectionLogger]);

    const markReadMutation = useMutation(({ticketId, channel}: {ticketId: string, channel: ChannelTypes}) => markRead(ticketId, channel, TicketMessagesDirection.Outgoing));

    useEffect(() => {
        if (markAsRead && isPageVisible) {
            markReadMutation.mutate({
                ticketId: request.ticketId,
                channel: type
            });
            dispatch(setMarkAsRead(false));
        }
    }, [markAsRead, isPageVisible, markReadMutation, request.ticketId, dispatch])

    useEffect(() => {
        if (connection && connection.state === HubConnectionState.Disconnected) {
            connection.start()
                .then(_ => {
                    connection.on('TicketMessageReceived', () => {
                        setLastMessageDate(new Date());
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketMessage Hub failed: ${error}.`))
        }

        return () => {
            connection?.stop();
        }

    }, [connection, realtimeConnectionLogger, dispatch]);

    return null;
}

export default RealtimeTicketMessageProcessor;
