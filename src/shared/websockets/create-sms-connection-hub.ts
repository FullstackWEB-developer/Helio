import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import RealTimeConnectionLogger from './real-time-connection-logger';
import utils from '@shared/utils/utils';

export const createSmsConnectionHub = (accessToken?: string): HubConnection => {
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    const provideIncomingSmsHubUrl = () => {
        return `${utils.getAppParameter('RealtimeEventsEndpoint')}incoming-sms`;
    }

    return new HubConnectionBuilder()
        .withUrl(provideIncomingSmsHubUrl(), {
            accessTokenFactory: !!accessToken ? () => accessToken : undefined
        })
        .withAutomaticReconnect()
        .configureLogging(realtimeConnectionLogger)
        .build();
};
