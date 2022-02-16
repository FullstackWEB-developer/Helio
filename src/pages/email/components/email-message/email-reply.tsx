import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import SvgIcon, {Icon} from '@components/svg-icon';
import TextArea from '@components/textarea/textarea';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Ticket} from '@pages/tickets/models/ticket';
import {ChannelTypes, ContactExtended, EmailMessageDto, TicketMessageBase, TicketMessagesDirection} from '@shared/models';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {setAssignee} from '@pages/tickets/services/tickets.service';
import {setLastEmailDate} from '@pages/email/store/email-slice';
import {ProcessTemplate} from '@constants/react-query-constants';
import {processTemplate} from '@shared/services/notifications.service';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';
import './email-reply.scss';

interface EmailReplyProps {
    ticket: Ticket;
    patient?: ExtendedPatient;
    contact?: ContactExtended;
    onMailSend: (newMessage: EmailMessageDto) => void;
    disabled: boolean;
}
const EmailReply = ({ticket, patient, contact, onMailSend, disabled}: EmailReplyProps) => {
    const {t} = useTranslation();
    const [emailContent, setEmailContent] = useState('');
    const dispatch = useDispatch();
    const [recipientEmailAddress, setRecipientEmailAddress] = useState('');
    const {id} = useSelector(selectAppUserDetails);

    useEffect(() => {
        if (patient?.emailAddress) {
            setRecipientEmailAddress(patient.emailAddress)
        } else if (contact?.emailAddress) {
            setRecipientEmailAddress(contact.emailAddress);
        }
        else {
            if (ticket.incomingEmailAddress) {
                setRecipientEmailAddress(ticket.incomingEmailAddress);
            }
        }
    }, [contact, patient, ticket]);

    const changeAssigneeMutation = useMutation(setAssignee);
    const sendEmailMutation = useMutation(sendMessage, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'email.new_email.email_sent_successfully'
            }));
            discardReply();
            onMailSend(data as EmailMessageDto);
            dispatch(setLastEmailDate());
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'email.new_email.email_sent_failed'
            }));
        }
    });

    const sendReply = () => {
        if (!ticket || !recipientEmailAddress) return;
        const message: TicketMessageBase = {
            channel: ChannelTypes.Email,
            body: emailContent,
            toAddress: recipientEmailAddress,
            ticketId: ticket.id!,
            direction: TicketMessagesDirection.Outgoing,
            ...(emailSubject && {subject: emailSubject})
        }
        if (!ticket.assignee || ticket.assignee !== id) {
            changeAssigneeMutation.mutate({assignee: id, ticketId: ticket.id!});
        }
        sendEmailMutation.mutate(message);
    }

    const discardReply = () => {
        setRichTextMode(false);
        setEmailContent('');
        setEmailSubject('');
        setSelectedEmailTemplate(undefined);
    }

    const [richTextMode, setRichTextMode] = useState(false);
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<NotificationTemplate>();
    const [emailSubject, setEmailSubject] = useState<string>('');
    const {isFetching: isProcessingTemplate} = useQuery([ProcessTemplate, selectedEmailTemplate?.id!], () =>
        processTemplate(selectedEmailTemplate?.id!, ticket, patient, contact),
        {
            enabled: !!selectedEmailTemplate && !!selectedEmailTemplate?.requirePreProcessing,
            onSuccess: (data) => {
                setEmailContent(data.content);
                setEmailSubject(data.subject);
            },
            onError: () => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: 'email.inbox.template_error'
                }));
            }
        });

    const onTemplateSelect = (template: NotificationTemplate) => {
        setSelectedEmailTemplate(template);
        setRichTextMode(true);
        if (!template.requirePreProcessing) {
            setEmailContent(template.content);
            setEmailSubject(template.subject);
        }
    }

    return (
        <div className='email-reply w-full flex flex-col flex-auto'>
            <div className='flex justify-between items-center h-12 email-reply-stripe px-6'>
                <h6 className='text-white'>{t('email.inbox.send_reply')}</h6>
                {
                    (emailContent || selectedEmailTemplate) &&
                    <div className='flex body3-medium items-center' onClick={discardReply}>
                        <span className='text-white cursor-pointer'>{t('email.new_email.discard')}</span>
                        <SvgIcon wrapperClassName='pl-3 cursor-pointer' type={Icon.Delete} fillClass='white-icon' />
                    </div>
                }
            </div>
            <div className='flex items-center justify-between pb-6 pt-2 w-full'>
                <div className='w-16 mt-auto pl-4'>
                    <NotificationTemplateSelect isLoading={isProcessingTemplate}
                                                channel={NotificationTemplateChannel.Email}
                                                usedFrom={TemplateUsedFrom.Inbox}
                                                disabled={disabled}
                                                onSelect={(template) => onTemplateSelect(template)} />
                </div>
                <div className='w-full flex flex-col'>
                    {
                        selectedEmailTemplate && <div className='body2'><span className='body2-medium whitespace-pre'>{t('email.inbox.template')}</span> {selectedEmailTemplate.displayText}</div>
                    }
                    <TextArea
                        name='comment'
                        placeHolder='email.new_email.body_placeholder'
                        resizable={false}
                        className='body2 w-full'
                        rows={2}
                        disabled={disabled}
                        maxRows={4}
                        showFormatting={true}
                        value={emailContent}
                        onChange={(message: string) => setEmailContent(message.trim())}
                        showSendIconInRichTextMode={false}
                        toggleRichTextMode={richTextMode}
                    />
                </div>
                <div className='send-button-width mt-auto'>
                    {
                        emailContent &&
                        <SvgIcon wrapperClassName='p-4 cursor-pointer' isLoading={sendEmailMutation.isLoading || isProcessingTemplate} type={Icon.Send} onClick={sendReply} />
                    }
                </div>
            </div>
        </div>
    )
}

export default EmailReply;
