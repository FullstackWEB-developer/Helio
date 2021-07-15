import {TicketBase} from '@pages/tickets/models/ticket-base';
import {selectEnumValues, selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import classnames from 'classnames';
import {getEnumByType, getLookupValues} from '@pages/tickets/services/tickets.service';
import {ticketListRelativeTimeFormat} from '@pages/sms/utils';
import {useTranslation} from 'react-i18next';
import './sms-new-message-existing-ticket-list.scss';

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
    const getTicketType = (value?: string) => {
        if (!value) {
            return '';
        }

        return ticketTypes.find((lookupValue) => lookupValue.key === Number(value))?.value ?? ''
    }
    const onRowClick = (ticket: TicketBase) => {
        setTicketSelected(ticket.id);
        if (props.onChange) {
            props.onChange(ticket);
        }
    }

    const getRow = (ticket: TicketBase) => {
        return (
            <div key={ticket.id} className={classnames('flex flex-row px-4 py-3 mb-2 cursor-pointer row',
                {'selected': !!ticketSelected && ticketSelected === ticket.id})}
                onClick={() => onRowClick(ticket)}>
                <div className='flex flex-col w-3/6'>
                    <span className='subtitle2'>{ticket.subject ?? '-'}</span>
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
