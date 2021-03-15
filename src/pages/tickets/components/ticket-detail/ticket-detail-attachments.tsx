import React from 'react';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';

interface TicketDetailAttachmentsProps {
    ticket: Ticket
}

const TicketDetailAttachments = ({ ticket }: TicketDetailAttachmentsProps ) => {
    const { t } = useTranslation();

    return <div className={'py-4 mx-auto flex flex-col'}>
        <div>
            <dl>
                <div className='sm:grid sm:grid-cols-2'>
                    <dt className='subtitle2'>
                        {t('ticket_detail.info_panel.chat_transcript')}
                    </dt>
                    <dd className='body2'>
                        {t('ticket_detail.info_panel.link')}
                    </dd>
                </div>
            </dl>
        </div>
    </div>
}

export default withErrorLogging(TicketDetailAttachments);
