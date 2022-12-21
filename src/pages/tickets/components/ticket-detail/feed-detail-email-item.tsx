import SvgIcon, { Icon } from '@components/svg-icon';
import Tooltip from '@components/tooltip/tooltip';
import { EmailMessageDto, TicketMessagesDirection } from '@shared/models';
import utils from '@shared/utils/utils';
import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import EmailAttachment from '@pages/email/components/email-message/email-attachment';
import FeedDetailEmailHeaderItem from '@pages/tickets/components/ticket-detail/feed-detail-email-item-header';
import { useSelector } from 'react-redux';
import { selectSelectedTicket } from '@pages/tickets/store/tickets.selectors';
import linkifyHtml from 'linkifyjs/html';

interface FeedDetailEmailItemProps {
  message: EmailMessageDto;
  isCollapsed: boolean;
  feedTime: string;
  userFullName?: string;
}
const FeedDetailEmailItem = ({ message, isCollapsed, feedTime, userFullName }: FeedDetailEmailItemProps) => {
  const { t } = useTranslation();
  const ticket = useSelector(selectSelectedTicket);
  const [hover, setHover] = useState<boolean>(false);
  const emailFromLabel =
    message.direction === TicketMessagesDirection.Incoming ? ticket?.createdForName || message.fromAddress : message.createdByName ?? message.fromAddress;

  const [collapsed, setCollapsed] = useState(isCollapsed);

  const getEmailFromLabel = () => {
    if (ticket.contactId && userFullName) {
      return userFullName;
    } else {
      return emailFromLabel;
    }
  };

  const constructToField = () => {
    const helioEmail = utils.getAppParameter('HelioEmailAddress');
    const recipients = message.toAddress?.replace(helioEmail, 'Helio').split(';');
    const carbonCopyRecipientsNumber = message.ccAddress?.length > 0 ? message.ccAddress.split(';').length : 0;

    if (recipients!?.length > 1 || carbonCopyRecipientsNumber > 0) {
      return (
        <Trans
          i18nKey='email.inbox.to_multiple'
          values={{
            recipient: recipients![0],
            count: recipients!.length + carbonCopyRecipientsNumber - 1,
            others: recipients!.length + carbonCopyRecipientsNumber - 1 > 1 ? 'others' : 'other',
          }}
        >
          <div className='subtitle2 whitespace-pre'>{recipients![0]}</div>
          <div className='whitespace-pre'>{recipients!.length + carbonCopyRecipientsNumber - 1}</div>
          <div className='subtitle2 whitespace-pre'>{recipients!.length + carbonCopyRecipientsNumber - 1 > 1 ? 'others' : 'other'}</div>
        </Trans>
      );
    }
    return (
      <Trans i18nKey='email.inbox.to' values={{ recipient: recipients![0] }}>
        <div className='subtitle2 whitespace-pre'>{recipients![0]}</div>
      </Trans>
    );
  };

  const recipientChevronIcon = useRef(null);
  const [displayRecipientsTooltip, setDisplayRecipientTooltip] = useState(false);

  return (
    <div className='pl-6 pr-10' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <FeedDetailEmailHeaderItem
        message={message}
        from={getEmailFromLabel()}
        collapseHandler={() => setCollapsed(!collapsed)}
        collapsed={collapsed}
        isHover={hover}
        feedTime={feedTime}
      />
      {!collapsed && (
        <div className='ml-10 pl-4 flex flex-col'>
          <div className='pb-4 body2 flex'>
            {constructToField()}
            <div ref={recipientChevronIcon} onMouseOver={() => setDisplayRecipientTooltip(true)} onMouseOut={() => setDisplayRecipientTooltip(false)}>
              <SvgIcon type={Icon.ArrowTrendDown} className='cursor-pointer' />
            </div>
          </div>
          <div className={collapsed ? 'links' : 'links border-b pb-4 body2'} dangerouslySetInnerHTML={{ __html: linkifyHtml(message.body) }} />
          {message.attachments?.length > 0 && (
            <div className='pt-4 flex flex-wrap'>
              {message.attachments.map((a, i) => (
                <EmailAttachment key={a.fileName} attachment={a} messageId={message.id} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className='ml-14 pl-4 border-b' />

      <Tooltip targetRef={recipientChevronIcon} isVisible={displayRecipientsTooltip} placement='bottom-start'>
        <div className='flex flex-col subtitle3 px-4'>
          <span className='py-4'>
            <b>{t('email.inbox.from_label')}</b> {message?.fromAddress || ''}
          </span>
          <span className='pb-4'>
            <b>{t('email.inbox.to_label')}</b> {message?.toAddress || ''}
          </span>
          {message?.ccAddress?.length > 0 && (
            <span className='pb-4'>
              <b>{t('email.inbox.cc_label')}</b> {message?.ccAddress || ''}
            </span>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

export default FeedDetailEmailItem;
