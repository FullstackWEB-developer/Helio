import React from 'react';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import Button from '../../../../shared/components/button/button';
import { getRecordedConversation } from '../../services/tickets.service';
import { ChannelTypes } from '../../models/ticket-channel';

interface TicketDetailAttachmentsProps {
    ticket: Ticket
}

const TicketDetailAttachments = ({ ticket }: TicketDetailAttachmentsProps ) => {
    const { t } = useTranslation();

    const getChannel = () => {
        switch (ticket.channel) {
            case ChannelTypes.Chat:
                return 'chat';
            case ChannelTypes.PhoneCall:
                return 'voice';
            default:
                return 'chat';
        }
    };

    const downloadRecordedConversation = async () => {
        if (ticket?.id) {
            await getRecordedConversation(ticket.id).then((data) => {
                if (data) {
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(
                        new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8;' })
                    );

                    const tKey = `ticket_detail.info_panel.recorded_conversation.file_name_${getChannel()}`;
                    link.download = `${t(tKey)}-${ticket.ticketNumber}.json`;
                    link.click();
                }
            });
        }
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        <div>
            <dl>
                <div className='sm:grid sm:grid-cols-2'>
                    <dt className='subtitle2'>
                        {t(`ticket_detail.info_panel.recorded_conversation.title_${getChannel()}`)}
                    </dt>
                    <dd className='body2'>
                        {
                            ticket.recordedConversationLink ?
                            <Button data-test-id='ticket-detail-recorded_conversation-button'
                                    buttonType='secondary'
                                    onClick={() => downloadRecordedConversation()}
                                    label={'ticket_detail.info_panel.recorded_conversation.download'} />
                            : t('common.not_available')
                        }
                    </dd>
                </div>
            </dl>
        </div>
    </div>
}

export default withErrorLogging(TicketDetailAttachments);
