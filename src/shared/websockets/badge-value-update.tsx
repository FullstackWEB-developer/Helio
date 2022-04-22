import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import { BadgeValues } from "@pages/tickets/models/badge-values.model";
import { TicketAssignedNotification } from "@pages/tickets/models/ticket-assigned-notification.model";
import { getBadgeValues } from "@pages/tickets/services/tickets.service";
import {selectAccessToken, selectAppUserDetails} from "@shared/store/app-user/appuser.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from "./real-time-connection-logger";

const BadgeValueUpdate = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectAppUserDetails);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    useEffect(() => {
        const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}ticket/badge-value-update`;
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
                    connection.on('ReceiveBadgeValueUpdateEvent', (data: TicketAssignedNotification) => {
                        if(data.fromUser === currentUser.id || data.toUser === currentUser.id)
                        {
                            dispatch(getBadgeValues(BadgeValues.All))
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

export default BadgeValueUpdate;