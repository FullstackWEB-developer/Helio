import React, {useEffect, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {TicketNote} from '../../models/ticket-note';
import {addNote} from '../../services/tickets.service';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {Icon} from '@components/svg-icon/icon';
import TextArea from '@components/textarea/textarea';
import {useDispatch} from 'react-redux';
import Tabs from '@components/tab/Tabs';
import Tab from '@components/tab/Tab';
import './ticket-detail-add-note.scss';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {ChannelTypes, Contact, TicketMessageBase, TicketMessagesDirection} from '@shared/models';
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

interface TicketDetailAddNoteProps {
    ticket: Ticket,
    patient?: ExtendedPatient;
    contact?: Contact;
}

const TicketDetailAddNote = ({ticket, patient, contact}: TicketDetailAddNoteProps) => {
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
    const {isLoading: isProcessing} = useQuery([ProcessTemplate, selectedMessageTemplate?.id!], () =>
        processTemplate(selectedMessageTemplate?.id!, ticket, patient, contact),
        {
            enabled: !!selectedMessageTemplate?.requirePreProcessing,
            onSuccess: (data) => {
                switch (selectedTab) {
                    case ChannelTabs.EmailTab:
                        setEmailText(data.content);
                        setEmailSubject(data.subject)
                        break;
                    case ChannelTabs.SmsTab:
                        setSmsText(data.content);
                        break;
                }
            }
        });

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
            setRecipientName(contact.companyName);
            if (!!contact.mobilePhone) {
                setMobileNumber(contact.mobilePhone);
            }
            if (!!contact.primaryEmailAddress) {
                setEmailAddress(contact.primaryEmailAddress);
            }
        }
    }, [patient, contact]);

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
            setEmailText('');
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
        if (ticket.id) {
            sendEmailMutation.mutate({
                body: emailText,
                subject: emailSubject,
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
        setSelectedMessageTemplate(undefined);
        setSmsText('');
        setNoteText('');
        setEmailText('');
    }

    const isSendSmsDisabled = useMemo(() => {
        return !mobileNumber || isTicketDisabled;
    }, [isTicketDisabled, mobileNumber]);


    return <>
        <div className='pb-6 pr-16 ticket-add-message-body'>
            <div className='flex flex-row items-end'>
                <div className='flex w-16 h-full pb-4 pl-4 cursor-pointer'>
                    {(selectedTab === ChannelTabs.SmsTab || selectedTab === ChannelTabs.EmailTab) &&
                        <NotificationTemplateSelect
                            disabled={!emailAddress && !smsText}
                            channel={selectedTab === 1 ? NotificationTemplateChannel.Sms : NotificationTemplateChannel.Email}
                            onSelect={(template) => onTemplateSelect(template)}
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
                                placeHolder={t('ticket_detail.add_note')}
                                required={true}
                                rows={2}
                                maxRows={5}
                                key='sms'
                                resizable={false}
                                isLoading={sendSmsMutation.isLoading || isProcessing}
                                value={smsText}
                                disabled={isSendSmsDisabled}
                                hasBorder={false}
                                showFormatting={false}
                                onChange={(message) => setSmsText(message)}
                                iconClassNames='icon-medium'
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={sendSms}
                            />
                        </Tab>

                        {
                            // PLEASE DON'T DELETE THIS
                            // <Tab title={t('ticket_detail.send_email_title')}>
                            //     <div className='pt-2' />
                            //     {selectedMessageTemplate && <div className='pt-3'>
                            //         <SelectedTemplateInfo selectedMessageTemplate={selectedMessageTemplate} />
                            //     </div>}
                            //     {selectedMessageTemplate && <div>
                            //         <ParentExtraTemplate logicKey={selectedMessageTemplate?.logicKey}
                            //             parentType='ticket'
                            //             patient={patient} />
                            //     </div>}
                            //     <TextArea
                            //         className='w-full pl-2 pr-0 body2'
                            //         data-test-id='ticket-send-email'
                            //         placeHolder={t('ticket_detail.add_note')}
                            //         required={true}
                            //         rows={2}
                            //         maxRows={5}
                            //         key='email'
                            //         value={emailText}
                            //         disabled={!emailAddress}
                            //         onChange={(message) => setEmailText(message)}
                            //         resizable={false}
                            //         isLoading={sendEmailMutation.isLoading || isProcessing}
                            //         hasBorder={false}
                            //         iconClassNames='icon-medium'
                            //         showFormatting={true}
                            //         icon={Icon.Send}
                            //         iconFill='notes-send'
                            //         iconOnClick={sendEmail}
                            //     />
                            // </Tab>
                        }
                    </Tabs>
                </div>
            </div>
        </div>
    </>
}

export default withErrorLogging(TicketDetailAddNote);
