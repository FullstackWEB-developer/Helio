import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {User} from '@shared/models/user';
import Avatar from '@shared/components/avatar/avatar';
import utils from '@shared/utils/utils';
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
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {changeAssignee, setTicket} from '@pages/tickets/store/tickets.slice';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import {useSmartPosition} from '@shared/hooks';
import classnames from 'classnames';
interface TicketAssigneeProps {
    ticketId: string,
    assignee?: string
}

const TicketAssignee = ({ticketId, assignee}: TicketAssigneeProps) => {
    const {t} = useTranslation();
    const users = useSelector(selectUserList);
    const dispatch = useDispatch();
    const [searchAssigneeToggle, setSearchAssigneeToggle] = useState(false);
    const [userDropdownItems, setUserDropdownItems] = useState<DropdownItemModel[]>([]);
    const assigneeDisplayRef = useRef<HTMLDivElement>(null);
    const [selectedUser, setSelectedUser] = useState({} as User);
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false)
    const chevronPosition = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {top, left} = useSmartPosition(dropdownRef, assigneeDisplayRef, isVisible);

    const userDropdownModel: DropdownModel = {
        isSearchable: true,
        defaultValue: selectedUser.id,
        items: userDropdownItems.sort((a:DropdownItemModel,b:DropdownItemModel) => a.label.localeCompare(b.label)),
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
        let results = users.map(user => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user.id
        } as DropdownItemModel));
        if (assignee) {
            results = results.filter(a => a.value !== assignee);
        }
        setUserDropdownItems(results);
    }, [users, assignee]);

    useEffect(() => {
        const user = users.find(user => user.id === assignee);
        if (user) {
            setSelectedUser(user);
        }
    }, [users, assignee]);


    const updateAssignee = (tId: string, assig: User) => {
        dispatch(setGlobalLoading(true));
        mutation.mutate({ticketId: tId, assignee: assig.id}, {
            onSuccess: () => {
                dispatch(changeAssignee({
                    ticketId: tId,
                    assigneeId: assig.id
                }));
            },
            onSettled: () => {
                dispatch(setGlobalLoading(false));
            }
        });
        setSearchAssigneeToggle(false);
    };

    const openSearchAssignee = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setIsVisible(!isVisible);
        setTimeout(() => setSearchAssigneeToggle(!searchAssigneeToggle), 100);
    }

    return <div ref={elementRef} className='col-span-2'>
        <div ref={assigneeDisplayRef} className='flex items-center'>
            {selectedUser?.id ?
                <div className='inline-flex flex-row items-center flex-none cursor-pointer' onClick={openSearchAssignee}>
                    <div className='mr-4'>
                        <Avatar userFullName={utils.stringJoin(' ', selectedUser.firstName, selectedUser.lastName)} userPicture={selectedUser.profilePicture} />
                    </div>
                    <div ref={chevronPosition} className='pr-2'>
                        <div>{selectedUser.firstName} {selectedUser.lastName}</div>
                    </div>
                    <SvgIcon type={isVisible ? Icon.ArrowUp : Icon.ArrowDown} fillClass={'select-arrow-fill'} />
                </div>
                :
                <div className='flex flex-row items-center cursor-pointer w-min' onClick={openSearchAssignee}>
                    <div>{t('tickets.unassigned')}</div>
                    <div className='pl-3' ref={chevronPosition} >
                        <SvgIcon type={!isVisible ? Icon.ArrowDown : Icon.ArrowUp} className='cursor-pointer' fillClass='active-item-icon' />
                    </div>
                </div>
            }
        </div>
        <div onClick={e => e.stopPropagation()}
            className={classnames('absolute z-10 w-48', {'hidden': !isVisible})}
            style={{top: top, left: left}}
            ref={dropdownRef}
        >
            <Dropdown model={userDropdownModel} />
        </div>
    </div>
}

export default withErrorLogging(TicketAssignee);
