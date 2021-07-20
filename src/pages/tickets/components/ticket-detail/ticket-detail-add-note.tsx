import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {TicketNote} from '../../models/ticket-note';
import {addNote} from '../../services/tickets.service';
import {useMutation} from 'react-query';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import {Icon} from '@components/svg-icon/icon';
import TextArea from '@components/textarea/textarea';
import {useDispatch} from 'react-redux';
import Tabs from '@components/tab/Tabs';
import Tab from '@components/tab/Tab';
import './ticket-detail-add-note.scss';
import SvgIcon from '@components/svg-icon';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import {ChannelTypes, Contact} from '@shared/models';
import utils from '@shared/utils/utils';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';

interface TicketDetailAddNoteProps {
    ticket: Ticket,
    onNoteAdded: () => void;
    patient?: ExtendedPatient;
    contact?: Contact;
}

const TicketDetailAddNote = ({ticket, onNoteAdded, patient, contact}: TicketDetailAddNoteProps) => {
    dayjs.extend(relativeTime)

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [noteText, setNoteText] = useState<string>('');
    const [smsText, setSmsText] = useState<string>('');
    const [emailText, setEmailText] = useState<string>('');
    const [emailAddress, setEmailAddress] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [recipientName, setRecipientName] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const addNoteMutation = useMutation(addNote, {
        onSuccess: (data) => {
            dispatch(setTicket(data));
            setNoteText('');
            onNoteAdded();
        }
    });

    const handleMobileNumber = (number: string) => {
        if (number.startsWith('+1')) {
            setMobileNumber(number);
        } else {
            setMobileNumber(`+1${number}`);
        }
    }

    useEffect(() => {
        if (!!patient) {
            setRecipientName(utils.stringJoin(' ', patient.firstName, patient.lastName));
            if (!!patient.mobilePhone) {
                handleMobileNumber(patient.mobilePhone);
            }
            if (!!patient.emailAddress) {
                setEmailAddress(patient.emailAddress);
            }
        } else if (!!contact) {
            setRecipientName(contact.companyName);
            if (!!contact.mobilePhone) {
                handleMobileNumber(contact.mobilePhone);
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
                message: 'ticket_detail.sms_send_success'
            }));
            setSmsText('');
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_detail.sms_send_fail'
            }));
        }
    });

    const sendEmailMutation = useMutation(sendMessage, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.email_send_success'
            }));
            setEmailText('');
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_detail.email_send_fail'
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
                subject: t('ticket_detail.email_subject', {'ticketNumber': ticket.ticketNumber}),
                ticketId: ticket.id,
                channel: ChannelTypes.Email,
                toAddress: emailAddress,
                recipientName
            });
        }
    }

    const sendSms = async () => {
        if (ticket.id) {
            sendSmsMutation.mutate({
                body: smsText,
                ticketId: ticket.id,
                channel: ChannelTypes.SMS,
                toAddress: mobileNumber,
                recipientName
            });
        }
    }

    return <>
        <div className='ticket-add-message-body pr-16 pb-6'>
            <div className='flex flex-row items-end'>
                <div className='w-16 pl-4 pb-4 flex h-full'>
                    {(selectedTab === 1 || selectedTab === 2) &&
                    <SvgIcon type={Icon.Templates} fillClass='rgba-05-fill' className='icon-medium'/>
                    }
                </div>
                <div className='w-full pt-4'>
                    <Tabs hasBorder={false} onSelect={(tabIndex) => setSelectedTab(tabIndex)}>
                        <Tab title={t('ticket_detail.internal_note_title')}>
                            <div className='pt-6'/>
                            <TextArea
                                className='pl-6 pr-0 body2 w-full'
                                data-test-id='ticket-add-notes'
                                placeHolder={t('ticket_detail.add_note')}
                                required={true}
                                rows={2}
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
                            <div className='pt-6'/>
                            <TextArea
                                className='pl-6 pr-0 body2 w-full'
                                data-test-id='ticket-add-notes'
                                placeHolder={t('ticket_detail.add_note')}
                                required={true}
                                rows={2}
                                resizable={false}
                                isLoading={sendSmsMutation.isLoading}
                                value={smsText}
                                disabled={!mobileNumber}
                                hasBorder={false}
                                onChange={(message) => setSmsText(message)}
                                iconClassNames='icon-medium'
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={sendSms}
                            />
                        </Tab>
                        <Tab title={t('ticket_detail.send_email_title')}>
                            <div className='pt-6'/>
                            <TextArea
                                className='pl-6 pr-0 body2 w-full'
                                data-test-id='ticket-send-email'
                                placeHolder={t('ticket_detail.add_note')}
                                required={true}
                                rows={2}
                                value={emailText}
                                disabled={!emailAddress}
                                onChange={(message) => setEmailText(message)}
                                resizable={false}
                                isLoading={sendEmailMutation.isLoading}
                                hasBorder={false}
                                iconClassNames='icon-medium'
                                icon={Icon.Send}
                                iconFill='notes-send'
                                iconOnClick={sendEmail}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    </>
}

export default withErrorLogging(TicketDetailAddNote);
