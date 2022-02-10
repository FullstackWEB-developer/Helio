import SvgIcon, {Icon} from '@components/svg-icon';
import Tooltip from '@components/tooltip/tooltip';
import {EmailMessageDto, TicketMessagesDirection} from '@shared/models';
import utils from '@shared/utils/utils';
import React, {useRef, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import EmailMessageHeader from './email-message-header';
import EmailAttachment from './email-attachment';

export interface EmailMessageProps {
    message: EmailMessageDto;
    ticketCreatedForName: string;
    ticketHeaderPhoto: string;
    isCollapsed: boolean;
    emailCount: number;
}
const EmailMessage = ({message, ticketCreatedForName, ticketHeaderPhoto, isCollapsed, emailCount}: EmailMessageProps) => {

    const {t} = useTranslation();
    const emailFromLabel = message.direction === TicketMessagesDirection.Incoming ? ticketCreatedForName || message.fromAddress :
        (message.createdByName ?? message.fromAddress);

    const emailFromPhoto = message.direction === TicketMessagesDirection.Incoming ? ticketHeaderPhoto : '';

    const [collapsed, setCollapsed] = useState(isCollapsed);

    const constructToField = () => {
        const cwcEmail = utils.getAppParameter('HelioEmailAddress');
        const recipients = message.toAddress?.replace(cwcEmail, "CWC").split(';');
        const carbonCopyRecipientsNumber = message.ccAddress?.length > 0 ? message.ccAddress.split(';').length : 0;

        if (recipients!?.length > 1 || carbonCopyRecipientsNumber > 0) {
            return <Trans i18nKey="email.inbox.to_multiple" values={{
                recipient: recipients![0],
                count: recipients!.length + carbonCopyRecipientsNumber - 1,
                others: recipients!.length + carbonCopyRecipientsNumber - 1 > 1 ? 'others': 'other'}}>
                <div className='subtitle2 whitespace-pre'>{recipients![0]}</div>
                <div className='whitespace-pre'>{recipients!.length + carbonCopyRecipientsNumber - 1}</div>
                <div className='subtitle2 whitespace-pre'>{recipients!.length + carbonCopyRecipientsNumber - 1 > 1 ? 'others': 'other'}</div>
            </Trans>
        }

        return <Trans i18nKey="email.inbox.to" values={{recipient: recipients![0]}}>
            <div className='subtitle2 whitespace-pre'>{recipients![0]}</div>
        </Trans>
    }

    const recipientChevronIcon = useRef(null);
    const [displayRecipientsTooltip, setDisplayRecipientTooltip] = useState(false);


    return (
        <div className='px-6'>
            <EmailMessageHeader
                subject={message.subject || ''}
                from={emailFromLabel}
                displaySplitMessageMenu={ emailCount > 1 }
                fromPhoto={emailFromPhoto}
                collapseHandler={() => setCollapsed(!collapsed)}
                collapsedBody={collapsed}
                date={message.createdOn}
                messageId={message.id}
                attachments={message.attachments}
            />
            {
                !collapsed &&
                <div className='ml-10 pl-4 flex flex-col'>
                    <div className='pb-4 body2 flex'>
                        {constructToField()}
                        <div ref={recipientChevronIcon} onMouseOver={() => setDisplayRecipientTooltip(true)} onMouseOut={() => setDisplayRecipientTooltip(false)}>
                            <SvgIcon type={Icon.ArrowTrendDown} className='cursor-pointer' />
                        </div>
                    </div>
                    <div dangerouslySetInnerHTML={{__html: message.body}}>

                    </div>
                    {
                        message.attachments?.length > 0 &&
                        <div className='mt-4 pt-7 border-t flex flex-wrap'>
                            {
                                message.attachments.map(a =>
                                    <EmailAttachment key={a.fileName} attachment={a} messageId={message.id} />
                                )
                            }
                        </div>
                    }
                </div>
            }

            <div className='ml-10 pl-4 pb-7 border-b'/>

            <Tooltip targetRef={recipientChevronIcon} isVisible={displayRecipientsTooltip}
                placement='bottom-start'>
                <div className='flex flex-col subtitle3 px-4'>
                    <span className='py-4'><b>{t('email.inbox.from_label')}</b> {message?.fromAddress || ''}</span>
                    <span className='pb-4'><b>{t('email.inbox.to_label')}</b> {message?.toAddress || ''}</span>
                    {
                        message?.ccAddress?.length > 0 &&
                        <span className='pb-4'><b>{t('email.inbox.cc_label')}</b> {message?.ccAddress || ''}</span>
                    }
                </div>
            </Tooltip>

        </div>
    )
}

export default EmailMessage;
