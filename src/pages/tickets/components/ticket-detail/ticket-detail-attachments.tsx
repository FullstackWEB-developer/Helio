import React from 'react';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {toggleChatTranscriptWindowVisible} from '@pages/tickets/store/tickets.slice';
import {useDispatch} from 'react-redux';
import {downloadRecordedConversation, getChannel} from '@pages/tickets/utils/ticket-chat-transcript-download-utils';
import {Ticket} from '@pages/tickets/models/ticket';

interface TicketDetailAttachmentsProps {
    ticket: Ticket
}

const TicketDetailAttachments = ({ticket}: TicketDetailAttachmentsProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    return <div className={'py-4 mx-auto flex flex-col'}>
        <div>
            <dl>
                <div className='flex flex row justify-between'>
                    <div className='body2-medium'>
                        {t(`ticket_detail.info_panel.recorded_conversation.title_${getChannel(ticket)}`)}
                    </div>
                    {
                        ticket.recordedConversationLink ?
                            <div className='flex flex-row space-x-6'>
                                <div className='cursor-pointer'>
                                    {
                                        <SvgIcon type={Icon.View} onClick={() => dispatch(toggleChatTranscriptWindowVisible())} fillClass={'rgba-05-fill'}/>
                                    }
                                </div>
                                <div onClick={() => downloadRecordedConversation(ticket)} className='cursor-pointer'>
                                    {
                                        <SvgIcon type={Icon.Download} fillClass={'select-arrow-fill'}/>
                                    }
                                </div>
                            </div> : t('common.not_available')
                    }
                </div>
            </dl>
        </div>
    </div>
}

export default withErrorLogging(TicketDetailAttachments);
