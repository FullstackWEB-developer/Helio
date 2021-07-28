import {useLayoutEffect, useRef, useEffect} from 'react';
import Avatar from '@components/avatar';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import MoreMenu from '@components/more-menu';
import SmsMessageInput from '../sms-message-input/sms-message-input';
import SmsChatMessageList from '../sms-chat-message/sms-chat-message-list';
import {TicketMessage, TicketMessageSummary} from '@shared/models';
import {useDispatch, useSelector} from 'react-redux';
import {selectEnumValues, selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {useHistory} from 'react-router';
import classnames from 'classnames';
import {TicketsPath, PatientsPath} from 'src/app/paths';
import {DropdownItemModel} from '@components/dropdown';
import utils from '@shared/utils/utils';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import './sms-chat.scss';
import {MORE_MENU_OPTION_PATIENT, MORE_MENU_OPTION_TICKET} from '@pages/sms/constants';
import {getEnumByType, getLookupValues} from '@pages/tickets/services/tickets.service';
import {Link} from 'react-router-dom';

interface SmsChatProps {
    info: TicketMessageSummary;
    messages?: TicketMessage[];
    isLoading?: boolean;
    isSending?: boolean;
    isBottomFocus?: boolean;
    onSendClick?: (text: string) => void;
    onFetchMore?: () => void;
}

const SmsChat = ({info, isLoading, isSending, isBottomFocus, messages = [], ...props}: SmsChatProps) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const messageListContainerRef = useRef<HTMLDivElement>(null);
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const history = useHistory();
    const topMessagePosition = useRef<number>();
    const moreMenuOptions: DropdownItemModel[] = [
        {label: t('sms.chat.view_patient'), value: MORE_MENU_OPTION_PATIENT, className: 'body2 py-1.5'},
        {label: t('sms.chat.view_ticket'), value: MORE_MENU_OPTION_TICKET, className: 'body2 py-1.5'}
    ];

    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);

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

    const EmptyMessage = () => {
        return (<div className='flex flex-col mt-7'>
            <h6 className='mb-4'>{t('sms.chat.empty.title')}</h6>
            <p className='body2'>{t('sms.chat.empty.description')}</p>
        </div>);
    }

    return (<div className="flex flex-col justify-between flex-auto h-full sms-chat">
        <div className="flex flex-row border-b sms-chat-header">
            <div className="pt-4 pl-6"><Avatar userFullName={info.createdForName ?? ''} /></div>
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
        <div className="flex flex-col h-full px-6 overflow-y-auto">
            {messages && messages.length > 0 &&
                <>
                    <div className={classnames('flex flex-row justify-center', {'hidden': !isLoading})}>
                        <Spinner />
                    </div>
                    <div ref={messageListContainerRef} className='flex flex-col h-full overflow-y-auto' onScroll={onScroll}>

                        <SmsChatMessageList messages={messages} />
                        <AlwaysScrollToBottom enabled={!isBottomFocus} />
                    </div>
                </>
            }
            {(!messages || messages.length < 1) &&
                <EmptyMessage />
            }
        </div>
        <div className="flex flex-col justify-center px-6 pt-8 pb-6 sms-chat-footer">
            <SmsMessageInput
                isLoading={isSending}
                onSendClick={props.onSendClick}
            />
        </div>
    </div>);
}

export default SmsChat;
