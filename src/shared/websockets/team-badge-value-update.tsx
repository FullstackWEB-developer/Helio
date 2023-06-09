import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import { setUnreadTeamEmail } from "@pages/email/store/email-slice";
import { setUnreadTeamSms } from "@pages/sms/store/sms.slice";
import { TeamBadgeValue } from "@pages/tickets/models/team-badge-values.model";
import { setUnreadTeamTicket } from "@pages/tickets/store/tickets.slice";
import { refreshAccessToken } from "@shared/services/api";
import {selectAccessToken} from "@shared/store/app-user/appuser.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from "./real-time-connection-logger";

const TeamBadgeValueUpdate = () => {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const realtimeConnectionLogger = new RealTimeConnectionLogger();
    useEffect(() => {
        const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}ticket/team-badge-value-update`;
        const newConnection = new HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: async () => await refreshAccessToken(),
          })
          .withAutomaticReconnect({
              nextRetryDelayInMilliseconds: (retryContext) => {
                  realtimeConnectionLogger.log(LogLevel.Error, `Reconnecting to TeamBadgeValueUpdate Websocket: ${JSON.stringify(retryContext?.retryReason)}.`);
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
                    realtimeConnectionLogger.log(LogLevel.Error, `Connection to TeamBadgeValueUpdate Websocket succeeded.`);
                    connection.on('ReceiveTeamBadgeValueUpdateEvent', (data: TeamBadgeValue) => {
                        realtimeConnectionLogger.log(LogLevel.Error, `New Message Received From TeamBadgeValueUpdate Websocket ${JSON.stringify(data)}`);
                        if(data.emailCount !== undefined && data.emailCount >= 0){
                            dispatch(setUnreadTeamEmail(data.emailCount));
                        }

                        if(data.smsCount !== undefined && data.smsCount >= 0){
                            dispatch(setUnreadTeamSms(data.smsCount));
                        }

                        if(data.ticketCount !== undefined && data.ticketCount >= 0){
                            dispatch(setUnreadTeamTicket(data.ticketCount));
                        }
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to TeamBadgeValueUpdate failed: ${error}.`));

            connection.onclose(error => {
                if (error) {
                    realtimeConnectionLogger.log(LogLevel.Error, `Connection to TeamBadgeValueUpdate failed: ${JSON.stringify(error)}.`)
                }
            });
        }
        return () => {
            connection?.stop();
        }

    }, [connection]);

    return null;
}

export default TeamBadgeValueUpdate;
