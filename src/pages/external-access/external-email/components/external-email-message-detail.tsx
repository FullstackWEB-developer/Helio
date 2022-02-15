import Avatar from '@components/avatar';
import SvgIcon, {Icon} from '@components/svg-icon';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {ChannelTypes, EmailMessageDto, TicketMessagesDirection, UserBase} from '@shared/models';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import utils from '@shared/utils/utils';
import Tooltip from '@components/tooltip/tooltip';
import {customHooks} from '@shared/hooks';
import EmailAttachment from '@pages/email/components/email-message/email-attachment';
import Button from '@components/button/button';
import {useMutation} from 'react-query';
import {markRead} from '@pages/sms/services/ticket-messages.service';
import {useDispatch} from 'react-redux';
import {setEmailMarkAsRead} from '@pages/external-access/external-email/store/external-email.slice';

interface ExternalEmailMessageDetailProps {
    message: EmailMessageDto;
    patientPhoto?: string;
    patient?: ExtendedPatient;
    users?: UserBase[];
    setReplyMode: (mode: boolean) => void
}
const ExternalEmailMessageDetail = ({patientPhoto, message, patient, users, setReplyMode}: ExternalEmailMessageDetailProps) => {

    const {t} = useTranslation();
    dayjs.extend(utc);
    dayjs.extend(isToday);
    const dispatch = useDispatch();
    const markReadMutation = useMutation(({ticketId, channel, id}: {ticketId: string, channel: ChannelTypes, id: string}) =>
        markRead(ticketId, channel, TicketMessagesDirection.Outgoing, id));

    useEffect(() => {
        markReadMutation
            .mutate({ticketId: message.ticketId, channel: ChannelTypes.Email, id: message.id}, {
                onSettled: () => {
                    dispatch(setEmailMarkAsRead({id :message.id}));
                }
            });
    }, [])

    const user = useMemo(() => {
        if (message.direction === TicketMessagesDirection.Outgoing) {
            return users?.find(a => a.id === message.createdBy);
        }
    }, [message.createdBy, message.direction, users]);

    const displayName = useMemo(() => {
        if (message.direction === TicketMessagesDirection.Outgoing) {
            return message.createdByName;
        }
        if (!!message.createdForName) {
            return message.createdForName;
        }
        return message.fromAddress;
    }, [message]);

    const photo = useMemo(() => {
        if (message.direction === TicketMessagesDirection.Outgoing) {
            return <Avatar userId={message.createdByName}
                userFullName={message.createdByName}
                userPicture={user?.profilePicture} />
        }
        if (message.direction === TicketMessagesDirection.Incoming) {
            if (patientPhoto) {
                return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                    src={`data:image/jpeg;base64,${patientPhoto}`} />;
            }
            if (!!patient || !!message.contactId) {
                return <Avatar userFullName={displayName} />
            }
        }
        return <Avatar userFullName={'#'} />

    }, [message.createdBy, patientPhoto, user]);

    const emailDate = useMemo(() => {
        const messageSendAt = message.createdOn;
        if (dayjs(messageSendAt).isToday()) {
            return dayjs.utc(messageSendAt).local().format('hh:mm A');
        } else {
            return dayjs.utc(messageSendAt).local().format('MMM D');
        }
    }, [message.createdOn]);

    const recipientChevronIcon = useRef(null);
    const [displayRecipientsTooltip, setDisplayRecipientTooltip] = useState(false);
    customHooks.useOutsideClick([recipientChevronIcon], () => {
        setDisplayRecipientTooltip(false);
    });

    const constructToField = () => {
        const cwcEmail = utils.getAppParameter('HelioEmailAddress');
        const recipients = message.toAddress?.replace(cwcEmail, "CWC").split(';');
        const carbonCopyRecipientsNumber = message.ccAddress?.length > 0 ? message.ccAddress.split(';').length : 0;

        if (recipients!?.length > 1 || carbonCopyRecipientsNumber > 0) {
            return <Trans i18nKey="email.inbox.to_multiple" values={{
                recipient: recipients![0],
                count: recipients!.length + carbonCopyRecipientsNumber - 1,
                others: recipients!.length + carbonCopyRecipientsNumber - 1 > 1 ? 'others' : 'other'
            }}>
                <div className='subtitle2 whitespace-pre'>{recipients![0]}</div>
                <div className='whitespace-pre'>{recipients!.length + carbonCopyRecipientsNumber - 1}</div>
                <div className='subtitle2 whitespace-pre'>{recipients!.length + carbonCopyRecipientsNumber - 1 > 1 ? 'others' : 'other'}</div>
            </Trans>
        }

        return <Trans i18nKey="email.inbox.to" values={{recipient: recipients![0]}}>
            <div className='subtitle2 whitespace-pre'>{recipients![0]}</div>
        </Trans>
    }

    return (
        <div className='flex flex-col flex-1 w-full p-4'>
            <div className='flex items-center space-x-4'>
                <div>
                    {photo}
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row justify-between items-center w-full'>
                        <div className='subtitle2'>
                            {displayName}
                        </div>
                        <div className='flex flex-row'>
                            {message.attachments && <div>
                                <SvgIcon type={Icon.Attachment} className="icon-small" fillClass="rgba-06-fill" />
                            </div>}
                            <div className='body3-medium flex items-center w-16 justify-end'>
                                {emailDate}
                            </div>
                        </div>
                    </div>
                    <div className='body2 w-60 md:w-96 xl:w-full break-words'>
                        {message.subject}
                    </div>
                </div>
            </div>
            <div className='body2 flex py-4 items-center'>
                {constructToField()}
                <div ref={recipientChevronIcon} onClick={() => setDisplayRecipientTooltip(!displayRecipientsTooltip)}>
                    <SvgIcon type={Icon.ArrowTrendDown} className='cursor-pointer' />
                </div>
            </div>
            <div dangerouslySetInnerHTML={{__html: message.body}}></div>
            {
                message.attachments?.length > 0 &&
                <div className='mt-4 pt-7 border-t flex flex-wrap'>
                    {
                        message.attachments.map(a =>
                            <EmailAttachment key={a.fileName} attachment={a} messageId={message.id} externalPagesUse={true} />
                        )
                    }
                </div>
            }
            <div className='pb-5 border-b' />

            <Button className='w-full mt-4' label='email.new_email.reply' onClick={()=>setReplyMode(true)} />

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

export default ExternalEmailMessageDetail;
