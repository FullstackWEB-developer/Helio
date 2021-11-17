import React from 'react';
import TicketSmsRealTimeProcessor from '@pages/external-access/ticket-sms/ticket-sms-real-time-processor';
import TicketSms from '@pages/external-access/ticket-sms/ticket-sms';

const RealtimeTicketSms = () => {

    return <>
        <TicketSms />
        <TicketSmsRealTimeProcessor/>
    </>
}

export default RealtimeTicketSms;
