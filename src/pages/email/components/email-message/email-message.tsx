import SvgIcon, {Icon} from '@components/svg-icon';
import Tooltip from '@components/tooltip/tooltip';
import {customHooks} from '@shared/hooks';
import {EmailMessageDto, TicketMessagesDirection} from '@shared/models';
import utils from '@shared/utils/utils';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import EmailMessageHeader from './email-message-header';

const EmailMessage = ({message, ticketCreatedForName, ticketHeaderPhoto}: {message: EmailMessageDto, ticketCreatedForName: string, ticketHeaderPhoto: string}) => {

    const {t} = useTranslation();
    const emailFromLabel = message.direction === TicketMessagesDirection.Incoming ? ticketCreatedForName :
        (message.createdByName ?? message.fromAddress);

    const emailFromPhoto = message.direction === TicketMessagesDirection.Incoming ? ticketHeaderPhoto : '';

    const [collapsed, setCollapsed] = useState(false);

    const constructToField = () => {
        const cwcEmail = utils.getAppParameter('HelioEmailAddress');
        const recipients = message.toAddress?.replace(cwcEmail, "CWC").split(';');
        const carbonCopyRecipientsNumber = message.ccAddress?.length > 0 ? message.ccAddress.split(';').length : 0;

        if (recipients!?.length > 1 || carbonCopyRecipientsNumber > 0) {
            return t('email.inbox.to_multiple', {recipient: recipients![0], x: recipients!.length + carbonCopyRecipientsNumber - 1});
        }

        return t('email.inbox.to', {recipient: recipients![0]});
    }

    const recipientChevronIcon = useRef(null);
    const [displayRecipientsTooltip, setDisplayRecipientTooltip] = useState(false);


    return (
        <div className='px-6'>
            <EmailMessageHeader
                subject={message.subject || ''}
                from={emailFromLabel}
                fromPhoto={emailFromPhoto}
                collapseHandler={() => setCollapsed(!collapsed)}
                collapsedBody={collapsed}
                date={message.createdOn}
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
                </div>
            }
            <div className='ml-10 pl-4 pb-7 border-b'></div>

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