import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {ChannelTypes} from '@shared/models/ticket-channel';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';

interface ChannelTypesProps {
    channel: ChannelTypes;
    fillClass?: string;
}

const TicketChannelTypeIcon = ({channel, fillClass}: ChannelTypesProps) => {
    switch (channel) {
        case ChannelTypes.Chat:
            return <SvgIcon type={Icon.Chat} fillClass={fillClass} />;
        case ChannelTypes.PhoneCall:
            return <SvgIcon type={Icon.Phone} fillClass={fillClass} />;
        case ChannelTypes.WebSite:
            return <SvgIcon type={Icon.Web} fillClass={fillClass} />;
        case ChannelTypes.SMS:
        case ChannelTypes.UserCreated:
            return <SvgIcon type={Icon.Sms} fillClass={fillClass} />;
        case ChannelTypes.Email:
            return <SvgIcon type={Icon.Email} fillClass={fillClass} />;
        default:
            return channel;
    }
}

export default withErrorLogging(TicketChannelTypeIcon);
