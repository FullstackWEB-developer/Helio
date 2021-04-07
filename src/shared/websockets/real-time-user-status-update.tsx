import React, { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { selectAccessToken } from '../store/app-user/appuser.selectors';
import { UserStatusUpdate } from '../models/user-status-update.model';
import { QuickConnectExtension } from '../models/quick-connect-extension';
import RealTimeConnectionLogger from './real-time-connection-logger';
import { QueryQuickConnects } from '@constants/react-query-constants';

const RealTimeUserStatusUpdate = () => {

    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const queryClient = useQueryClient();

    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    useEffect(() => {

        const hubUrl = provideQuickconnectStatusHubUrl();
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl,
                {
                    accessTokenFactory: () => accessToken
                })
            .withAutomaticReconnect()
            .configureLogging(realtimeConnectionLogger)
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {

                    connection.on('UserStatusChange', (data: UserStatusUpdate) => {
                        propagateStatusChangeValue(data);
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to UserStatusChangeHub failed: ${error}.`))
        }

        return () => {
            connection?.stop();
        }

    }, [connection]);

    const provideQuickconnectStatusHubUrl = () => {
        const envHubEndpoint = process?.env?.REACT_APP_REALTIME_EVENTS_ENDPOINT;
        if (!envHubEndpoint) {
            const errorMessage = "REACT_APP_REALTIME_EVENTS_ENDPOINT variable missing from .env. Please check and ensure it is provided!";
            realtimeConnectionLogger.log(LogLevel.Error, errorMessage);
        }
        return `${process.env.REACT_APP_REALTIME_EVENTS_ENDPOINT}user-status-update`;
    }

    const propagateStatusChangeValue = (statusChange: UserStatusUpdate) => {

        const quickConnects: QuickConnectExtension[] = queryClient.getQueryData(QueryQuickConnects) ?? [];
        const index = quickConnects.findIndex(qc => qc.id === statusChange.userId);
        if (index !== -1) {
            quickConnects[index] = {
                ...quickConnects[index],
                latestConnectStatus: statusChange.status
            }

            queryClient.setQueryData(QueryQuickConnects, quickConnects);
        }
    }

    return null;
}



export default RealTimeUserStatusUpdate;