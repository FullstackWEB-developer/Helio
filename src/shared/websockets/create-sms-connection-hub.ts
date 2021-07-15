import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import RealTimeConnectionLogger from './real-time-connection-logger';

export const createSmsConnectionHub = (accessToken?: string): HubConnection => {
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    const provideIncomingSmsHubUrl = () => {
        const envHubEndpoint = process?.env?.REACT_APP_REALTIME_EVENTS_ENDPOINT;
        if (!envHubEndpoint) {
            const errorMessage = "REACT_APP_REALTIME_EVENTS_ENDPOINT variable missing from .env. Please check and ensure it is provided!";
            realtimeConnectionLogger.log(LogLevel.Error, errorMessage);
        }
        return `${process.env.REACT_APP_REALTIME_EVENTS_ENDPOINT}incoming-sms`;
    }
    const hubUrl = provideIncomingSmsHubUrl();

    return new HubConnectionBuilder()
        .withUrl(hubUrl, {
            accessTokenFactory: !!accessToken ? () => accessToken : undefined
        })
        .withAutomaticReconnect()
        .configureLogging(realtimeConnectionLogger)
        .build();
};
