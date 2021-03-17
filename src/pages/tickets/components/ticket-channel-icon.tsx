import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { Ticket } from '../models/ticket';
import { ChannelTypes } from '../models/ticket-channel';
import { ReactComponent as ChatIcon } from '../../../shared/icons/Icon-Channel-Chat-48px.svg';
import { ReactComponent as PhoneIcon } from '../../../shared/icons/Icon-Channel-Phone-48px.svg';
import { ReactComponent as WebIcon } from '../../../shared/icons/Icon-Channel-Web-48px.svg';
import { ReactComponent as SmsIcon } from '../../../shared/icons/Icon-Channel-SMS-48px.svg';

interface TicketChannelIconProps {
    ticket: Ticket
}

const TicketChannelIcon = ({ ticket }: TicketChannelIconProps) => {
    switch (ticket.channel) {
        case ChannelTypes.Chat:
            return <ChatIcon />;
        case ChannelTypes.PhoneCall:
            return <PhoneIcon />;
        case ChannelTypes.WebSite:
            return <WebIcon />;
        case ChannelTypes.UserCreated:
            return <SmsIcon />;
        default:
            return <ChatIcon />;
    }
}

export default withErrorLogging(TicketChannelIcon);
