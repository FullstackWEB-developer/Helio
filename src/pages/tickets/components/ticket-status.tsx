import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {setStatus} from '../services/tickets.service';
import {statusTranslationKeyMap} from '../utils/statusUtils';
import TicketStatusDisplay from './ticket-status-display';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import Dropdown from '@components/dropdown/dropdown';
import {DropdownModel} from '@components/dropdown/dropdown.models';
import useComponentVisibility from '@shared/hooks/useComponentVisibility';
import {TicketStatusType} from "../models/ticket-status";

interface TicketStatusProps {
    ticketId: string,
    status: number,
    isArrow?: boolean
}
const TicketStatus = ({ticketId, status, isArrow = true}: TicketStatusProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false);

    const updateStatus = (id: string, status: number) => {
        dispatch(setStatus(id, status));
        setIsVisible(false);
    };
    const openStatus = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
    }
    
    const statusesDropdownModel: DropdownModel = {
        defaultValue: status?.toString(),
        items: [
            {label: t(statusTranslationKeyMap[TicketStatusType.Open]), value: TicketStatusType.Open.toString()},
            {label: t(statusTranslationKeyMap[TicketStatusType.OnHold]), value: TicketStatusType.OnHold.toString()},
            {label: t(statusTranslationKeyMap[TicketStatusType.InProgress]), value: TicketStatusType.InProgress.toString()},
            {label: t(statusTranslationKeyMap[TicketStatusType.Solved]), value: TicketStatusType.Solved.toString()},
            {label: t(statusTranslationKeyMap[TicketStatusType.Closed]), value: TicketStatusType.Closed.toString()}
        ],
        onClick: (value: string) => {
            updateStatus(ticketId, Number(value))
        }
    };

    return <div ref={elementRef} className='col-span-2 flex flex-row items-center h-full relative' onClick={(event) => isArrow && openStatus(event)}>
        <TicketStatusDisplay status={status} iconClass='pt-1.5' labelClass='pl-3'></TicketStatusDisplay>
        {isArrow &&
            <div className='pl-3 cursor-pointer' onClick={openStatus}>
                <SvgIcon type={!isVisible ? Icon.ArrowDown : Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon' />
            </div>
        }
        {isVisible &&
            <div className='absolute top-16 w-48 z-10'>
                <Dropdown model={statusesDropdownModel} />
            </div>
        }
    </div>
}

export default TicketStatus;
