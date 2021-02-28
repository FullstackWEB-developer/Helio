import { ReactComponent as ArrowDownIcon } from '../../../shared/icons/Icon-Arrow-down-16px.svg';
import React, { useRef, useState } from 'react';
import CircleIcon from '../../../shared/icons/circle-icon';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setStatus } from '../services/tickets.service';
import customHooks from '../../../shared/hooks/customHooks';

interface TicketStatusProps {
    ticketId: string,
    status?: number
}
const TicketStatus = ({ ticketId, status }: TicketStatusProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [searchStatusToggle, setSearchStatusToggle] = useState(false);

    const statusSearchRef = useRef<HTMLDivElement>(null);

    const renderStatus = (status: number | undefined) => {
        switch (status) {
            case 1:
                return <CircleIcon color={'text-yellow-300'} />;
            case 2:
                return <CircleIcon color={'text-red-400'} />;
            case 3:
                return <CircleIcon color={'text-gray-300'} />;
            case 4:
                return <CircleIcon color={'text-green-300'} />;
            case 5:
                return <CircleIcon color={'text-green-300'} />;
            case 6:
                return <CircleIcon color={'text-gray-300'} />;
            default:
                return null;
        }
    }
    const updateStatus = (id: string, status: number) => {
        dispatch(setStatus(id, status));
        setSearchStatusToggle(false);
    };
    const openStatus = () => {
        setTimeout(() => setSearchStatusToggle(!searchStatusToggle), 100)
    }
    customHooks.useOutsideClick([statusSearchRef], () => {
        setSearchStatusToggle(false);
    });

    const statuses = [t('tickets.statuses.new'), t('tickets.statuses.overdue'), t('tickets.statuses.unassigned'), t('tickets.statuses.in_progress'), t('tickets.statuses.solved'), t('tickets.statuses.closed')];

    return <div className='col-span-2 pt-6 flex flex-row relative'>
        <div className='pt-1.5'>{renderStatus(status)}</div>
        <div className='pl-3'>{status ? statuses[status - 1] : null}</div>
        <div className='pt-0.5 pl-4 cursor-pointer' onClick={() => openStatus()}>
            <ArrowDownIcon />
        </div>
        <div ref={statusSearchRef}
            className={`absolute top-16 w-60 z-10 ${searchStatusToggle ? '' : ' hidden'}`}>
            <div className='shadow-md w-60 bg-white'>
                {statuses.map((status, index) => {
                    return <div key={index} className={'cursor-pointer p-3 hover:bg-blue-500 hover:text-white'}
                        onClick={() => updateStatus(ticketId, index + 1)}>
                        {status}
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default TicketStatus;