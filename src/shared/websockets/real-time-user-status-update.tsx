import {useEffect, useState} from 'react';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import {useDispatch, useSelector} from 'react-redux';
import {useQueryClient} from 'react-query';
import {selectAccessToken, selectAppUserDetails} from '../store/app-user/appuser.selectors';
import {UserStatusUpdate} from '@shared/models';
import {QuickConnectExtension} from '@shared/models';
import RealTimeConnectionLogger from './real-time-connection-logger';
import {QueryQuickConnects} from '@constants/react-query-constants';
import {addLiveAgentStatus, updateUserStatus} from '@shared/store/app-user/appuser.slice';
import {updateLatestUsersStatusUpdateTime} from '@shared/layout/store/layout.slice';
import utils from '@shared/utils/utils';

const RealTimeUserStatusUpdate = () => {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const userId = useSelector(selectAppUserDetails)?.id;
    const queryClient = useQueryClient();

    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    useEffect(() => {
        const hubUrl = provideQuickConnectStatusHubUrl();
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
                        dispatch(updateLatestUsersStatusUpdateTime());
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to UserStatusChangeHub failed: ${error}.`))
        }

        return () => {
            connection?.stop();
        }

    }, [connection]);

    const provideQuickConnectStatusHubUrl = () => {
        return `${utils.getAppParameter('RealtimeEventsEndpoint')}user-status-update`;
    }

    const propagateStatusChangeValue = (statusChange: UserStatusUpdate) => {
        if (statusChange.userId === userId) {
            dispatch(updateUserStatus(statusChange.status));
        }
        dispatch(addLiveAgentStatus(statusChange));
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
