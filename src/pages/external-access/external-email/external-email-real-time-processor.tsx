import React from 'react';
import ExternalEmail from '@pages/external-access/external-email/external-email';
import RealtimeTicketMessageProvider
    from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-context';
import RealtimeTicketMessageProcessor
    from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-processor';
import {ChannelTypes} from '@shared/models';

const ExternalEmailRealtimeProcessor = () => {
    return <RealtimeTicketMessageProvider>
            <RealtimeTicketMessageProcessor type={ChannelTypes.Email}/>
            <ExternalEmail />
        </RealtimeTicketMessageProvider>
}

export default ExternalEmailRealtimeProcessor;
