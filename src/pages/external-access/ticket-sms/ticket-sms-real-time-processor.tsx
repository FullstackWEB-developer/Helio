import {ChannelTypes} from '@shared/models';
import TicketSms from '@pages/external-access/ticket-sms/ticket-sms';
import RealtimeTicketMessageProcessor
    from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-processor';
import RealtimeTicketMessageProvider
    from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-context';

const TicketSmsRealTimeProcessor = () => {
    return <RealtimeTicketMessageProvider>
        <RealtimeTicketMessageProcessor type={ChannelTypes.SMS}/>
        <TicketSms/>
    </RealtimeTicketMessageProvider>
}



export default TicketSmsRealTimeProcessor;
