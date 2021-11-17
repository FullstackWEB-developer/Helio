import Avatar from '@components/avatar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classnames from 'classnames';
import './sms-chat-message.scss';
import {User} from '@shared/models/user';
import utils from '@shared/utils/utils';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {Icon} from '@components/svg-icon';
dayjs.extend(utc);

interface SmsChatMessageProps {
    isTheTop?: boolean;
    isOutGoing?: boolean
    name: string;
    photoProfileUrl?: string;
    agent?: User;
    body: string;
    date: Date;
    isNameVisible?: boolean;
    isPhotoVisible?: boolean;
    patientPhoto?: string;
}

const systemUser = "System User";
const getName = (props: SmsChatMessageProps, t: TFunction) => {
    if (!props.isNameVisible) {
        return '';
    }

    if(props.isOutGoing && props.name === systemUser){
        return t('external_access.ticket_sms.cwc_only');
    }

    if (props.agent) {
        return t('sms.agent_label', {name: `${props.agent.firstName} ${props.agent.lastName}`});
    } else if (props.name.startsWith('+') || /\d/.test(props.name)) {
        return utils.applyPhoneMask(props.name);
    }
    else {
        return props.name;
    }
}



const SmsChatMessageAvatar = ({name, photoUrl, patientPhoto}: {name: string, photoUrl?: string, patientPhoto?: string}) => {
    const {t} = useTranslation();
    const getImage = () => {
        if (patientPhoto && patientPhoto.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                        src={`data:image/jpeg;base64,${patientPhoto}`} />
        }

        return <Avatar
            userFullName={name}
            userPicture={photoUrl}
        />
    }

    return (    <div className="flex flex-col">
        <div>
            {!name && !photoUrl &&
                <Avatar icon={Icon.UserUnknown} />
            }
            {(!!name || (!!photoUrl || patientPhoto)) && getImage()}
        </div>
        <div />
    </div>
)};

const SmsChatMessageTime = ({date}: {date: Date}) => (
    <div className="flex items-center sms-chat-message-time body3-small">{dayjs.utc(date).local().format('hh:mm A')}</div>
);

const SmsChatMessageBody = ({body}: {body: string}) => (
    <div className="sms-chat-message-body px-4 py-2.5 mx-2">{body}</div>
);


const SmsChatMessageOut = (props: SmsChatMessageProps) => {
    const {t} = useTranslation();
    const name = props.name && (props.name.startsWith('+') || /\d/.test(props.name)) ? t('common.default_avatar') : props.name;
    return (<div className={classnames("flex flex-col mt-2 sms-chat-message out-going pr-2", {'is-top': props.isTheTop})}>
        <div className='flex flex-row'>
            <div className="sms-chat-message-time body3-small" />
            <div className="px-4 mx-2 body2 sms-chat-message-sender">{getName(props, t)}</div>
            <div className='w-10' />
        </div>
        <div className="flex flex-row justify-end">
            <SmsChatMessageTime date={props.date} />
            <SmsChatMessageBody body={props.body} />
            {props.isPhotoVisible && props.name !== systemUser && <SmsChatMessageAvatar name={name} photoUrl={props.photoProfileUrl} />}
        </div>
    </div>);
}

const SmsChatMessageIn = (props: SmsChatMessageProps) => {
    const {t} = useTranslation();
    const name = props.name && (props.name.startsWith('+') || /\d/.test(props.name)) ? '' : props.name;
    return (<div className={classnames("flex flex-col mt-2 sms-chat-message in-going", {'is-top': props.isTheTop})}>
        <div className='flex flex-row'>
            <div className='w-10' />
            <div className="px-4 mx-2 body2 sms-chat-message-sender">{getName(props, t)}</div>
            <div className="sms-chat-message-time body3-small" />
        </div>
        <div className="flex flex-row justify-start">
            {props.isPhotoVisible && <SmsChatMessageAvatar name={name} photoUrl={props.photoProfileUrl} patientPhoto={props.patientPhoto} />}
            <SmsChatMessageBody body={props.body} />
            <SmsChatMessageTime date={props.date} />
        </div>
    </div>)
}

const SmsChatMessage = (props: SmsChatMessageProps) => {
    return (<>
        {props.isOutGoing && <SmsChatMessageOut {...props} />}
        {!props.isOutGoing && <SmsChatMessageIn {...props} />}
    </>);
}

export default SmsChatMessage;
