import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Ticket} from '../models/ticket';
import TicketStatus from './ticket-status';
import TicketAssignee from './ticket-asignee';
import relativeTime from 'dayjs/plugin/relativeTime';
import TicketChannelIcon from './ticket-channel-icon';
import {selectEnumValues, selectLookupValues} from '../store/tickets.selectors';
import {TicketEnumValue} from '../models/ticket-enum-value.model';
import {TicketOptionsBase} from '../models/ticket-options-base.model';
import {TicketLookupValue} from '../models/ticket-lookup-values.model';
import {TicketsPath} from '../../../app/paths';
import {DropdownAlignmentHorizontalPosition} from '@components/dropdown/dropdown.models';
import DueInRelativeTime from './ticket-due-in-relative-time';

interface TicketListItemProps {
    item: Ticket
}

const TicketListItem = ({item}: TicketListItemProps) => {
    dayjs.extend(relativeTime);

    const history = useHistory();

    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketId = item.id as string;

    const convertEnumToOptions = (items: TicketEnumValue[]): TicketOptionsBase[] => {
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

    const openTicket = () => {
        history.push(`${TicketsPath}/${item.ticketNumber}`);
    }

    return <div className='grid grid-flow-col auto-cols-max body2 border-b relative cursor-pointer hover:bg-gray-100 px-7 items-center h-20' onClick={openTicket} >
        <div className='w-20'>
            <TicketChannelIcon channel={item.channel}/>
        </div>
        <div className='w-20 pr-5'>
            {item.ticketNumber}
        </div>
        <div className='w-60 pr-5 subtitle2'>
            <span>{item.subject ? item.subject : '-'}</span>
        </div>
        <div className='w-36 body3'>
            <DueInRelativeTime date={item.dueDate}/>
        </div>
        <div className='w-40 h-full'>
            <TicketStatus ticket={item} status={item.status!}/>
        </div>
        <div className='w-28'>
            {item.priority ? selectedPriority?.value : null}
        </div>
        <div className='w-36'>
            {item.type ? selectedTicketType?.value : '-'}
        </div>
        <div className='w-44'>
            {item.reason ? selectedReason?.label : '-'}
        </div>
        <div className='w-60'>
            <TicketAssignee ticketId={ticketId} assignee={item.assignee}
                            dropdownHorizontalPosition={DropdownAlignmentHorizontalPosition.Right}/>
        </div>
    </div>
};

export default TicketListItem;
