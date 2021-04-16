import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setStatus } from '../services/tickets.service';
import customHooks from '../../../shared/hooks/customHooks';
import TicketStatusDisplay from './ticket-status-display';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';

interface TicketStatusProps {
    ticketId: string,
    status?: number,
    isArrow?: boolean
}
const TicketStatus = ({ ticketId, status, isArrow = true }: TicketStatusProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [searchStatusToggle, setSearchStatusToggle] = useState(false);

    const statusSearchRef = useRef<HTMLDivElement>(null);

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

    const statuses = [t('tickets.statuses.open'), t('tickets.statuses.on_hold'), t('tickets.statuses.in_progress'), t('tickets.statuses.solved'), t('tickets.statuses.closed')];

    return <div className='col-span-2 pt-6 flex flex-row relative'>
        <TicketStatusDisplay status={status} iconClass='pt-1.5' labelClass='pl-3'></TicketStatusDisplay>
        {
            isArrow && <div className='pl-3 cursor-pointer' onClick={() => openStatus()}>
                <SvgIcon type={Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon'/>
            </div>
        }
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
