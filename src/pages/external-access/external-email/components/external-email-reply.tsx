import Button from '@components/button/button';
import Input from '@components/input';
import SvgIcon, {Icon} from '@components/svg-icon';
import {ChannelTypes, EmailMessageDto, TicketMessageBase, TicketMessagesDirection} from '@shared/models';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './external-email-reply.scss';
import ExternalEmailTextArea from '@pages/external-access/external-email/components/external-email-text-area';
import {useMutation, useQuery} from 'react-query';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {useDispatch, useSelector} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import utils from '@shared/utils/utils';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {RealtimeTicketMessageContext} from '@pages/external-access/realtime-ticket-message-context/realtime-ticket-message-context';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {getContactById} from '@shared/services/contacts.service';
import {
    GetContactById,
    GetPatient
} from '@constants/react-query-constants';

interface ExternalEmailReply {
    message: EmailMessageDto;
    setReplyMode: (mode: boolean) => void,
    setSelectedMessage: (message: EmailMessageDto | undefined) => void
}
const ExternalEmailReply = ({message, setReplyMode, setSelectedMessage}: ExternalEmailReply) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const emptyHtml = '<p><br></p>';
    const discardCompose = () => {
        setEmailContent('');
        setReplyMode(false);
    }
    const request = useSelector(selectRedirectLink);
    const [emailContent, setEmailContent] = useState('');
    const {setLastMessageDate} = useContext(RealtimeTicketMessageContext)!;
    const sendEmail = () => {
        if (!request?.ticketId) {return;}
        
        if(message.patientId){
            refetchPatient();
        } else if(message.contactId){
            refetchContact();
        }
    }
    const {refetch: refetchPatient} = useQuery([GetPatient, message.patientId], () => getPatientByIdWithQuery(message.patientId!), {
        enabled: false,
        onSuccess: (data) => {
            checkEmailStatus(data.emailAddress);
        }
    });

    const {refetch: refetchContact} = useQuery([GetContactById, message.contactId], () => getContactById(message.contactId!), {
        enabled: false,
        onSuccess: (data) => {
            checkEmailStatus(data.emailAddress);
        }
    });
    
    const checkEmailStatus = (emailAddress) => {
        if(emailAddress !== getUsersLastEmailAddress()){
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.email_changed'
            }))
        }else{
            const cwcEmail = utils.getAppParameter('HelioEmailAddress');
            const newMessage: TicketMessageBase = {
                channel: ChannelTypes.Email,
                body: emailContent,
                toAddress: cwcEmail,
                ticketId: request.ticketId,
                direction: TicketMessagesDirection.Incoming,
                subject: message?.subject
            }
            sendEmailMutation.mutate(newMessage);
        }
    }

    const getUsersLastEmailAddress = () => {
        return message.direction === TicketMessagesDirection.Incoming ? message.fromAddress : message.toAddress
    }

    const sendEmailMutation = useMutation(sendMessage, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'email.new_email.email_sent_successfully',
                position: SnackbarPosition.TopCenter
            }));
            discardCompose();
            setLastMessageDate(new Date());
            setSelectedMessage(undefined);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'email.new_email.email_sent_failed',
                position: SnackbarPosition.TopCenter
            }));
        }
    });


    const displaySendButton = emailContent && emailContent !== emptyHtml;
    return (
        <div className='flex flex-col flex-1 h-full overflow-hidden'>
            <div className='flex h-14 reply-header items-center px-4 subtitle justify-between'>
                {t('email.inbox.send_reply')}
                <div className='flex items-center justify-end'>
                    {/* <SvgIcon wrapperClassName='pr-6 cursor-pointer' type={Icon.Attachment} fillClass='white-icon' />*/}
                    <SvgIcon wrapperClassName={`cursor-pointer ${displaySendButton ? 'pr-6': 'pr-2'}`} type={Icon.Delete} fillClass='white-icon' onClick={discardCompose} />
                    {
                        displaySendButton &&
                        <Button label='common.send' buttonType='secondary' className='external-reply-outline-button z-10' onClick={sendEmail} isLoading={sendEmailMutation.isLoading} />
                    }
                </div>
            </div>
            <div className='h-12'>
                <Input name='subject'
                    type='text'
                    value={message?.subject}
                    disabled={true}
                    placeholder='email.subject'
                    containerClassName='w-full h-full' />
            </div>
            <ExternalEmailTextArea content={emailContent} handleChange={setEmailContent} />
        </div>
    )
}

export default ExternalEmailReply;
