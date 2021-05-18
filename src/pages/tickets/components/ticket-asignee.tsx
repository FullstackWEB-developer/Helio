import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {User} from '@shared/models/user';
import Avatar from '../../../shared/components/avatar/avatar';
import utils from '../../../shared/utils/utils';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {
    DropdownAlignmentHorizontalPosition,
    DropdownItemModel,
    DropdownModel
} from '@components/dropdown/dropdown.models';
import Dropdown from '@components/dropdown/dropdown';
import useComponentVisibility from '@shared/hooks/useComponentVisibility';
import {useMutation} from 'react-query';
import {setAssignee} from '@pages/tickets/services/tickets.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import {changeAssignee, setTicket} from '@pages/tickets/store/tickets.slice';

interface TicketAssigneeProps {
    ticketId: string,
    assignee?: string,
    dropdownHorizontalPosition?: DropdownAlignmentHorizontalPosition
}

const TicketAssignee = ({ticketId, assignee, dropdownHorizontalPosition}: TicketAssigneeProps) => {
    const {t} = useTranslation();
    const users = useSelector(selectUserList);
    const dispatch = useDispatch();
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

    const mutation = useMutation(setAssignee, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_assigned'
            }));
            dispatch(setTicket(data));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_assign_error',
                type: SnackbarType.Error
            }));
        }
    });

    useEffect(() => {
        const results = users.map(user => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user.id
        } as DropdownItemModel));
        setUserDropdownItems(results);
    }, [users]);

    useEffect(() => {
        const user = users.find(user => user.id === assignee);
        if (user) {
            setSelectedUser(user);
        }
    }, [users, assignee]);


    const updateAssignee = (tId: string, assig: User) => {
        mutation.mutate({ticketId: tId, assignee: assig.id}, {
            onSuccess: () => {
                dispatch(changeAssignee({
                    ticketId: tId,
                    assigneeId: assig.id
                }));
            }
        });
        setSearchAssigneeToggle(false);
    };

    const openSearchAssignee = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
        setTimeout(() => setSearchAssigneeToggle(!searchAssigneeToggle), 100);
    }

    const determineDropdownPosition = () => {
        switch (dropdownHorizontalPosition) {
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
                <div className='flex flex-wrap items-center'>
                    <div className='mr-4'>
                        <Avatar
                            model={{
                                initials: utils.getInitialsFromFullName(`${selectedUser.firstName} ${selectedUser.lastName}` || '')
                            }}
                        />
                    </div>
                    <div ref={chevronPosition}>
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
