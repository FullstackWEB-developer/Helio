import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import RealTimeConnectionLogger from './real-time-connection-logger';
import utils from '@shared/utils/utils';

export const createTicketMessageConnectionHub = (accessToken?: string): HubConnection => {
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    const provideTicketMessageHubUrl = () => {
        return `${utils.getAppParameter('RealtimeEventsEndpoint')}incoming-sms`;
    }

    return new HubConnectionBuilder()
        .withUrl(provideTicketMessageHubUrl(), {
            accessTokenFactory: !!accessToken ? () => accessToken : undefined
        })
      .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
              realtimeConnectionLogger.log(LogLevel.Error, `Reconnecting to createTicketMessageConnectionHub Websocket: ${JSON.stringify(retryContext?.retryReason)}.`);
              return 5000;
          }
      })
        .configureLogging(realtimeConnectionLogger)
        .build();
};
