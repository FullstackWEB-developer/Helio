import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { ChannelTypes } from '../models/ticket-channel';
import { ReactComponent as ChatIcon } from '../../../shared/icons/Icon-Chat-24px.svg';
import { ReactComponent as PhoneIcon } from '../../../shared/icons/Icon-Phone-24px.svg';
import { ReactComponent as WebIcon } from '../../../shared/icons/Icon-Web-24px.svg';
import { ReactComponent as SmsIcon } from '../../../shared/icons/Icon-SMS-24px.svg';

interface ChannelTypesProps {
    channel: ChannelTypes
}

const TicketChannelTypeIcon = ({ channel }: ChannelTypesProps) => {
    switch (channel) {
        case ChannelTypes.Chat:
            return <ChatIcon />;
        case ChannelTypes.PhoneCall:
            return <PhoneIcon />;
        case ChannelTypes.WebSite:
            return <WebIcon />;
        case ChannelTypes.UserCreated:
            return <SmsIcon />;
        default:
            return channel;
    }
}

export default withErrorLogging(TicketChannelTypeIcon);