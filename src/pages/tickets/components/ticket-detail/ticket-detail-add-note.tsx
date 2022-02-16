import React, {useEffect, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {TicketNote} from '../../models/ticket-note';
import {addNote, setAssignee} from '../../services/tickets.service';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {Icon} from '@components/svg-icon/icon';
import TextArea from '@components/textarea/textarea';
import {useDispatch, useSelector} from 'react-redux';
import Tabs from '@components/tab/Tabs';
import Tab from '@components/tab/Tab';
import './ticket-detail-add-note.scss';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {
    ChannelTypes,
    Contact, EmailMessageDto,
    PagedList,
    TicketMessage,
    TicketMessageBase,
    TicketMessagesDirection
} from '@shared/models';
import utils from '@shared/utils/utils';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import {ProcessTemplate, QueryTicketMessagesInfinite} from '@constants/react-query-constants';
import {processTemplate} from '@shared/services/notifications.service';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import ParentExtraTemplate from '@components/notification-template-select/components/parent-extra-template';
import SelectedTemplateInfo from '@components/notification-template-select/components/selected-template-info';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {CommonQueryData} from '@shared/models/query-data.model';
import Input from '@components/input';
import Alert from '@components/alert/alert';
interface TicketDetailAddNoteProps {
    ticket: Ticket,
    patient?: ExtendedPatient;
    contact?: Contact;
    emailMessages?: PagedList<TicketMessage | EmailMessageDto>;
    smsMessages?: PagedList<TicketMessage | EmailMessageDto>;
}

const TicketDetailAddNote = ({ticket, patient, contact, emailMessages, smsMessages}: TicketDetailAddNoteProps) => {
    dayjs.extend(relativeTime)

    enum ChannelTabs {
        NotesTab = 0,
        SmsTab,
        EmailTab
    }

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [noteText, setNoteText] = useState<string>('');
    const [smsText, setSmsText] = useState<string>('');
    const [emailText, setEmailText] = useState<string>('');
    const [emailSubject, setEmailSubject] = useState<string>(t('ticket_detail.email_subject', {'ticketNumber': ticket.ticketNumber}));
    const [emailAddress, setEmailAddress] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [recipientName, setRecipientName] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<ChannelTabs>(ChannelTabs.NotesTab);
    const [selectedMessageTemplate, setSelectedMessageTemplate] = useState<NotificationTemplate>();
    const queryClient = useQueryClient();
    const [noteDisabledText, setNoteDisabledText] = useState<string>();
    const [disabledTab, setDisabledTab] = useState<ChannelTabs>();
    const [emailDisabledText, setEmailDisabledText] = useState<string>();
    const [richTextMode, setRichTextMode] = useState(false);
    const [ticketHasEmailMessages, setTicketHasEmailMessages] = useState(!!queryClient.getQueryData<CommonQueryData>([QueryTicketMessagesInfinite, ChannelTypes.Email, ticket.id])?.results?.length);
    const {isLoading: isProcessing} = useQuery([ProcessTemplate, selectedMessageTemplate?.id!], () =>
        processTemplate(selectedMessageTemplate?.id!, ticket, patient, contact),
        {
            enabled: !!selectedMessageTemplate?.requirePreProcessing,
            onSuccess: (data) => {
                switch (selectedTab) {
                    case ChannelTabs.EmailTab:
                        setRichTextMode(true);
                        setEmailText(data.content);
                        setEmailSubject(data.subject)
                        break;
                    case ChannelTabs.SmsTab:
                        setSmsText(data.content);
                        break;
                }
            }
        });


    useEffect(() => {
        if (selectedTab === ChannelTabs.SmsTab) {
            if (!smsMessages?.results || smsMessages.results.length === 0) {
                setNoteDisabledText(undefined);
                return;
            }
            const lastMessage = smsMessages.results[smsMessages.results.length - 1];
            const lastSmsAddress = lastMessage.direction === TicketMessagesDirection.Outgoing ? lastMessage.toAddress : lastMessage.fromAddress;
            if (patient && (!patient.consentToText || patient.mobilePhone !== lastSmsAddress)) {
                setNoteDisabledText('sms.sms_not_available_patient');
                setDisabledTab(ChannelTabs.SmsTab);
            } else if (contact && contact.mobilePhone !== lastSmsAddress) {
                setNoteDisabledText('sms.sms_not_available_contact');
                setDisabledTab(ChannelTabs.SmsTab);
            }
            else {
                setNoteDisabledText(undefined);
                setDisabledTab(undefined);
            }
        } if (selectedTab === ChannelTabs.EmailTab) {
            if (!emailMessages?.results || emailMessages.results.length === 0) {
                setNoteDisabledText(undefined);
                return;
            }
            const lastMessage = emailMessages.results[emailMessages.results.length - 1];
            const lastEmailAddress = lastMessage.direction === TicketMessagesDirection.Outgoing ? lastMessage.toAddress : lastMessage.fromAddress;
            if (patient) {
                if (patient.emailAddress !== lastEmailAddress) {
                    setNoteDisabledText('email.inbox.email_not_available_patient');
                    setDisabledTab(ChannelTabs.EmailTab);
                }
            } else if (contact) {
                if (contact.emailAddress !== lastEmailAddress) {
                    setNoteDisabledText('email.inbox.email_not_available_contact');
                    setDisabledTab(ChannelTabs.EmailTab);
                }
            }
            else {
                setNoteDisabledText(undefined);
                setDisabledTab(undefined);
            }
        }
    }, [patient, ticket, contact, selectedTab, emailMessages])

    const determineEmailSubject = () => {
        if (ticketHasEmailMessages) {
            const emails = queryClient.getQueryData<CommonQueryData>([QueryTicketMessagesInfinite, ChannelTypes.Email, ticket.id])?.results;
            return emails && emails[0]?.subject ? emails[0].subject : t('ticket_detail.email_subject', {'ticketNumber': ticket.ticketNumber});
        }
        else if (emailSubject && emailSubject !== t('ticket_detail.email_subject', {'ticketNumber': ticket.ticketNumber})) {
            return emailSubject;
        }
        else {
            return t('ticket_detail.email_subject', {'ticketNumber': ticket.ticketNumber});
        }
    }

    const addNoteMutation = useMutation(addNote, {
        onSuccess: (data) => {
            dispatch(setTicket(data));
            clear();
        }
    });

    const isTicketDisabled = useMemo(() => {
        return ticket && (ticket.status === TicketStatuses.Solved || ticket.status === TicketStatuses.Closed || ticket.isDeleted);
    }, [ticket])

    useEffect(() => {
        if (isTicketDisabled) {
            setSmsText('');
            setEmailText('');
            setEmailSubject('');
        }
    }, [isTicketDisabled]);

    useEffect(() => {
        if (!!patient) {
            setRecipientName(utils.stringJoin(' ', patient.firstName, patient.lastName));
            if (!!patient.mobilePhone) {
                setMobileNumber(patient.mobilePhone);
            }
            if (!!patient.emailAddress) {
                setEmailAddress(patient.emailAddress);
            }
        } else if (!!contact) {
            setRecipientName(contact.isCompany ? contact.companyName : utils.stringJoin(' ', contact.firstName, contact.lastName));
            if (!!contact.mobilePhone) {
                setMobileNumber(contact.mobilePhone);
            }
            if (!!contact.primaryEmailAddress) {
                setEmailAddress(contact.primaryEmailAddress);
            }
            if (!!contact.emailAddress) {
                setEmailAddress(contact.emailAddress);
            }
        }
        else {
            if (ticket?.incomingEmailAddress) {
                setEmailAddress(ticket.incomingEmailAddress);
            }
        }
    }, [patient, contact, ticket]);

    const sendSmsMutation = useMutation(sendMessage, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.sms_send_success',
                position: SnackbarPosition.TopCenter
            }));

            clear();
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_detail.sms_send_fail',
                position: SnackbarPosition.TopCenter
            }));
        }
    });

    const clear = () => {
        if (emailText) {
            setRichTextMode(false);
            setEmailText('');
            setEmailSubject('');
            setSelectedMessageTemplate(undefined);
            queryClient.invalidateQueries([QueryTicketMessagesInfinite, ChannelTypes.Email, ticket.id]).then();
        }
        if (smsText) {
            setSmsText('');
            setSelectedMessageTemplate(undefined);
            queryClient.invalidateQueries([QueryTicketMessagesInfinite, ChannelTypes.SMS, ticket.id]).then();
        }
        if (noteText) {
            setNoteText('');
        }
    }

    const sendEmailMutation = useMutation(sendMessage, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.email_send_success',
                position: SnackbarPosition.TopCenter
            }));
            setTicketHasEmailMessages(true);
            clear();
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_detail.email_send_fail',
                position: SnackbarPosition.TopCenter
            }));
        }
    });

    const changeAssigneeMutation = useMutation(setAssignee);
    const {id} = useSelector(selectAppUserDetails);

    const sendNote = async () => {
        const note: TicketNote = {
            noteText: noteText,
            isVisibleToPatient: false
        };
        if (ticket.id) {
            addNoteMutation.mutate({
                ticketId: ticket.id,
                note
            });
        }
    }

    const sendEmail = async () => {
        if (ticket.id && emailAddress) {
            if (!ticket.assignee || ticket.assignee !== id) {
                changeAssigneeMutation.mutate({assignee: id, ticketId: ticket.id!});
            }
            const subject = determineEmailSubject();
            sendEmailMutation.mutate({
                body: emailText,
                subject,
                ticketId: ticket.id,
                channel: ChannelTypes.Email,
                toAddress: emailAddress,
                recipientName,
                direction: TicketMessagesDirection.Outgoing
            });
        }
    }


    const sendSms = async () => {
        if (ticket.id) {
            let message: TicketMessageBase = {
                body: smsText,
                ticketId: ticket.id,
                channel: ChannelTypes.SMS,
                toAddress: mobileNumber,
                recipientName,
                direction: TicketMessagesDirection.Outgoing
            };
            if (patient) {
                message.patientId = patient.patientId
            }
            sendSmsMutation.mutate(message);
        }
    }

    const onTemplateSelect = (template: NotificationTemplate) => {
        setSelectedMessageTemplate(template);
        if (!template.requirePreProcessing) {
            switch (selectedTab) {
                case ChannelTabs.EmailTab:
                    setRichTextMode(true);
                    setEmailSubject(template.subject);
                    setEmailText(template.content);
                    break;
                case ChannelTabs.SmsTab:
                    setSmsText(template.content);
                    break;
            }
        }
    }

    const onTabChange = (tabIndex: number) => {
        setSelectedTab(tabIndex);
        setTicketHasEmailMessages(!!queryClient.getQueryData<CommonQueryData>([QueryTicketMessagesInfinite, ChannelTypes.Email, ticket.id])?.results?.length);
        setRichTextMode(false);
        setSelectedMessageTemplate(undefined);
        setSmsText('');
        setNoteText('');
        setEmailText('');
        setEmailSubject('');
    }

    const isTabDisabled = useMemo(() => {
        return !!noteDisabledText && disabledTab === selectedTab;
    }, [noteDisabledText, disabledTab, selectedTab]);

    const isSendSmsDisabled = useMemo(() => {
        return !mobileNumber || isTicketDisabled;
    }, [isTicketDisabled, mobileNumber]);

    const isSendEmailDisabled = useMemo(() => {
        if (selectedTab === ChannelTabs.EmailTab && isTabDisabled) {
            setEmailDisabledText('');
            return true;
        }
        if (!emailAddress || isTicketDisabled) {
            setEmailDisabledText('ticket_detail.reopen_or_create_to_send_email');
            return true;
        }
        return
    }, [isTicketDisabled, emailAddress, selectedTab, noteDisabledText])


    return <>
        {isTabDisabled && noteDisabledText && <div className='pb-4 px-16'>
            <Alert message={noteDisabledText} type='error'/>
        </div>}
        <div className='pb-6 pr-16 ticket-add-message-body'>
            <div className='flex flex-row items-end'>
                <div className='flex w-16 h-full pb-4 pl-4 cursor-pointer'>
                    {(selectedTab === ChannelTabs.SmsTab || selectedTab === ChannelTabs.EmailTab) &&
                        <NotificationTemplateSelect
                            disabled={(!emailAddress && !mobileNumber) || isTabDisabled}
                            usedFrom={TemplateUsedFrom.TicketDetail}
                            channel={selectedTab === 1 ? NotificationTemplateChannel.Sms : NotificationTemplateChannel.Email}
                            onSelect={(template) => onTemplateSelect(template)}
                            isLoading={isProcessing}
                        />
                    }
                </div>
                <div className='w-full pt-4'>
                    <Tabs hasBorder={false} onSelect={(tabIndex: number) => onTabChange(tabIndex)}>
                        <Tab title={t('ticket_detail.internal_note_title')}>
                            <div className='pt-6' />
                            <TextArea
                                className='w-full pl-2 pr-0 body2'
                                data-test-id='ticket-add-notes'
                                placeHolder={t('ticket_detail.add_note')}
                                required={true}
                                rows={2}
                                maxRows={5}
                                resizable={false}
                                isLoading={addNoteMutation.isLoading}
                                hasBorder={false}
                                value={noteText}
                                onChange={(message) => setNoteText(message)}
                                iconClassNames='icon-medium'
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={sendNote}
                            />
                        </Tab>
                        <Tab title={t('ticket_detail.send_sms_title')}>
                            <div className='pt-6'>
                                <SelectedTemplateInfo selectedMessageTemplate={selectedMessageTemplate} />
                            </div>
                            {selectedMessageTemplate && <div>
                                <ParentExtraTemplate logicKey={selectedMessageTemplate?.logicKey} patient={patient}
                                    parentType='ticket' />
                                <div className='pb-4' />
                            </div>}
                            <TextArea
                                className='w-full pl-2 pr-0 body2'
                                data-test-id='ticket-send-sms'
                                placeHolder={t(isSendSmsDisabled ? 'ticket_detail.reopen_or_create_to_send_sms' : 'ticket_detail.add_note')}
                                required={true}
                                rows={2}
                                maxRows={5}
                                key='sms'
                                resizable={false}
                                isLoading={sendSmsMutation.isLoading || isProcessing}
                                value={smsText}
                                disabled={isSendSmsDisabled || isTabDisabled}
                                hasBorder={false}
                                showFormatting={false}
                                onChange={(message) => setSmsText(message)}
                                iconClassNames='icon-medium'
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={sendSms}
                            />
                        </Tab>

                        <Tab title={t('ticket_detail.send_email_title')}>
                            <div className='pt-2' />
                            {selectedMessageTemplate && <div className='pt-3'>
                                <SelectedTemplateInfo selectedMessageTemplate={selectedMessageTemplate} />
                            </div>}
                            {selectedMessageTemplate && <div>
                                <ParentExtraTemplate logicKey={selectedMessageTemplate?.logicKey}
                                    parentType='ticket'
                                    patient={patient} />
                            </div>}
                            {
                                !ticketHasEmailMessages && !isSendEmailDisabled &&
                                <Input
                                    name='subject'
                                    type='text'
                                    value={emailSubject}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailSubject(e.target.value)}
                                    label='email.new_email.subject'
                                    containerClassName='w-full pt-4'
                                    required={true}
                                    disabled={isSendEmailDisabled}
                                />
                            }
                            <TextArea
                                className='w-full pl-2 pr-0 body2'
                                data-test-id='ticket-send-email'
                                placeHolder={isSendEmailDisabled ? emailDisabledText : 'ticket_detail.add_note'}
                                required={true}
                                rows={2}
                                maxRows={5}
                                key='email'
                                value={emailText}
                                disabled={isSendEmailDisabled}
                                onChange={(message) => setEmailText(message)}
                                resizable={false}
                                isLoading={sendEmailMutation.isLoading || isProcessing}
                                hasBorder={false}
                                iconClassNames='icon-medium'
                                showFormatting={true}
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={sendEmail}
                                toggleRichTextMode={richTextMode}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    </>
}

export default withErrorLogging(TicketDetailAddNote);
