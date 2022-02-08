import React, {createContext, ReactNode, useState} from 'react';
import {
    RealtimeTicketMessageContextType
} from '@pages/external-access/realtime-ticket-message-context/models/realtime-ticket-message-context-type';

export const RealtimeTicketMessageContext = createContext<RealtimeTicketMessageContextType | null>(null);

const RealtimeTicketMessageProvider =({children}: {children: ReactNode}) => {
    const [lastMessageDate, setLastMessageDate] = useState<Date>();

    return (<RealtimeTicketMessageContext.Provider value={{
                lastMessageDate,
                setLastMessageDate
            }}>
            {children}
        </RealtimeTicketMessageContext.Provider>)
}
export default RealtimeTicketMessageProvider;
