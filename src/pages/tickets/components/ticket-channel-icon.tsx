import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {ChannelTypes} from '@shared/models/ticket-channel';
import '../tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

interface TicketChannelIconProps {
    channel?: number
}

const TicketChannelIcon = ({channel}: TicketChannelIconProps) => {
    let type: Icon;
    switch (channel) {
        case ChannelTypes.Chat:
            type = Icon.ChannelChat;
            break;
        case ChannelTypes.PhoneCall:
            type = Icon.ChannelPhone;
            break;
        case ChannelTypes.WebSite:
            type = Icon.ChannelWeb;
            break;
        case ChannelTypes.UserCreated:
            type = Icon.ChannelSms
            break;
        default:
            type = Icon.ChannelChat;
    }
    return <SvgIcon type={type} className='icon-x-large' fillClass='channel-icon-fill'
                    strokeClass='channel-icon-stroke'/>;
}

export default withErrorLogging(TicketChannelIcon);
