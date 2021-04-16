import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { Ticket } from '../models/ticket';
import { ChannelTypes } from '../models/ticket-channel';
import '../tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

interface TicketChannelIconProps {
    ticket: Ticket
}

const TicketChannelIcon = ({ ticket }: TicketChannelIconProps) => {
    switch (ticket.channel) {
        case ChannelTypes.Chat:
            return <SvgIcon type={Icon.ChannelChat} className='x-large' fillClass='channel-icon-fill' strokeClass='channel-icon-stroke'/>;
        case ChannelTypes.PhoneCall:
            return <SvgIcon type={Icon.ChannelPhone} className='x-large' fillClass='channel-icon-fill' strokeClass='channel-icon-stroke'/>;
        case ChannelTypes.WebSite:
            return <SvgIcon type={Icon.ChannelWeb} className='x-large' fillClass='channel-icon-fill' strokeClass='channel-icon-stroke'/>;
        case ChannelTypes.UserCreated:
            return <SvgIcon type={Icon.ChannelSms} className='x-large' fillClass='channel-icon-fill' strokeClass='channel-icon-stroke'/>;
        default:
            return <SvgIcon type={Icon.ChannelChat} className='x-large' fillClass='channel-icon-fill' strokeClass='channel-icon-stroke'/>;
    }
}

export default withErrorLogging(TicketChannelIcon);
