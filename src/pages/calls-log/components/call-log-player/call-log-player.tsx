import AudioPlayer from '@components/audio-player/audio-player';
import classnames from 'classnames';
import CallContactAgentInfo from '../call-contact-info/call-contact-agent-info';
import {useQuery} from 'react-query';
import {getRecordedConversationLink} from '@pages/tickets/services/tickets.service';
import {useState} from 'react';
import Spinner from '@components/spinner/Spinner';
import {GetRecordedConversationLink} from '@constants/react-query-constants';
import './call-log-player.scss';
import Modal from '@components/modal/modal';
import { useSelector } from 'react-redux';
import { selectPlayVoiceTicketId } from '@pages/tickets/store/tickets.selectors';

interface CallLogAudioPlayer {
    ticketId: string;
    title: string;
    subTitle?: string;
    agentId: string;
    className?: string;
    isOpen?: boolean,
    onClose?: () => void;
}
const CallLogPlayer = (
    {
        title,
        ticketId,
        subTitle,
        className,
        isOpen = false,
        agentId,
        ...props
    }: CallLogAudioPlayer) => {
    const playVoiceTicketId = useSelector(selectPlayVoiceTicketId);
    const [audioUrl, setAudioUrl] = useState('');
    const {isLoading, isFetching} = useQuery([GetRecordedConversationLink, ticketId], () => getRecordedConversationLink(playVoiceTicketId ? playVoiceTicketId : ticketId), {
        enabled: isOpen,
        onSuccess: (data) => {
            setAudioUrl(data);
        }
    });

    if (!isOpen) {
        return null;
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={props.onClose}
            className={classnames('call-log-player', className)}
            isClosable
            isDraggable={true}
            contentClassName='pl-6 pr-10'
        >
            <div className='flex flex-col'>
                <div className='flex flex-row justify-between mb-7'>
                    <div className='flex flex-col'>
                        <h6>{title}</h6>
                        <span className='mt-1 body3-medium'>{subTitle}</span>
                    </div>
                    <CallContactAgentInfo agentId={agentId} type='VOICE' />
                </div>
                <div className='mb-10'>
                    {(isLoading || isFetching) &&
                        <Spinner fullScreen />
                    }
                    {(!isLoading && !isFetching) &&
                        <AudioPlayer url={audioUrl ?? ''} />
                    }
                </div>
            </div>
        </Modal>
    );
}

export default CallLogPlayer;

