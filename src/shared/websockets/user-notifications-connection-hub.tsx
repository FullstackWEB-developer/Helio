import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import {selectAccessToken, selectAppUserDetails} from "@shared/store/app-user/appuser.selectors";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from "./real-time-connection-logger";
import {UserNotificationMessage} from '@shared/models/user-notification-message';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {ContactTransferUnavailableMessage} from '@shared/models/contact-transfer-unavailable-message.model';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components/svg-icon';
import utils from '@shared/utils/utils';
import {setMyCallbackTicketCount, setTeamCallbackTicketCount} from '@pages/tickets/store/tickets.slice';
import { refreshAccessToken } from "@shared/services/api";

const UserNotificationsConnectionHub = () => {
    const dispatch = useDispatch();
    const appUser = useSelector(selectAppUserDetails);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const realtimeConnectionLogger = new RealTimeConnectionLogger();
    const users  = useSelector(selectUserList);
    const {t} = useTranslation();

    useEffect(() => {
        const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}user-notifications`;

        const newConnection = new HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: async () => await refreshAccessToken(),
          })
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              realtimeConnectionLogger.log(
                LogLevel.Error,
                `Reconnecting to UserNotificationsConnectionHub Websocket: ${JSON.stringify(
                  retryContext?.retryReason
                )}.`
              );
              return 5000;
            },
          })
          .configureLogging(realtimeConnectionLogger)
          .build();
        setConnection(newConnection);

        return () => {
            if (newConnection.state === HubConnectionState.Connected) {
                newConnection?.stop().then()
            }
        }
    }, [accessToken]);

    const agentUnavailable = (data: ContactTransferUnavailableMessage) => {
        let message = '';
        if (appUser.email === data.toUserEmail) {
            if (data.channel === 'CHAT') {
                message = 'ccp.extensions_context.chat_transferred';
            } else if (data.channel === 'VOICE') {
                message = 'ccp.extensions_context.call_transferred';
            }
        } else if (appUser.email === data.fromUserEmail) {
            const toUser = users.find(a => a.email.toLowerCase() === data.toUserEmail.toLowerCase());
            message = t('ccp.extensions_context.transferred_person_not_available', {'userFirstName' : toUser ? toUser.firstName : 'agent'})
        }
        if (!!message) {
            dispatch(addSnackbarMessage({
                message: message,
                type: SnackbarType.Error,
                icon: data.channel === 'CHAT' ? Icon.Chat : Icon.Phone,
                iconFill: data.channel === 'CHAT' ? 'info-icon' : 'success-icon',
                supportRichText: true
            }));
        }
    }

    const callbackTicketCountUpdated = (value: string) => {
        const data = JSON.parse(value);
        if(data.assignedTo === appUser.id) {
            dispatch(setMyCallbackTicketCount(data.count));
        } else if(!data.assignedTo) {
            dispatch(setTeamCallbackTicketCount(data.count));
        }
    }

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {
                    realtimeConnectionLogger.log(LogLevel.Error, `Connection to NewUserNotification Websocket succeeded.`);
                    connection.on('NewUserNotification', (data: UserNotificationMessage) => {
                        realtimeConnectionLogger.log(LogLevel.Error, `New Message Received From UserNotificationsConnectionHub Websocket ${JSON.stringify(data)}`);
                        switch (data.userNotificationType) {
                            case 'AgentUnavailable' :
                                agentUnavailable(data.value);
                                break;
                            case 'CallbackTicketCountUpdated' :
                                callbackTicketCountUpdated(data.value);
                                break;
                        }
                    });
                    connection.onclose(error => {
                        if (error) {
                            realtimeConnectionLogger.log(LogLevel.Error, `Connection to UserNotificationsConnectionHub failed: ${JSON.stringify(error)}.`);
                        }
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to UserNotificationsConnectionHub failed: ${error}.`))
        }
        return () => {
          connection?.stop();
        }

    }, [connection]);

    return null;
}

export default UserNotificationsConnectionHub;
