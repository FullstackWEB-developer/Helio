import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import customHooks from '../../../shared/hooks/customHooks';
import { setAssignee } from '../services/tickets.service';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import { selectUserList } from '@shared/store/lookups/lookups.selectors';
import { User } from '@shared/models/user';
import Avatar from '../../../shared/components/avatar/avatar';
import utils from '../../../shared/utils/utils';
import { Icon } from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import { DropdownAlignmentHorizontalPosition } from '@components/dropdown/dropdown.models';

interface TicketAssigneeProps {
    ticketId: string,
    assignee?: string,
    dropdownHorizontalPostion?: DropdownAlignmentHorizontalPosition
}
const TicketAssignee = ({ ticketId, assignee, dropdownHorizontalPostion }: TicketAssigneeProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const users = useSelector(selectUserList) as User[];
    const [searchAssigneeToggle, setSearchAssigneeToggle] = useState(false);
    const [searchAssigneeTerm, setSearchAssigneeTerm] = useState('');
    const [filteredAssignees, setFilteredAssignees] = useState(users);
    const assigneeDisplayRef = useRef<HTMLDivElement>(null);
    const assigneeSearchRef = useRef<HTMLDivElement>(null);
    const [selectedUser, setSelectedUser] = useState({} as User);
    const chevronPosition = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilteredAssignees(users.filter(item => item.id.includes(searchAssigneeTerm)).slice(0, 9));
    }, [searchAssigneeTerm, users]);

    useEffect(() => {
        const user = users.find(user => user.id === assignee);
        if (user) {
            setSelectedUser(user);
        }
    }, [users, assignee]);

    customHooks.useOutsideClick([assigneeDisplayRef, assigneeSearchRef], () => {
        setSearchAssigneeToggle(false);
    });

    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchAssigneeTerm(e.target.value);
    };

    const updateAssignee = (id: string, assig: User) => {
        dispatch(setAssignee(id, assig.id));
        setSearchAssigneeToggle(false);
    };

    const openSearchAssignee = () => {
        setTimeout(() => setSearchAssigneeToggle(!searchAssigneeToggle), 100);
    }

    const determineDropdownPosition = () => {
        switch (dropdownHorizontalPostion) {
            case DropdownAlignmentHorizontalPosition.Right: {
                let right = 0;
                const rightmostPoint = assigneeDisplayRef.current?.getBoundingClientRect()?.right;
                const chevronRightPoint = chevronPosition.current?.getBoundingClientRect()?.right;
                if (rightmostPoint && chevronRightPoint) {
                    right = rightmostPoint - chevronRightPoint;
                }
                return {
                    right: `${right}px`
                }
            }
            case DropdownAlignmentHorizontalPosition.Left:
            default: {
                return {}
            }
        }
    }

    return <div className={'col-span-2 cursor-pointer pt-3 relative'}>
        <div ref={assigneeDisplayRef}
            onClick={() => openSearchAssignee()}>
            {selectedUser?.id ?
                <div className='grid grid-cols-5'>
                    <div className='col-span-1'>
                        <Avatar
                            model={{
                                initials: utils.getInitialsFromFullName(`${selectedUser.firstName} ${selectedUser.lastName}` || '')
                            }}
                        />
                    </div>
                    <div className='col-span-3 pl-2'>
                        <div className='text-gray-400 text-sm'>{t('tickets.assigned_to')}</div>
                        <div>{selectedUser.firstName} {selectedUser.lastName}</div>
                    </div>
                </div>
                :
                <div className='flex flex-row'>
                    <div className='pt-3'>{t('tickets.unassigned')}</div>
                    <div className='pt-3 pl-3' ref={chevronPosition} >
                        <SvgIcon type={Icon.ArrowDown} className='cursor-pointer' fillClass='active-item-icon' />
                    </div>
                </div>
            }
        </div>
        <div ref={assigneeSearchRef}
            className={`absolute w-96 z-10 ${searchAssigneeToggle ? '' : ' hidden'}`}
            style={determineDropdownPosition()}>
            <div className='shadow-md bg-white pt-2'>
                <div className='flex flex-row border-b border-t p-2 pl-3'>
                    <span className={'pt-1'}>
                        <SvgIcon type={Icon.Search} className='icon-small cursor-pointer' fillClass='search-icon' />
                    </span>
                    <input className='pl-4 focus:outline-none' type='text' value={searchAssigneeTerm}
                        onChange={(e) => search(e)}
                        placeholder={t('tickets.search_assignees')} />
                </div>
                {filteredAssignees.map((item, index) => {
                    return <div key={index} className={'cursor-pointer p-3 hover:bg-blue-500 hover:text-white'}
                        onClick={() => updateAssignee(ticketId, item)}>
                        {item.firstName} {item.lastName}
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default withErrorLogging(TicketAssignee);
