import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Ticket } from '../models/ticket';
import TicketStatus from './ticket-status';
import TicketAssignee from './ticket-asignee';
import relativeTime from 'dayjs/plugin/relativeTime';
import TicketChannelIcon from './ticket-channel-icon';
import { selectEnumValues, selectLookupValues } from '../store/tickets.selectors';
import { TicketEnumValue } from '../models/ticket-enum-value.model';
import { TicketOptionsBase } from '../models/ticket-options-base.model';
import { TicketLookupValue } from '../models/ticket-lookup-values.model';
import { TicketsPath } from '@app/paths';
import DueInRelativeTime from './ticket-due-in-relative-time';
import utils from '@shared/utils/utils';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import TicketDetailRating from './ticket-detail/ticket-detail-rating';
import TicketListItemActions from './ticket-list-item-actions';
import Checkbox, { CheckboxCheckEvent } from '@components/checkbox/checkbox';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
import './ticket-list-item.scss';
import { TicketStatuses } from '../models/ticket.status.enum';
interface TicketListItemProps {
    item: Ticket,
    isRowSelected: (ticketId: string) => boolean,
    handleCheckboxChange: (e: CheckboxCheckEvent) => void
}

const TicketListItem = ({ item, isRowSelected, handleCheckboxChange }: TicketListItemProps) => {
    dayjs.extend(relativeTime);
    const { t } = useTranslation();
    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const ticketReasons = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const [forceMoreMenuClose, setForceMoreMenuClose] = useState(false);
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

    const getTicketPath = () => {
        return `${TicketsPath}/${item.ticketNumber}`;
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

    const handleCheckBoxChange = (e: CheckboxCheckEvent) => {
        handleCheckboxChange(e);
    }

    return <div className='flex flex-row w-full auto-cols-max body2 border-b hover:bg-gray-100 px-7 items-center h-20 py-3.5 group' onMouseLeave={() => setForceMoreMenuClose(!forceMoreMenuClose)} >
        <div>
            <Checkbox
                checked={isRowSelected(ticketId)}
                label=''
                value={ticketId}
                className='pt-2'
                name={`${ticketId}-check`}
                onChange={handleCheckBoxChange}
            />
        </div>
        <div className='w-24 flex justify-center'>
            <Link to={getTicketPath()}>
                <TicketChannelIcon channel={item.channel} />
            </Link>
        </div>

        <div className='w-2/12 flex justify-center'>
            <div className='ml-2'>
                <Link to={getTicketPath()}>
                    {item.ticketNumber}
                </Link>
            </div>
        </div>
        <div className={classnames('w-2/12 max-w-xs truncate', { 'subtitle2': !!item.subject, 'body2': !item.subject })}>
            <div className='ml-2'>
                <Link to={getTicketPath()}>
                    <ElipsisTooltipTextbox hasInlineBlock={false} asSpan={true} value={item.subject ? item.subject : t('tickets.no_subject')} />
                </Link>
            </div>
        </div>
        <div className='w-1/12 body3'>
            <div className='ml-2'>
                <Link to={getTicketPath()}>
                    <DueInRelativeTime value={item.dueDate ? item.dueDate : undefined} isOverdue={item.isOverdue} />
                </Link>
            </div>
        </div>
        <div className='w-2/12 created-date truncate'>
            <div className='mr-2'>
                <Link to={getTicketPath()}>
                    <ElipsisTooltipTextbox hasInlineBlock={false} classNames='body3-small' asSpan={true} value={dayjs.utc(item.createdOn).local().format('MMM DD, YYYY h:mm A')} />
                </Link>
            </div>
        </div>
        <div className='w-2/12 h-full'>
            <TicketStatus ticket={item} />
        </div>
        <div className='w-2/12 flex items-center justify-start'>
            <div className='ml-2'>
                <Link to={getTicketPath()}>
                    {item.priority ? selectedPriority?.value : null}
                </Link>
            </div>
        </div>
        <div className='w-2/12 max-w-xs truncate'>
            <Link to={getTicketPath()}>
                <ElipsisTooltipTextbox hasInlineBlock={false} asSpan={true} value={item.type && selectedTicketType ? selectedTicketType.value : ''} />
            </Link>
        </div>
        <div className='w-2/12 flex items-center justify-start'>
            <div className='ml-2'>
                <Link to={getTicketPath()}>
                    <ElipsisTooltipTextbox hasInlineBlock={false} asSpan={true} value={item.reason && selectedReason ? selectedReason?.label : ''} />
                </Link>
            </div>
        </div>
        <div className='w-3/12'>
            <TicketAssignee ticketId={ticketId} assignee={item.assignee} />
        </div>
        <div className='w-1/12'>
            <div className='flex flex-col items-center justify-center'>
                <TicketDetailRating patientRating={item.patientRating} ticketId={item.id!} />
            </div>
        </div>
        <div className='w-1/12'>
            <div className='flex justify-center'>
                <TicketListItemActions ticketInfo={item} forceMoreMenuClose={forceMoreMenuClose} />
            </div>
        </div>
    </div>
};

export default TicketListItem;
