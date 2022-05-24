import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import { TicketNotesUpdateModal } from "@pages/tickets/models/ticket-notes-update.model";
import {selectAccessToken} from "@shared/store/app-user/appuser.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from "./real-time-connection-logger";
import { setTicket } from '@pages/tickets/store/tickets.slice';
import { getTicketById } from '@pages/tickets/services/tickets.service';
import { setBotContextTicket } from '@pages/ccp/store/ccp.slice';
import {selectSelectedTicket} from '@pages/tickets/store/tickets.selectors';
import { selectBotContext } from '@pages/ccp/store/ccp.selectors';
const TicketNotesUpdate = () => {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const ticket = useSelector(selectSelectedTicket);
    const ccpTicket = useSelector(selectBotContext);
    const [ticketId, setTicketId] = useState<string>();
    const [ccpTicketId, setCcpTicketId] = useState<string>();
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

    useEffect(() => {
        if (!!ticket && ticket.id !== ticketId) {
            setTicketId(ticket.id);
        }
        if (!!ccpTicket && ccpTicket.ticket?.id !== ccpTicketId) {
            setCcpTicketId(ccpTicket.ticket?.id);
        }
    }, [ccpTicket, ticket]);

    useEffect(() => {
        const hubUrl = `${utils.getAppParameter('RealtimeEventsEndpoint')}ticket/ticket-notes-update`;
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl,
                {
                    accessTokenFactory: () => accessToken
                })
            .withAutomaticReconnect()
            .configureLogging(realtimeConnectionLogger)
            .build();

        setConnection(newConnection);
    }, [ticketId, ccpTicketId]);

    useEffect(() => {
        if(connection?.state === HubConnectionState.Connected){
            return;
        }
        if (connection) {
            connection.start()
                .then(_ => {
                    connection.on('TicketNoteUpdateEventHub', (webSocketData: TicketNotesUpdateModal) => {
                        if(ticketId === webSocketData.ticketId || ccpTicketId === webSocketData.ticketId){
                            getTicketById(webSocketData.ticketId).then((data) => {
                                if(ticketId === webSocketData.ticketId){
                                    dispatch(setTicket(data))
                                }
                                if(ccpTicketId === webSocketData.ticketId){
                                    dispatch(setBotContextTicket({
                                        ticket: data
                                    }));
                                }
                            })
                        }
                    });
                })
                .catch(error => realtimeConnectionLogger.log(LogLevel.Error, `Connection to TicketMessageReadHub failed: ${error}.`))
        }
        return () => {
            connection?.stop();
        }

    }, [connection, ticketId, ccpTicketId]);

    return null;
}

export default TicketNotesUpdate;
