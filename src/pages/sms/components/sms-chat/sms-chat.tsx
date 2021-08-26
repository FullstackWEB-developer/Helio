import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Avatar from '@components/avatar';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import MoreMenu from '@components/more-menu';
import SmsChatMessageList from '../sms-chat-message/sms-chat-message-list';
import {TicketMessage, TicketMessageSummary} from '@shared/models';
import {useDispatch, useSelector} from 'react-redux';
import {selectEnumValues, selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {useHistory} from 'react-router';
import classnames from 'classnames';
import {PatientsPath, TicketsPath} from 'src/app/paths';
import {DropdownItemModel} from '@components/dropdown';
import utils from '@shared/utils/utils';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import './sms-chat.scss';
import {MORE_MENU_OPTION_PATIENT, MORE_MENU_OPTION_TICKET} from '@pages/sms/constants';
import {getEnumByType, getLookupValues, getTicketById} from '@pages/tickets/services/tickets.service';
import {Icon} from '@components/svg-icon';
import TextArea from '@components/textarea/textarea';
import SelectedTemplateInfo from '@components/notification-template-select/components/selected-template-info';
import ParentExtraTemplate from '@components/notification-template-select/components/parent-extra-template';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {useQuery} from 'react-query';
import {ProcessTemplate, QueryGetPatientById, QueryTickets} from '@constants/react-query-constants';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {processTemplate} from '@shared/services/notifications.service';
import {Link} from 'react-router-dom';

interface SmsChatProps {
    info: TicketMessageSummary;
    messages?: TicketMessage[];
    isLoading?: boolean;
    isSending?: boolean;
    isBottomFocus?: boolean;
    onSendClick: (toAddress: string, text: string) => void;
    onFetchMore?: () => void;
}

const SmsChat = ({info, isLoading, isSending, isBottomFocus, messages = [], ...props}: SmsChatProps) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const messageListContainerRef = useRef<HTMLDivElement>(null);
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const history = useHistory();
    const [smsText, setSmsText] = useState<string>();
    const topMessagePosition = useRef<number>();
    const [selectedMessageTemplate, setSelectedMessageTemplate] = useState<NotificationTemplate>();
    const moreMenuOptions: DropdownItemModel[] = [
        {label: t('sms.chat.view_patient'), value: MORE_MENU_OPTION_PATIENT, className: 'body2 py-1.5'},
        {label: t('sms.chat.view_ticket'), value: MORE_MENU_OPTION_TICKET, className: 'body2 py-1.5'}
    ];

    const {data: patient} = useQuery([QueryGetPatientById, info.patientId], () => getPatientByIdWithQuery(info.patientId!), {
        enabled: !!info.patientId
    });

    const {data: ticket} = useQuery([QueryTickets, info.ticketId], () => getTicketById(info.ticketId!), {
        enabled: !!info.ticketId
    });

    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);

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

    const getTicketReasons = () => {
        return ticketReasons.find((lookupValue) => lookupValue.value === info?.reason)?.label ?? '-'
    }

    const getTicketType = () => {
        return ticketTypes.find((lookupValue) => lookupValue.key === info?.ticketType)?.value ?? '-'
    }

    const goToPatientChart = () => {
        history.push(`${PatientsPath}/${info.patientId}`);
    }

    const goToTicketDetail = () => {
        history.push(`${TicketsPath}/${info.ticketNumber}`);
    }

    const onScroll = ({currentTarget}: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (props.onFetchMore && currentTarget.scrollTop <= 0) {
            props.onFetchMore();
        }
    }

    const onMoreMenuClick = (item: DropdownItemModel) => {
        switch (item.value) {
            case MORE_MENU_OPTION_PATIENT:
                goToPatientChart();
                break;
            case MORE_MENU_OPTION_TICKET:
                goToTicketDetail();
                break;
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

    const onSend = ( ) =>  {
        if (smsText && patient?.mobilePhone) {
            props.onSendClick(patient.mobilePhone, smsText);
            setSmsText('');
        }
    }

    return (<div className="flex flex-col justify-between flex-auto h-full sms-chat">
        <div className="flex flex-row border-b sms-chat-header">
            <div className="pt-4 pl-6"><Avatar userFullName={info.createdForName ?? ''}/></div>
            <div className="flex flex-col flex-auto pl-4 pr-6 pt-7">
                <div className="flex flex-row justify-between">
                    <div><h6>{info.createdForName}</h6></div>
                    <div>
                        <MoreMenu
                            iconClassName='default-toolbar-icon'
                            iconFillClassname='cursor-pointer icon-medium'
                            menuClassName='w-52'
                            items={moreMenuOptions}
                            onClick={onMoreMenuClick}
                        />
                    </div>
                </div>
                <div className="flex flex-row pt-2.5">
                    <div className="mr-6">
                        <span className="body2-medium mr-1.5">{t('sms.chat.header.patient_id')}</span>
                        <Link className='body2-primary' to={`${PatientsPath}/${info.patientId}`}>{info.patientId}</Link>
                    </div>
                    <div className="mr-6">
                        <span className="body2-medium mr-1.5">{t('sms.chat.header.ticket_id')}</span>
                        <Link className='body2-primary' to={`${TicketsPath}/${info.ticketNumber}`}>{info.ticketNumber}</Link>
                    </div>
                    <div className="mr-6">
                        <span className="body2-medium mr-1.5">{t('sms.chat.header.ticket_type')}</span>
                        <span className="body2">{getTicketType()}</span>
                    </div>
                    <div>
                        <span className="body2-medium mr-1.5">{t('sms.chat.header.reason')}</span>
                        <span className="body2">{getTicketReasons()}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col flex-1 px-6 overflow-y-auto">
            {messages && messages.length > 0 &&
            <>
                <div className={classnames('flex flex-row justify-center', {'hidden': !isLoading})}>
                    <Spinner/>
                </div>
                <div ref={messageListContainerRef} className='flex flex-col h-full overflow-y-auto' onScroll={onScroll}>
                    <SmsChatMessageList messages={messages}/>
                    <AlwaysScrollToBottom enabled={!isBottomFocus}/>
                </div>
            </>
            }
            {(!messages || messages.length < 1) &&
            <EmptyMessage/>
            }
        </div>
        <div className="flex flex-col justify-center pl-6 pt-4 pr-16 pb-4 sms-chat-footer">
            <div className='flex flex-row items-end'>
                <div className='mr-3 pb-6'>
                    <NotificationTemplateSelect
                        channel={NotificationTemplateChannel.Sms}
                        onSelect={(template) => onTemplateSelect(template)}
                    />
                </div>
                <div className='w-full flex flex-col py-5'>
                    <SelectedTemplateInfo selectedMessageTemplate={selectedMessageTemplate}/>
                    {selectedMessageTemplate && <div>
                        <ParentExtraTemplate logicKey={selectedMessageTemplate?.logicKey} patient={patient} parentType='sms'/>
                    </div>}
                    {selectedMessageTemplate && <div className='pb-5'/>}
                    <TextArea
                        className='pl-6 pr-0 body2 w-full'
                        data-test-id='ticket-send-email'
                        placeHolder={t('ticket_detail.add_note')}
                        rows={2}
                        maxRows={5}
                        value={smsText}
                        onChange={(message) => setSmsText(message)}
                        resizable={false}
                        isLoading={isSending || isProcessing}
                        hasBorder={false}
                        iconClassNames='icon-medium'
                        showFormatting={false}
                        icon={Icon.Send}
                        iconFill='notes-send'
                        iconOnClick={() => onSend()}
                    />
                </div>
            </div>

        </div>
    </div>);
}

export default SmsChat;
