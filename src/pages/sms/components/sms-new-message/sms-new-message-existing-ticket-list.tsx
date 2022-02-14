import {TicketBase} from '@pages/tickets/models/ticket-base';
import {selectEnumValues, selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import classnames from 'classnames';
import {getEnumByType, getLookupValues} from '@pages/tickets/services/tickets.service';
import {ticketListRelativeTimeFormat} from '@pages/sms/utils';
import {useTranslation} from 'react-i18next';
import './sms-new-message-existing-ticket-list.scss';
import SvgIcon, {Icon} from '@components/svg-icon';
import {TicketsPath} from '@app/paths';
import {Link} from 'react-router-dom';
import {TicketType} from '@shared/models';

interface SmsNewMessageExistingTicketListProps {
    items: TicketBase[];
    onChange?: (ticket: TicketBase) => void;

}

const SmsNewMessageExistingTicketList = ({items, ...props}: SmsNewMessageExistingTicketListProps) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const [ticketSelected, setTicketSelected] = useState<string>();
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);

    const getTicketReasons = (value?: string) => {
        if (!value) {
            return '';
        }

        return ticketReasons.find((lookupValue) => lookupValue.value === value)?.label ?? ''
    }
    const getTicketType = (type?: TicketType) => {
        if (!type) {
            return '';
        }

        return ticketTypes.find((lookupValue) => lookupValue.key === type)?.value ?? ''
    }
    const onRowClick = (ticket: TicketBase) => {
        setTicketSelected(ticket.id);
        if (props.onChange) {
            props.onChange(ticket);
        }
    }

    const TicketLinkWrapper = ({children, ticket}) => {
        return <div className='w-fit'><Link to={`${TicketsPath}/${ticket.ticketNumber}`} target="_blank" rel="noopener noreferrer">
            {children}
        </Link></div>
    }

    const getRow = (ticket: TicketBase) => {
        return (
            <div key={ticket.id} className={classnames('flex flex-row px-4 py-3 mb-2 row',
                {'selected': !!ticketSelected && ticketSelected === ticket.id})}
                onClick={() => onRowClick(ticket)}>
                <div className='flex flex-col w-2/12'>
                    <span className='body3-medium'>{t('sms.chat.new.existing_ticket.list.ticket_no')}</span>
                    <TicketLinkWrapper ticket={ticket}><span className='subtitle2'>{ticket.ticketNumber}</span></TicketLinkWrapper>
                </div>
                <div className='flex flex-col w-4/12'>
                    <TicketLinkWrapper ticket={ticket}>
                        <span className='subtitle2'>{ticket.subject ?? '-'}</span>
                    </TicketLinkWrapper>
                    <span className='body3-small'>
                        <span className="mr-0.5">{t('sms.chat.new.existing_ticket.list.created_label')}</span>
                        <span>
                            {ticketListRelativeTimeFormat(t('sms.chat.new.existing_ticket.list.relative_time_suffix'), ticket.createdOn)}
                        </span>
                    </span>
                </div>
                <div className='flex flex-col w-2/12'>
                    <span className='body3-medium'>{t('sms.chat.new.existing_ticket.list.ticket_type')}</span>
                    <span className='body2'>{getTicketType(ticket.type)}</span>
                </div>
                <div className='flex flex-col w-2/12'>
                    <span className='body3-medium'>{t('sms.chat.new.existing_ticket.list.reason')}</span>
                    <span className='body2'>{getTicketReasons(ticket.reason)}</span>
                </div>
                <div className='flex items-center justify-end w-2/12 mr-8'>
                    <TicketLinkWrapper ticket={ticket}>
                        <SvgIcon
                            type={Icon.View}
                            fillClass='rgba-062-fill'
                        />
                    </TicketLinkWrapper>
                </div>
            </div>
        );
    }

    return (
        <div className='ml-6 sms-new-message-existing-ticket-list mb-14'>
            {items.map(getRow)}
        </div>
    );

}

export default SmsNewMessageExistingTicketList;
