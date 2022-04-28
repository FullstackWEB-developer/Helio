import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import { TicketNotesUpdateModal } from "@pages/tickets/models/ticket-notes-update.model";
import {selectAccessToken} from "@shared/store/app-user/appuser.selectors";
import utils from "@shared/utils/utils";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import RealTimeConnectionLogger from "./real-time-connection-logger";
import { setTicket } from '../../pages/tickets/store/tickets.slice';
import { getTicketById } from '../../pages/tickets/services/tickets.service';
import { setBotContextTicket } from '../../pages/ccp/store/ccp.slice';
import {selectSelectedTicket} from '@pages/tickets/store/tickets.selectors';
import { selectCurrentContactId } from '@pages/ccp/store/ccp.selectors';
const TicketNotesUpdate = () => {
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const accessToken = useSelector(selectAccessToken);
    const ticket = useSelector(selectSelectedTicket);
    const ccpTicket = useSelector(selectCurrentContactId);
    const realtimeConnectionLogger = new RealTimeConnectionLogger();

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
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {
                    connection.on('TicketNoteUpdateEventHub', (data: TicketNotesUpdateModal) => {
                        if(ticket.id === data.ticketId || ccpTicket === data.ticketId){
                            getTicketById(data.ticketId).then((data) => {
                                if(ticket.id === data.ticketId){
                                    dispatch(setTicket(data))
                                }
                                
                                if(ccpTicket === data.ticketId){
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

    }, [connection]);

    return null;
}

export default TicketNotesUpdate;