import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import SvgIcon, {Icon} from '@components/svg-icon';
import TextArea from '@components/textarea/textarea';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {NotificationTemplateChannel} from '@shared/models/notification-template.model';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Ticket} from '@pages/tickets/models/ticket';
import {ChannelTypes, ContactExtended, EmailMessageDto, TicketMessageBase, TicketMessagesDirection} from '@shared/models';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {setAssignee} from '@pages/tickets/services/tickets.service';

interface EmailReplyProps {
    ticket: Ticket;
    patient?: ExtendedPatient;
    contact?: ContactExtended;
    onMailSend: (newMessage: EmailMessageDto) => void;
}
const EmailReply = ({ticket, patient, contact, onMailSend}: EmailReplyProps) => {
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
            setEmailContent('');
            onMailSend(data as EmailMessageDto);
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
            direction: TicketMessagesDirection.Outgoing
        }
        if (!ticket.assignee || ticket.assignee !== id) {
            changeAssigneeMutation.mutate({assignee: id, ticketId: ticket.id!});
        }
        sendEmailMutation.mutate(message);
    }

    const discardReply = () => {
        setEmailContent('');
        // TODO next PBI - Remove selected template here to
    }

    return (
        <div className='email-reply w-full flex flex-col flex-auto'>
            <div className='flex justify-between items-center h-12 email-reply-stripe px-6'>
                <h6 className='text-white'>{t('email.inbox.send_reply')}</h6>
                {
                    emailContent /* TODO || selectedTemplate */ &&
                    <div className='flex body3-medium items-center' onClick={discardReply}>
                        <span className='text-white'>{t('email.new_email.discard')}</span>
                        <SvgIcon wrapperClassName='pl-3 cursor-pointer' type={Icon.Delete} fillClass='white-icon' />
                    </div>
                }

            </div>
            <div className='flex items-center justify-between overflow-y-auto py-4 w-full'>
                <div className='w-16 mt-auto pl-4'>
                    {/* 
                        SEPARATE PBI  
                        <NotificationTemplateSelect isLoading={false} channel={NotificationTemplateChannel.Email}
                        onSelect={() => { }} /> 
                    */}
                </div>

                <div className='w-full'>
                    <TextArea
                        name='comment'
                        placeHolder='email.new_email.body_placeholder'
                        resizable={false}
                        className='body2 w-full'
                        rows={2}
                        maxRows={4}
                        showFormatting={true}
                        value={emailContent}
                        onChange={(message: string) => setEmailContent(message)}
                        showSendIconInRichTextMode={false}
                    />
                </div>
                <div className='w-16 mt-auto'>
                    {
                        emailContent && <SvgIcon wrapperClassName='p-4 cursor-pointer' isLoading={sendEmailMutation.isLoading} type={Icon.Send} onClick={sendReply} />
                    }
                </div>
            </div>
        </div>
    )
}

export default EmailReply;