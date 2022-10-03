import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import SmsChatMessageList from '../sms-chat-message/sms-chat-message-list';
import {
    ChannelTypes,
    ContactExtended,
    ContactType,
    TicketMessage,
    TicketMessagesDirection,
    TicketMessageSummary
} from '@shared/models';
import {useDispatch} from 'react-redux';
import classnames from 'classnames';
import utils from '@shared/utils/utils';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import './sms-chat.scss';
import {getEnumByType, getTicketById} from '@pages/tickets/services/tickets.service';
import {getLookupValues} from '@shared/services/lookups.service';
import {Icon} from '@components/svg-icon';
import TextArea from '@components/textarea/textarea';
import SelectedTemplateInfo from '@components/notification-template-select/components/selected-template-info';
import ParentExtraTemplate from '@components/notification-template-select/components/parent-extra-template';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {useQuery} from 'react-query';
import {
    GetIsSMSBlocked,
    GetPatientPhoto,
    ProcessTemplate,
    QueryContactsInfinite,
    QueryGetPatientById,
    QueryTickets
} from '@constants/react-query-constants';
import {getPatientByIdWithQuery, getPatientPhoto} from '@pages/patients/services/patients.service';
import {processTemplate} from '@shared/services/notifications.service';
import {getContactById} from '@shared/services/contacts.service';
import ConversationHeader from '@components/conversation-header/conversation-header';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';
import Alert from '@components/alert/alert';
import { isUserPhoneBlocked } from '@pages/blacklists/services/blacklists.service';

interface SmsChatProps {
    info: TicketMessageSummary;
    messages?: TicketMessage[];
    isLoading?: boolean;
    isSending?: boolean;
    isBottomFocus?: boolean;
    onSendClick: (toAddress: string, text: string) => void;
    onFetchMore?: () => void;
    lastMessageSendTime?: Date;
}

