import { ReactComponent as ArrowDownIcon } from '../../../shared/icons/Icon-Arrow-down-16px.svg';
import { ReactComponent as AvatarIcon } from '../../../shared/icons/Avatar-40px-Image.svg';
import { ReactComponent as SearchIcon } from '../../../shared/icons/Icon-Search-16px.svg';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import customHooks from '../../../shared/hooks/customHooks';
import { setAssignee } from '../services/tickets.service';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {selectUserList} from '../../../shared/store/lookups/lookups.selectors';
import {User} from '../../../shared/models/user';

interface TicketAssigneeProps {
    ticketId: string,
    assignee?: string
}
const TicketAssignee = ({ ticketId, assignee }: TicketAssigneeProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const users = useSelector(selectUserList) as User[];
    const [searchAssigneeToggle, setSearchAssigneeToggle] = useState(false);
    const [searchAssigneeTerm, setSearchAssigneeTerm] = useState('');
    const [filteredAssignees, setFilteredAssignees] = useState(users);
    const assigneeDisplayRef = useRef<HTMLDivElement>(null);
    const assigneeSearchRef = useRef<HTMLDivElement>(null);
    const [selectedUser, setSelectedUser] = useState({} as User);

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

    return <div className={'col-span-2 cursor-pointer pt-3'}>
        <div ref={assigneeDisplayRef}
            onClick={() => openSearchAssignee()}>
            {selectedUser?.id ?
                <div className='grid grid-cols-5'>
                    <div className='col-span-1'>
                        <AvatarIcon />
                    </div>
                    <div className='col-span-3 pl-2'>
                        <div className='text-gray-400 text-sm'>{t('tickets.assigned_to')}</div>
                        <div>{selectedUser.firstName} {selectedUser.lastName}</div>
                    </div>
                </div>
                :
                <div className='flex flex-row'>
                    <div className='pt-3'>{t('tickets.unassigned')}</div>
                    <div className='pt-4 pl-4 '>
                        <ArrowDownIcon /></div>
                </div>
            }
        </div>
        <div ref={assigneeSearchRef}
            className={`absolute inset-3/4 top-17 w-80 z-10 ${searchAssigneeToggle ? '' : ' hidden'}`}>
            <div className='shadow-md w-96 bg-white pt-2'>
                <div className='flex flex-row border-b border-t p-2 pl-3'>
                    <span className={'pt-1'}>
                        <SearchIcon />
                    </span>
                    <input className='pl-4 focus:outline-none' type='text' value={searchAssigneeTerm}
                        onChange={(e) => search(e)}
                        placeholder={t('tickets.search_assignees')}/>
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
