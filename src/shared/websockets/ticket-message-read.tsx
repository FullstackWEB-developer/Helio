import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import { removeUnreadEmailTicketId } from "@pages/email/store/email-slice";
import { removeUnreadSmsTicketId } from "@pages/sms/store/sms.slice";
import { BadgeValues } from "@pages/tickets/models/badge-values.model";
import { getBadgeValues } from "@pages/tickets/services/tickets.service";
import { ChannelTypes } from "@shared/models";
import {selectAccessToken} from "@shared/store/app-user/appuser.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from "./real-time-connection-logger";

const TicketMessageReadUpdate = () => {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    useEffect(() => {
        const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}ticket/marked-as-read`;
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl,
                {
                    accessTokenFactory: () => accessToken
                })
          .withAutomaticReconnect({
              nextRetryDelayInMilliseconds: (retryContext) => {
                  realtimeConnectionLogger.log(LogLevel.Error, `Reconnecting to TicketMessageReadUpdate Websocket: ${JSON.stringify(retryContext?.retryReason)}.`);
                  return 5000;
              }
          })
            .configureLogging(realtimeConnectionLogger)
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {
                    realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketMessageReadUpdate Websocket succeeded.`);
                    connection.on('TicketMessageMarkedRead', (data: any) => {
                        realtimeConnectionLogger.log(LogLevel.Error, `New Message Received From TicketMessageReadUpdate Websocket ${JSON.stringify(data)}`);
                        if (data?.ticketId && data?.channel) {
                            if(data.channel === ChannelTypes.Email){
                                dispatch(removeUnreadEmailTicketId(data.ticketId));
                                dispatch(getBadgeValues(BadgeValues.EmailOnly))
                            }else{
                                dispatch(removeUnreadSmsTicketId(data.ticketId));
                                dispatch(getBadgeValues(BadgeValues.SMSOnly))
                            }
                        }
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketMessageReadUpdate failed: ${error}.`));

            connection.onclose(error => {
                if (error) {
                    realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketMessageReadUpdate failed: ${JSON.stringify(error)}.`)
                }
            });
        }
        return () => {
            connection?.stop();
        }

    }, [connection]);

    return null;
}

export default TicketMessageReadUpdate;
