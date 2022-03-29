import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {ChannelTypes} from '@shared/models/ticket-channel';
import '../tickets.scss';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

interface TicketChannelIconProps {
    channel?: number,
    circledIcons?: boolean;
    iconSize?: string;
    fillClass?: string;
}

const TicketChannelIcon = ({channel, circledIcons = true, iconSize = 'icon-x-large', fillClass = 'channel-icon-fill'}: TicketChannelIconProps) => {
    let type: Icon;
    switch (channel) {
        case ChannelTypes.Chat:
            type = circledIcons ? Icon.ChannelChat : Icon.Chat;
            break;
        case ChannelTypes.PhoneCall:
            type = circledIcons ? Icon.ChannelPhone : Icon.Phone;
            break;
        case ChannelTypes.WebSite:
            type = circledIcons ? Icon.ChannelWeb : Icon.Web;
            break;
        case ChannelTypes.UserCreated:
            type = Icon.ChannelUser;
            break;
        case ChannelTypes.SMS:
            type = circledIcons ? Icon.ChannelSms : Icon.Sms;
            break;
        case ChannelTypes.Email:
            type = circledIcons ? Icon.ChannelEmail : Icon.Email;
            break;
        default:
            type = circledIcons ? Icon.ChannelChat : Icon.Chat;;
    }
    return <SvgIcon type={type} className={iconSize} fillClass={fillClass}
                    strokeClass='channel-icon-stroke'/>;
}

export default withErrorLogging(TicketChannelIcon);
