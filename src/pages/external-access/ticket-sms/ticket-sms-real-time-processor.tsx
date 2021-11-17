import React, {useEffect, useMemo, useState} from 'react';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from '@microsoft/signalr';
import RealTimeConnectionLogger from '@shared/websockets/real-time-connection-logger';
import {useDispatch, useSelector} from 'react-redux';
import {ChannelTypes, TicketMessage} from '@shared/models';
import TicketSms from '@pages/external-access/ticket-sms/ticket-sms';
import {pushTicketSmsMessage} from '@pages/external-access/ticket-sms/store/ticket-sms.slice';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import utils from '@shared/utils/utils';
import {useMutation} from 'react-query';
import {markRead} from '@pages/sms/services/ticket-messages.service';
import usePageVisibility from '@shared/hooks/usePageVisibility';

const TicketSmsRealTimeProcessor = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const request = useSelector(selectRedirectLink);
    const dispatch = useDispatch();
    const isPageVisible = usePageVisibility();
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

    const setReadIfOpen = () => {
        console.log("Isvis:" + isPageVisible);
        if (isPageVisible) {
            markReadMutation.mutate({
                ticketId: request.ticketId,
                channel: ChannelTypes.SMS
            });
        }
    }

    useEffect(() => {
        if (connection && connection.state === HubConnectionState.Disconnected) {
            connection.start()
                .then(_ => {
                    connection.on('TicketSmsReceived', (message: TicketMessage) => {
                        dispatch(pushTicketSmsMessage(message));
                        setReadIfOpen();
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketSms Hub failed: ${error}.`))
        }

        return () => {
            connection?.stop();
        }

    }, [connection, realtimeConnectionLogger]);
    return <TicketSms />;
}

export default TicketSmsRealTimeProcessor;
