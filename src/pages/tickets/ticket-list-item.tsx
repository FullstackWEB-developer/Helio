import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Ticket} from './models/ticket';
import utils from '../../shared/utils/utils';
import TicketStatus from './components/ticket-status';
import TicketAssignee from './components/ticket-asignee';
import relativeTime from 'dayjs/plugin/relativeTime';
import TicketChannelIcon from './components/ticket-channel-icon';
import {selectEnumValues, selectLookupValues} from './store/tickets.selectors';
import {TicketEnumValue} from './models/ticket-enum-value.model';
import {TicketOptionsBase} from './models/ticket-options-base.model';
import {TicketLookupValue} from './models/ticket-lookup-values.model';
import {TicketsPath} from '../../app/paths';

interface TicketListItemProps {
    item: Ticket
}

const TicketListItem = ({item}: TicketListItemProps) => {
    dayjs.extend(relativeTime);
    const {t} = useTranslation();
    const history = useHistory();

    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketId = item.id as string;

    const convertEnumToOptions = (items: TicketEnumValue[]) : TicketOptionsBase[] =>{
        if (items && items.length > 0) {
            return items.map(item => {
                return {
                    key: item.key.toString(),
                    value: item.value
                }
            })
        }
        return [];
    }

    const priorityOptions = convertEnumToOptions(ticketPriorities);
    const ticketTypeOptions = convertEnumToOptions(ticketTypes);
    const [selectedPriority, setSelectedPriority] = useState(
        priorityOptions ? priorityOptions.find((o: TicketOptionsBase) => parseInt(o.key) === item?.priority) : null
    );
    const [selectedTicketType, setSelectedTicketType] =
        useState(ticketTypeOptions ? ticketTypeOptions.find((o: TicketOptionsBase) => o.key === item?.type?.toString()) : null);

    const [selectedReason, setSelectedReason] =
        useState(ticketReasons ? ticketReasons.find((a: TicketLookupValue) => a.value === item?.reason) : null);

    useEffect(() => {
        if (priorityOptions?.length > 0 && !selectedPriority) {
            setSelectedPriority(priorityOptions.find((o: TicketOptionsBase) => parseInt(o.key) === item?.priority));
        }

        if (ticketTypeOptions?.length > 0 && !selectedTicketType) {
            setSelectedTicketType(ticketTypeOptions.find((o: TicketOptionsBase) => o.key === item?.type?.toString()));
        }

        if (ticketReasons?.length > 0 && !selectedReason) {
            setSelectedReason(ticketReasons.find((a: TicketLookupValue) => a.value === item?.reason));
        }
    }, [
        priorityOptions, selectedPriority, item?.priority,
        ticketTypeOptions, selectedTicketType, item?.type,
        ticketReasons, selectedReason, item?.reason
    ]);

    return <div className='grid grid-cols-12 border-b p-2 relative cursor-pointer hover:bg-gray-100'>
        <div className='col-span-3 flex flex-auto' onClick={() => history.push(`${TicketsPath}/${item.ticketNumber}`)}>
            <div className='pl-3 pr-3 pt-1'>
                <TicketChannelIcon ticket={item}/>
            </div>
            <div className={'py-2'}>
                <div>{item.ticketNumber} <span className='pl-4'>{item.subject}</span></div>
                <div className='text-gray-400 text-sm pt-2'>
                    <span className={'pr-1'}>{t('tickets.created')}</span>
                    {utils.formatUtcDate(item.createdOn, 'MMM D, YYYY h:mm A')}
                    <span
                        className='ml-4'>{item.dueDate ? `${t('tickets.due')} ${dayjs().to(dayjs.utc(item.dueDate).local())}` : ''}</span>
                </div>
            </div>
        </div>
        <TicketStatus ticketId={ticketId} status={item.status}/>
        <div className='col-span-3 flex flex-row' onClick={() => history.push(`${TicketsPath}/${item.ticketNumber}`)}>
            <div className='pt-6 flex-1'>
                {item.priority ? selectedPriority?.value : null}
            </div>
            <div className='pt-3 flex-1'>
                <div className='text-gray-400 text-sm'>{t('tickets.type')}</div>
                <div className='pt-1'>{item.type ? selectedTicketType?.value : null}</div>
            </div>
            <div className='pt-3 flex-1'>
                <div className='text-gray-400 text-sm'>{t('tickets.reason')}</div>
                <div className='pt-1'>{item.reason ? selectedReason?.label : null}</div>
            </div>
        </div>
        <TicketAssignee ticketId={ticketId} assignee={item.assignee} />
    </div>
};

export default TicketListItem;