const SmsChat = ({info, isLoading, isSending, isBottomFocus, messages = [], lastMessageSendTime, ...props}: SmsChatProps) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [smsDisabledText, setSmsDisabledText] = useState<string>();
    const messageListContainerRef = useRef<HTMLDivElement>(null);
    const [smsText, setSmsText] = useState<string>();
    const topMessagePosition = useRef<number>();
    
    const [lastSMSAddress, setLastSMSAddress] = useState<string>();
    const [selectedMessageTemplate, setSelectedMessageTemplate] = useState<NotificationTemplate>();

    const {data: patient, isFetching: isFetchingPatient} = useQuery([QueryGetPatientById, info.patientId], () => getPatientByIdWithQuery(info.patientId!), {
        enabled: !!info.patientId
    });

    const {data: patientPhoto} = useQuery([GetPatientPhoto, info.patientId], () => getPatientPhoto(info.patientId!), {
        enabled: !!info.patientId
    });

    const {data: contact, isFetching: isFetchingContact} = useQuery<ContactExtended>([QueryContactsInfinite, info.contactId], () => getContactById(info.contactId!), {
        enabled: !!info.contactId
    })

    const {data: ticket, refetch: refetchTicket, isFetching: isFetchingTicket} = useQuery([QueryTickets, info.ticketId], () => getTicketById(info.ticketId!), {
        enabled: !!info.ticketId
    });

    const {data: isSMSAddressBlocked} = useQuery([GetIsSMSBlocked, lastSMSAddress], () => isUserPhoneBlocked(lastSMSAddress), {
        enabled: !!lastSMSAddress,
    });

    const sendToNumber = useMemo(() => {
        let mobilePhone = patient?.mobilePhone ?? contact?.mobilePhone;
        if (!mobilePhone) {
            mobilePhone = info.createdForEndpoint;
        }
        return mobilePhone;
    }, [patient?.mobilePhone, contact?.mobilePhone, info.createdForEndpoint]);

    useEffect(() => {
        let lastMessage : TicketMessage;
        let lastSmsAddress : string | undefined;
        if (messages && messages.length > 0) {
            lastMessage = messages[messages.length - 1];
            lastSmsAddress = lastMessage.direction === TicketMessagesDirection.Outgoing ? lastMessage.toAddress : lastMessage.fromAddress;
        }
        let originalNumber = info?.createdForEndpoint || ticket?.originationNumber || lastSmsAddress;
        if (originalNumber && originalNumber.startsWith('+1')) {
            originalNumber = originalNumber.substring(2);
        }
        setLastSMSAddress(originalNumber);
        if (patient && (!patient.consentToText || patient.mobilePhone !== originalNumber) && isSMSAddressBlocked?.isActive) {
            setSmsDisabledText('sms.sms_not_available_patient_phone_blocked');
        } else if (patient && (!patient.consentToText || patient.mobilePhone !== originalNumber)) {
            setSmsDisabledText('sms.sms_not_available_patient');
        } else if (contact && contact.mobilePhone !== originalNumber && isSMSAddressBlocked?.isActive) {
            setSmsDisabledText('sms.sms_not_available_contact_phone_blocked');
        } else if (contact && contact.mobilePhone !== originalNumber) {
            setSmsDisabledText('sms.sms_not_available_contact');
        } else if (ticket?.isPassive && isSMSAddressBlocked?.isActive) {
            setSmsDisabledText('sms.ticket_closed_and_sms_blocked');
        } else if (ticket?.isPassive) {
            setSmsDisabledText('sms.ticket_closed');
        } else if (isSMSAddressBlocked?.isActive) {
            setSmsDisabledText('sms.unknown_sms_blocked');
        } else {
            setSmsDisabledText(undefined);
        }
    }, [patient, ticket, contact, info, isSMSAddressBlocked])

    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);

    useEffect(() => {
        setSmsText('');
    }, [lastMessageSendTime]);

    const {isLoading: isProcessing} = useQuery([ProcessTemplate, selectedMessageTemplate?.id!], () =>
        processTemplate(selectedMessageTemplate?.id!, ticket, patient),
        {
            enabled: !!selectedMessageTemplate?.requirePreProcessing,
            onSuccess: (data) => {
                setSmsText(data.content);
            }
        });

    useEffect(() => {
        if (messages.length < 1 || !messageListContainerRef.current) {
            return;
        }
        const topMessage = messageListContainerRef.current.getElementsByClassName('is-top');
        if (!topMessage || topMessage.length < 1) {
            return;
        }
        topMessagePosition.current = utils.getElementPosition(topMessage[0], messageListContainerRef.current).top;
    }, [messages, messages.length]);

    useLayoutEffect(() => {
        if (!messageListContainerRef.current || !topMessagePosition.current) {
            return;
        }
        messageListContainerRef.current?.scrollTo(0, topMessagePosition.current);
    }, [messages, messages.length]);

    const onScroll = (event: any) => {
        if (props.onFetchMore && event.target.scrollHeight <= event.scrollTop + event.clientHeight) {
            props.onFetchMore();
        }
    }

    const onTemplateSelect = (template: NotificationTemplate) => {
        setSelectedMessageTemplate(template);
        if (!template.requirePreProcessing) {
            setSmsText(template.content);
        }
    }

    const EmptyMessage = () => {
        return (<div className='flex flex-col mt-7'>
            <h6 className='mb-4'>{t('sms.chat.empty.title')}</h6>
            <p className='body2'>{t('sms.chat.empty.description')}</p>
        </div>);
    }



    const onSend = () => {
        if (!smsText) {
            return;
        }

        if (sendToNumber) {
            props.onSendClick(sendToNumber, smsText);
        }
        setSelectedMessageTemplate(undefined);
    }

    const getUserFullName = () => {
        if (contact && contact.type === ContactType.Company) {
            return contact.companyName
        }

        if (contact && contact.type === ContactType.Individual) {
            return contact.firstName + " " + contact.lastName;
        }

        if (patient) {
            return patient.firstName + " " + patient.lastName;
        }

        return "";
    }

    const showBodyLoader = isLoading || isFetchingContact || isFetchingPatient || isFetchingTicket;

    return (<div className="flex flex-col justify-between flex-auto h-full sms-chat">
        <ConversationHeader ticket={ticket}
            refetchTicket={refetchTicket}
            info={info} forNewTicketMessagePurpose={false} patientPhoto={patientPhoto} conversationChannel={ChannelTypes.SMS} userFullName={getUserFullName()} />
        {
             showBodyLoader ? <Spinner fullScreen /> :
                <>
                    <div className="flex flex-col flex-1 pl-6 overflow-y-auto">
                        {messages && messages.length > 0 &&
                            <>
                                <div className={classnames('flex flex-row justify-center', {'hidden': !isLoading})}>
                                    <Spinner />
                                </div>
                                <div ref={messageListContainerRef} className='flex flex-col h-full overflow-y-auto pb-6' onScroll={onScroll}>
                                    <SmsChatMessageList messages={messages} patientPhoto={patientPhoto} />
                                    <AlwaysScrollToBottom enabled={!isBottomFocus} />
                                </div>
                            </>
                        }
                        {(!messages || messages.length < 1) &&
                            <EmptyMessage />
                        }
                    </div>
                    {!!smsDisabledText && <div className='unavailable-sms pb-4'>
                        <Alert message={smsDisabledText} type='error' />
                    </div>}
                    <div className="flex flex-col justify-center pt-4 pb-4 pl-6 pr-16 sms-chat-footer">
                        <div className='flex flex-row items-end'>
                            <div className='pb-6 mr-3'>
                                <NotificationTemplateSelect
                                    disabled={!!smsDisabledText}
                                    channel={NotificationTemplateChannel.Sms}
                                    onSelect={(template) => onTemplateSelect(template)}
                                    usedFrom={TemplateUsedFrom.Inbox}
                                />
                            </div>
                            <div className='flex flex-col w-full py-5'>
                                <SelectedTemplateInfo selectedMessageTemplate={selectedMessageTemplate} />
                                {selectedMessageTemplate && <div>
                                    <ParentExtraTemplate logicKey={selectedMessageTemplate?.logicKey} patient={patient} parentType='sms' />
                                </div>}
                                {selectedMessageTemplate && <div className='pb-5' />}
                                <TextArea
                                    className='w-full pl-6 pr-0 body2'
                                    data-test-id='ticket-send-email'
                                    placeHolder={t('ticket_detail.add_note')}
                                    rows={2}
                                    maxRows={5}
                                    value={smsText}
                                    disabled={!!smsDisabledText || ticket?.isPassive}
                                    onChange={(message) => setSmsText(message)}
                                    resizable={false}
                                    isLoading={isSending || isProcessing}
                                    hasBorder={false}
                                    iconClassNames='icon-medium'
                                    showFormatting={false}
                                    icon={Icon.Send}
                                    iconFill='notes-send'
                                    iconOnClick={() => onSend()}
                                    focusState={true}
                                />
                            </div>
                        </div>
                    </div>
                </>
        }
    </div>);
}

export default SmsChat;
