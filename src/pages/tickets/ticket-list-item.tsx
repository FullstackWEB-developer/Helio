import React from 'react';
import { useHistory } from 'react-router-dom';
import { Ticket } from './models/ticket';
import { ReactComponent as PhoneIcon } from '../../shared/icons/Icon-Channel-Phone-48px.svg';
import { ReactComponent as ChatIcon } from '../../shared/icons/Icon-Channel-Chat-48px.svg';
import { ReactComponent as WebIcon } from '../../shared/icons/Icon-Channel-Web-48px.svg';
import { useTranslation } from 'react-i18next';
import utils from '../../shared/utils/utils';
import TicketStatus from './components/ticket-status';
import TicketAssignee from './components/ticket-asignee';

interface TicketListItemProps {
    item: Ticket
}

const TicketListItem = ({ item }: TicketListItemProps) => {
    const { t } = useTranslation();
    const history = useHistory();

    const priorities = [t('tickets.priority.low'), t('tickets.priority.medium'), t('tickets.priority.high'), t('tickets.priority.critical')];
    const types = [t('tickets.types.default'), t('tickets.types.callback'), t('tickets.types.business_office'), t('tickets.types.established_patient'),
    t('tickets.types.facility'), t('tickets.types.new_patient'), t('tickets.types.lab'), t('tickets.types.pharmacy')];

    const renderChannel = (channel: number | undefined) => {
        switch (channel) {
            case 1:
                return <ChatIcon />;
            case 2:
                return <PhoneIcon />;
            case 3:
                return <WebIcon />;
            default:
                return <ChatIcon />;
        }
    };
    const ticketId = item.id as string;
    let itemType = 0;
    if (item.type) {
        itemType = parseInt(item.type);
    }
    return <div className='grid grid-cols-12 border-b p-2 relative cursor-pointer' onClick={() => history.push('my_tickets/' + ticketId)}>
        <div className='col-span-5 flex flex-row'>
            <div className='pl-3 pr-3 pt-1'>
                {renderChannel(item.channel)}
            </div>
            <div className={'py-2'}>
                <div>{item.ticketNumber} <span className='pl-4'>{item.subject}</span></div>
                <div className='text-gray-400 text-sm pt-2'>
                    <span className={'pr-1'}>{t('tickets.created')}</span> {item.createdOn ? utils.formatDate12HoursTime(item.createdOn) : null}
                </div>
            </div>
        </div>
        <TicketStatus ticketId={ticketId} status={item.status} />
        <div className='col-span-1 pt-6'>
            {item.priority ? priorities[item.priority - 1] : null}
        </div>
        <div className='col-span-1 pt-3'>
            <div className='text-gray-400 text-sm'>{t('tickets.type')}</div>
            <div className='pt-1'>{itemType !== 0 ? types[itemType] : null}</div>
        </div>
        <div className='col-span-1 pt-3'>
            <div className='text-gray-400 text-sm'>{t('tickets.reason')}</div>
            <div className='pt-1'>{item.reason}</div>
        </div>
        <TicketAssignee ticketId={ticketId} assignee={item.assignee} />
    </div>
};

export default TicketListItem;
