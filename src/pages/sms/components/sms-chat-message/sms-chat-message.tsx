import Avatar from '@components/avatar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classnames from 'classnames';
import './sms-chat-message.scss';
import {User} from '@shared/models/user';
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
}

const getName = (props: SmsChatMessageProps) => {
    if (!props.isNameVisible) {
        return '';
    }

    if (props.agent) {
        return `${props.agent.firstName} - Agent`
    } else {
        return props.name;
    }
}

const SmsChatMessageAvatar = ({name, photoUrl}: {name: string, photoUrl?: string}) => (
    <div className="flex flex-col">
        <div><Avatar userFullName={name} userPicture={photoUrl} /></div>
        <div/>
    </div>
);

const SmsChatMessageTime = ({date}: {date: Date}) => (
    <div className="flex items-center sms-chat-message-time body3-small">{dayjs.utc(date).local().format('hh:mm A')}</div>
);

const SmsChatMessageBody = ({body}: {body: string}) => (
    <div className="sms-chat-message-body px-4 py-2.5 mx-2">{body}</div>
);


const SmsChatMessageOut = (props: SmsChatMessageProps) => {
    return (<div className={classnames("flex flex-col mt-2 sms-chat-message out-going pr-2", {'is-top': props.isTheTop})}>
        <div className='flex flex-row'>
            <div className="sms-chat-message-time body3-small"/>
            <div className="px-4 mx-2 body2 sms-chat-message-sender">{getName(props)}</div>
            <div className='w-10'/>
        </div>
        <div className="flex flex-row justify-end">
            <SmsChatMessageTime date={props.date} />
            <SmsChatMessageBody body={props.body} />
            {props.isPhotoVisible && <SmsChatMessageAvatar name={props.name} photoUrl={props.photoProfileUrl} />}
        </div>
    </div>);
}

const SmsChatMessageIn = (props: SmsChatMessageProps) => {
    return (<div className={classnames("flex flex-col mt-2 sms-chat-message in-going", {'is-top': props.isTheTop})}>
        <div className='flex flex-row'>
            <div className='w-10'/>
            <div className="px-4 mx-2 body2 sms-chat-message-sender">{getName(props)}</div>
            <div className="sms-chat-message-time body3-small"/>
        </div>
        <div className="flex flex-row justify-start">
            {props.isPhotoVisible && <SmsChatMessageAvatar name={props.name} photoUrl={props.photoProfileUrl} />}
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
