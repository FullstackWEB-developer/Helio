import {useTranslation} from 'react-i18next';
import Input from '@components/input';
import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import TextArea from '@components/textarea/textarea';
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {useDispatch, useSelector} from 'react-redux';
import {ChannelTypes, CommunicationDirection, TicketMessagesDirection} from '@shared/models';
import Button from '@components/button/button';
import {selectBotContext} from '@pages/ccp/store/ccp.selectors';
import ParentExtraTemplate from '@components/notification-template-select/components/parent-extra-template';
import {GetContactById, GetIsSMSBlocked, ProcessTemplate} from '@constants/react-query-constants';
import utils from '@shared/utils/utils';
import {processTemplate} from '@shared/services/notifications.service';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';
import Alert from '@components/alert/alert';
import {getContactById} from '@shared/services/contacts.service';
import { isUserPhoneBlocked } from '@pages/blacklists/services/blacklists.service';

const SmsContext = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const botContext = useSelector(selectBotContext);
    const [smsText, setSmsText] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate>();
    const [patientName, setPatientName] = useState<string>('');
    const [contactName, setContactName] = useState<string>('');
    const [refreshTemplate, setRefreshTemplate] = useState<number>(0);
    const [noteDisabledText, setNoteDisabledText] = useState<string>();
    const [lastSMSAddress, setLastSMSAddress] = useState<string>();
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [displayName, setDisplayName] = useState<string>();

    useEffect(() => {
        if (botContext?.patient) {
            setPatientName(utils.stringJoin(' ', botContext.patient.firstName, botContext.patient.lastName));
            setLastSMSAddress(botContext.patient.mobilePhone);
        }
        if (botContext?.contactId && botContext?.ticket?.createdForName) {
            setContactName(botContext.ticket.createdForName);
            fetchContact();
            setLastSMSAddress(botContext.ticket.originationNumber);
        }
    }, [botContext?.contactId, botContext?.patient]);

    const {data: contact, refetch: fetchContact, isFetching: isFetchingContact} = useQuery([GetContactById, botContext?.contactId], () => getContactById(botContext?.contactId),
        {
            enabled: false
        });

    const {data: isSMSAddressBlocked} = useQuery([GetIsSMSBlocked, lastSMSAddress], () => isUserPhoneBlocked(lastSMSAddress), {
        enabled: !!lastSMSAddress,
    });

    useEffect(() => {
        let hipaaVerified = botContext?.attributes?.find(a => a.label === "HIPAAVerified")?.value === "true";
        let callingPhoneNumber = botContext?.attributes?.find(a => a.label === "CallingPhoneNumber")?.value;
        if (hipaaVerified && !!callingPhoneNumber && !!botContext?.patient) {
            if (botContext.patient?.mobilePhone !== callingPhoneNumber) {
                setPhoneNumber(callingPhoneNumber);
                setDisplayName(utils.formatPhone(callingPhoneNumber));
            }
        } else if (!!patientName) {
            if (!!botContext?.patient?.mobilePhone) {
                setPhoneNumber(botContext.patient.mobilePhone);
            }
            setDisplayName(patientName);
        }else if (!!contactName) {
            setDisplayName(contactName);
        }

    }, [botContext?.attributes, contactName, patientName, contact, botContext?.patient])

    const {isFetching: isProcessing} = useQuery([ProcessTemplate, selectedTemplate?.id!], () =>
        processTemplate(selectedTemplate?.id!, botContext.ticket!, botContext.patient, contact),
        {
            enabled: !!botContext && botContext.ticket && !!selectedTemplate?.requirePreProcessing,
            onSuccess: (data) => {
                setSmsText(data.content);
            }
        });

    const templateSelected = (template: NotificationTemplate) => {
        if (template) {
            setSelectedTemplate(template);
            if (!template.requirePreProcessing) {
                setSmsText(template.content);
            }
        } else {
            setSmsText('');
        }
    }


    useEffect(() => {
        if (isSMSAddressBlocked?.isActive && botContext?.patient) {
            setNoteDisabledText('ccp.sms_context.patient_number_blocked');
        }else if (isSMSAddressBlocked?.isActive && botContext?.contactId) {
            setNoteDisabledText('ccp.sms_context.contact_number_blocked');
        }else if(isSMSAddressBlocked?.isActive) {
            setNoteDisabledText('ccp.sms_context.unknown_number_blocked');
        }
    }, [isSMSAddressBlocked]);

    useEffect(() => {
        setLastSMSAddress(phoneNumber);
    }, [phoneNumber]);

    const sendSmsMutation = useMutation(sendMessage, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.sms_send_success'
            }));
            setSmsText('');
            setRefreshTemplate(refreshTemplate + 1);
            setSelectedTemplate(undefined);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_detail.sms_send_fail'
            }));
        }
    });

      useEffect(() => {
        if (
          botContext?.ticket &&
          botContext.ticket.communicationDirection ===
            CommunicationDirection.Outbound &&
          botContext?.patient &&
          !botContext.patient.consentToText
        ) {
          setNoteDisabledText("ccp.sms_context.no_consent");
        }
      }, [botContext?.patient, botContext?.ticket]);
    
    const sendSms = async () => {
        if (botContext.ticket?.id && phoneNumber && botContext?.patient) {
            sendSmsMutation.mutate({
                body: smsText,
                ticketId: botContext.ticket?.id,
                channel: ChannelTypes.SMS,
                toAddress: phoneNumber,
                patientId: botContext.patient.patientId,
                recipientName: patientName,
                direction: TicketMessagesDirection.Outgoing
            });
        }
        else if (botContext?.ticket?.id && botContext?.contactId && contact?.mobilePhone) {
            sendSmsMutation.mutate({
                body: smsText,
                ticketId: botContext.ticket?.id,
                channel: ChannelTypes.SMS,
                toAddress: contact.mobilePhone,
                contactId: botContext.contactId,
                recipientName: contactName,
                direction: TicketMessagesDirection.Outgoing
            });
        }
    }

    return <div className='pb-6 flex-1'>
        <div className='px-6 flex flex-col'>
            <div className='flex items-center h7 h-12'>{t('ccp.sms_context.title')}</div>
            <div className='flex flex-col'>
                <div className='pt-4 w-4/5'>
                    <Input disabled={true} name='to' value={displayName} label='ccp.sms_context.to' />
                </div>
                <div className='w-4/5'>
                    <NotificationTemplateSelect selectLabel='ccp.sms_context.select_template'
                        asSelect={true}
                        disabled={!!noteDisabledText}
                        resetValue={refreshTemplate}
                        channel={NotificationTemplateChannel.Sms}
                        usedFrom={TemplateUsedFrom.CCP}
                        onSelect={templateSelected} />
                </div>
                {
                    selectedTemplate &&
                    <div>
                        <ParentExtraTemplate parentType='ccp' logicKey={selectedTemplate?.logicKey} patient={botContext?.patient} />
                    </div>
                }

                {!!noteDisabledText && <div className='pb-4'>
                    <Alert message={noteDisabledText} type='error' />
                </div>}

                <div>
                    <TextArea
                        className='body2 w-full'
                        data-test-id='note-context-notes'
                        value={smsText}
                        required={true}
                        rows={3}
                        minRows={6}
                        resizable={false}
                        disabled={!(!!botContext?.patient?.mobilePhone || !!contact?.mobilePhone) || !!noteDisabledText}
                        hasBorder={true}
                        label='ccp.sms_context.message'
                        onChange={(message) => setSmsText(message)}
                    />
                </div>
                <div className='flex flex-row space-x-4 pt-6'>
                    <div>
                        <Button buttonType='small' label='ccp.sms_context.send' onClick={sendSms}
                            disabled={(!(!!phoneNumber || !!contact?.mobilePhone) || !!noteDisabledText)
                                || isProcessing || isFetchingContact}
                            isLoading={sendSmsMutation.isLoading || isProcessing} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default SmsContext;
