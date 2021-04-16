import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { ChannelTypes } from '../models/ticket-channel';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';

interface ChannelTypesProps {
    channel: ChannelTypes
}

const TicketChannelTypeIcon = ({ channel }: ChannelTypesProps) => {
    switch (channel) {
        case ChannelTypes.Chat:
            return <SvgIcon type={Icon.Chat}/>;
        case ChannelTypes.PhoneCall:
            return <SvgIcon type={Icon.Phone}/>;
        case ChannelTypes.WebSite:
            return <SvgIcon type={Icon.Web}/>;
        case ChannelTypes.UserCreated:
            return <SvgIcon type={Icon.Sms}/>;
        default:
            return channel;
    }
}

export default withErrorLogging(TicketChannelTypeIcon);
