import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import React, {useContext, useEffect, useState} from 'react';
import EmailEditor from '@pages/email/components/send-first-email/email-editor';
import Button from '@components/button/button';
import Input from '@components/input';
import {useMutation, useQuery} from 'react-query';
import {GetIsEmailBlocked, ProcessTemplate} from '@constants/react-query-constants';
import {processTemplate} from '@shared/services/notifications.service';
import {Ticket} from '@pages/tickets/models/ticket';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {useDispatch, useSelector} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {ChannelTypes, ContactExtended, TicketMessageBase, TicketMessagesDirection} from '@shared/models';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {setAssignee, setDelete} from '@pages/tickets/services/tickets.service';
import {EmailPath} from '@app/paths';
import {MaxEmailSubjectLength, NEW_EMAIL} from '@pages/email/constants';
import {useHistory} from 'react-router-dom';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';
import {setEmailNewTicketId, setLastEmailDate} from '@pages/email/store/email-slice';
import {useTranslation} from 'react-i18next';
import {selectEmailNewTicketId} from '@pages/email/store/email.selectors';
import {EmailContext} from '@pages/email/context/email-context';
import { isUserEmailBlocked } from '@pages/blacklists/services/blacklists.service';
import Alert from '@components/alert/alert';

export interface SendFirstEmailProps {
    ticket: Ticket;
    patient?: ExtendedPatient;
    contact?: ContactExtended;
    onMailSend: () => void;
}
const SendFirstEmail = ({ticket, patient, contact, onMailSend} : SendFirstEmailProps) => {
    const [subject, setSubject] = useState<string>('');
    const [body, setBody] = useState<string>('');
    const {id} = useSelector(selectAppUserDetails);
    const [emailAddress, setEmailAddress] = useState<string>();
    const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | undefined>();
    const dispatch = useDispatch();
    const {getEmailsQuery} = useContext(EmailContext)!;
    const changeAssigneeMutation = useMutation(setAssignee);
    const history = useHistory();
    const {t} = useTranslation();
    const emailNewTicketId = useSelector(selectEmailNewTicketId);

    useEffect(() => {
        if (patient?.emailAddress) {
            setEmailAddress(patient.emailAddress)
        } else if (contact?.emailAddress) {
            setEmailAddress(contact.emailAddress);
        }
    }, [contact, patient]);

    const {data: isEmailAddressBlocked, isLoading: isEmailAddressBlockedLoading, isFetching: isEmailAddressBlockedFetching} = useQuery([GetIsEmailBlocked, emailAddress], () => isUserEmailBlocked(emailAddress), {
        enabled: !!emailAddress,
    });

    const sendEmailMutation = useMutation(sendMessage, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message:'email.new_email.email_sent_successfully'
            }));
            dispatch(setLastEmailDate());
            onMailSend();
        },
        onError:() => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message:'email.new_email.email_sent_failed'
            }));
        }
    });


    const sendEmail = () => {
        if (!ticket) {
            return;
        }
        const message: TicketMessageBase = {
            channel: ChannelTypes.Email,
            body: body,
            subject: subject,
            toAddress: emailAddress,
            ticketId: ticket.id!,
            direction: TicketMessagesDirection.Outgoing
        }
        if (ticket.patientId) {
            message.patientId = ticket.patientId
        }
        if (ticket.contactId) {
            message.contactId = ticket.contactId
        }
        if (!ticket.assignee || ticket.assignee !== id) {
            changeAssigneeMutation.mutate({assignee: id, ticketId: ticket.id!});
        }
        sendEmailMutation.mutate(message);
    }

    const{isFetching: isProcessing} = useQuery([ProcessTemplate, selectedTemplate?.id!], () =>
            processTemplate(selectedTemplate?.id!, ticket, patient, contact),
        {
            enabled: !!selectedTemplate && !!selectedTemplate?.requirePreProcessing,
            onSuccess: (data) => {
                setBody(data.content);
                setSubject(data.subject);
            }
        });

    const onTemplateSelect = (template: NotificationTemplate) => {
        if (!template.requirePreProcessing) {
            setBody(template.content);
            setSubject(template.subject);
        } else {
            setSelectedTemplate(template);
        }
    }

    const goBack = () => {
        history.replace(`${EmailPath}/${NEW_EMAIL}`);
    }

    const archiveTicketMutation = useMutation(setDelete, {
        onSuccess: () => {
            dispatch(setEmailNewTicketId(undefined));
            goBack();
            getEmailsQuery.refetch().then();
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('email.inbox.archive_ticket.failure')
            }));
        }
    });

    const discard= () => {
        if (ticket.id === emailNewTicketId) {
            archiveTicketMutation.mutate({
                id: ticket.id
            });
        } else {
            goBack();
        }
    }

    return <div className='flex flex-col first-email'>
        {selectedTemplate &&<div className='flex flex-row pl-16 pt-4'>
            <div className='body2-medium pr-2'>{t('email.new_email.template_label')}</div>
            <div className='body2'>{selectedTemplate?.displayText}</div>
        </div>}
    <div className='pr-20 pt-4 pb-10 flex flex-row'>
        <div className='w-14 h-14 flex items-center justify-center'>
            <NotificationTemplateSelect isLoading={isProcessing}
                                        channel={NotificationTemplateChannel.Email}
                                        usedFrom={TemplateUsedFrom.Inbox}
                                        placement='bottom'
                                        onSelect={(template) => onTemplateSelect(template)}/>
        </div>
        <div className='w-full'>
            <div className="w-full">
                <Input
                    name='subject'
                    type='text'
                    value={subject}
                    maxLength={MaxEmailSubjectLength}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                    label='email.new_email.subject'
                    containerClassName='w-full'
                    required={true}
                    disabled={isEmailAddressBlocked?.isActive}
                />
                <EmailEditor showSendIcon={false} content={body} onChange={(content) => {setBody(content)}} isDisabled={isEmailAddressBlocked?.isActive} />
                {isEmailAddressBlocked?.isActive && <div className='pt-4'>
                                <Alert message={'email.new_email.blocked'} type='error'/>
                </div>}
                <div className='flex flex-row space-x-8 pt-10'>
                    <Button label='email.new_email.discard' buttonType='secondary-big' onClick={() => discard()} />
                    <Button data-testid={"send-email"} label='email.new_email.send' isLoading={sendEmailMutation.isLoading} buttonType='big' disabled={!subject || !body || isEmailAddressBlocked?.isActive || isEmailAddressBlockedLoading || isEmailAddressBlockedFetching} onClick={() => sendEmail()} />
                </div>
            </div>
        </div>
    </div>
    </div>
}

export default SendFirstEmail;
