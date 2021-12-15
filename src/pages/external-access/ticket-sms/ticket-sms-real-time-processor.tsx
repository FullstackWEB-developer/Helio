import React, {useEffect, useMemo, useState} from 'react';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from '@microsoft/signalr';
import RealTimeConnectionLogger from '@shared/websockets/real-time-connection-logger';
import {useDispatch, useSelector} from 'react-redux';
import {ChannelTypes} from '@shared/models';
import TicketSms from '@pages/external-access/ticket-sms/ticket-sms';
import {setMarkAsRead} from '@pages/external-access/ticket-sms/store/ticket-sms.slice';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import utils from '@shared/utils/utils';
import {useMutation} from 'react-query';
import {markRead} from '@pages/sms/services/ticket-messages.service';
import usePageVisibility from '@shared/hooks/usePageVisibility';
import {selectTicketSmsMarkAsRead} from '@pages/external-access/ticket-sms/store/ticket-sms.selectors';

const TicketSmsRealTimeProcessor = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const request = useSelector(selectRedirectLink);
    const markAsRead = useSelector(selectTicketSmsMarkAsRead);
    const dispatch = useDispatch();
    const isPageVisible = usePageVisibility();
    const [lastMessageTime, setLastMessageTime] = useState<Date>();
    const realtimeConnectionLogger = useMemo(() => {
        return new RealTimeConnectionLogger();
    }, []);

    useEffect(() => {
        const hubUrl =`${utils.getAppParameter('RealtimeEventsEndpoint')}ticket-sms?ticketId=${request.ticketId}`;
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(realtimeConnectionLogger)
            .build();

        setConnection(newConnection);
    }, [request.ticketId, realtimeConnectionLogger]);

    const markReadMutation = useMutation(({ticketId, channel}: {ticketId: string, channel: ChannelTypes}) => markRead(ticketId, channel));

    useEffect(() => {
        if (markAsRead && isPageVisible) {
            markReadMutation.mutate({
                ticketId: request.ticketId,
                channel: ChannelTypes.SMS
            });
            dispatch(setMarkAsRead(false));
        }
    }, [markAsRead, isPageVisible, markReadMutation, request.ticketId, dispatch])

    useEffect(() => {
        if (connection && connection.state === HubConnectionState.Disconnected) {
            connection.start()
                .then(_ => {
                    connection.on('TicketSmsReceived', () => {
                        setLastMessageTime(new Date());
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketSms Hub failed: ${error}.`))
        }

        return () => {
            connection?.stop();
        }

    }, [connection, realtimeConnectionLogger, dispatch]);
    return <TicketSms lastMessageTime={lastMessageTime}/>;
}

export default TicketSmsRealTimeProcessor;
