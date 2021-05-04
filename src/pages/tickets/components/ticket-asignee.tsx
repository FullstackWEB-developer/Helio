import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {setAssignee} from '../services/tickets.service';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {User} from '@shared/models/user';
import Avatar from '../../../shared/components/avatar/avatar';
import utils from '../../../shared/utils/utils';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {DropdownAlignmentHorizontalPosition, DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import Dropdown from '@components/dropdown/dropdown';
import useComponentVisibility from '@shared/hooks/useComponentVisibility';

interface TicketAssigneeProps {
    ticketId: string,
    assignee?: string,
    dropdownHorizontalPostion?: DropdownAlignmentHorizontalPosition
}
const TicketAssignee = ({ticketId, assignee, dropdownHorizontalPostion}: TicketAssigneeProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const users = useSelector(selectUserList) as User[];
    const [searchAssigneeToggle, setSearchAssigneeToggle] = useState(false);
    const [userDropdownItems, setUserDropdownItems] = useState<DropdownItemModel[]>([]);
    const assigneeDisplayRef = useRef<HTMLDivElement>(null);
    const [selectedUser, setSelectedUser] = useState({} as User);
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false)
    const chevronPosition = useRef<HTMLDivElement>(null);

    const userDropdownModel: DropdownModel = {
        isSearchable: true,
        defaultValue: selectedUser.id,
        items: userDropdownItems,
        onClick: (id) => {
            const result = users.find(user => user.id === id);
            if (!result) {
                return;
            }
            updateAssignee(ticketId, result);
            setIsVisible(false);
        }
    };
    useEffect(() => {
        const results = users.map(user => ({label: `${user.firstName} ${user.lastName}`, value: user.id} as DropdownItemModel));
        setUserDropdownItems(results);
    }, [users]);
    useEffect(() => {
        const user = users.find(user => user.id === assignee);
        if (user) {
            setSelectedUser(user);
        }
    }, [users, assignee]);


    const updateAssignee = (id: string, assig: User) => {
        dispatch(setAssignee(id, assig.id));
        setSearchAssigneeToggle(false);
    };

    const openSearchAssignee = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
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

    return <div ref={elementRef} className='col-span-2 cursor-pointer relative'>
        <div ref={assigneeDisplayRef} onClick={openSearchAssignee}>
            {selectedUser?.id ?
                <div className='grid grid-cols-5 items-center'>
                    <div className='col-span-1'>
                        <Avatar
                            model={{
                                initials: utils.getInitialsFromFullName(`${selectedUser.firstName} ${selectedUser.lastName}` || '')
                            }}
                        />
                    </div>
                    <div className='col-span-3 pl-2' ref={chevronPosition}>
                        <div>{selectedUser.firstName} {selectedUser.lastName}</div>
                    </div>
                </div>
                :
                <div className='flex flex-row'>
                    <div className='pt-3'>{t('tickets.unassigned')}</div>
                    <div className='pt-3 pl-3' ref={chevronPosition} >
                        <SvgIcon type={!isVisible? Icon.ArrowDown: Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon' />
                    </div>
                </div>
            }
        </div>
        {isVisible &&
            <div onClick={e => e.stopPropagation()}
            className='absolute w-48 z-10 top-12'
                style={determineDropdownPosition()}>
                <Dropdown model={userDropdownModel} />
            </div>
        }

    </div>
}

export default withErrorLogging(TicketAssignee);
