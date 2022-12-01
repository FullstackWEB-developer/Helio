import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import { setUnreadTeamEmail } from "@pages/email/store/email-slice";
import { setUnreadTeamSms } from "@pages/sms/store/sms.slice";
import { TeamBadgeValue } from "@pages/tickets/models/team-badge-values.model";
import { setUnreadTeamTicket } from "@pages/tickets/store/tickets.slice";
import {selectAccessToken} from "@shared/store/app-user/appuser.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from "./real-time-connection-logger";

const TeamBadgeValueUpdate = () => {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    useEffect(() => {
        const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}ticket/team-badge-value-update`;
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
                    connection.on('ReceiveTeamBadgeValueUpdateEvent', (data: TeamBadgeValue) => {
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
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketMessageReadHub failed: ${error}.`))
        }
        return () => {
            connection?.stop();
        }

    }, [connection]);

    return null;
}

export default TeamBadgeValueUpdate;
