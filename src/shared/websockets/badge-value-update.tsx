import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import { BadgeValues } from "@pages/tickets/models/badge-values.model";
import { TicketAssignedNotification } from "@pages/tickets/models/ticket-assigned-notification.model";
import { getBadgeValues } from "@pages/tickets/services/tickets.service";
import { refreshAccessToken } from "@shared/services/api";
import {selectAccessToken, selectAppUserDetails} from "@shared/store/app-user/appuser.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from './real-time-connection-logger';

const BadgeValueUpdate = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectAppUserDetails);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    useEffect(() => {
        const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}ticket/badge-value-update`;
        const newConnection = new HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: async () => await refreshAccessToken(),
          })
          .withAutomaticReconnect({
              nextRetryDelayInMilliseconds: (retryContext) => {
                  realtimeConnectionLogger.log(LogLevel.Error, `Reconnecting to ReceiveBadgeValueUpdateEvent Websocket: ${JSON.stringify(retryContext?.retryReason)}.`);
                  return 5000;
              }
          })
            .configureLogging(realtimeConnectionLogger)
            .build();

        setConnection(newConnection);
        return () => {
            newConnection?.stop().then()
        }
    }, [accessToken]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {
                    realtimeConnectionLogger.log(LogLevel.Error, `Connection to ReceiveBadgeValueUpdateEvent Websocket succeeded.`);
                    connection.on('ReceiveBadgeValueUpdateEvent', (data: TicketAssignedNotification) => {
                        realtimeConnectionLogger.log(LogLevel.Error, `New Message Received From ReceiveBadgeValueUpdateEvent Websocket ${JSON.stringify(data)}`);
                        if(data.fromUser === currentUser?.id || data.toUser === currentUser?.id)
                        {
                            dispatch(getBadgeValues(BadgeValues.All))
                        }
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to ReceiveBadgeValueUpdateEvent failed: ${error}.`));

            connection.onclose(error => {
                if (error) {
                    realtimeConnectionLogger.log(LogLevel.Error, `Connection to ReceiveBadgeValueUpdateEvent failed: ${JSON.stringify(error)}.`)
                }
            });
        }
        return () => {
            connection?.stop();
        }

    }, [connection, currentUser?.id, dispatch]);

    return null;
}

export default BadgeValueUpdate;
