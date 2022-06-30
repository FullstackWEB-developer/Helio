import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {selectActiveUserList, selectUserList} from '@shared/store/lookups/lookups.selectors';
import {User} from '@shared/models/user';
import Avatar from '@shared/components/avatar/avatar';
import utils from '@shared/utils/utils';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {
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
import { usePopper } from 'react-popper';
interface TicketAssigneeProps {
    ticketId: string,
    assignee?: string
}

const TicketAssignee = ({ticketId, assignee}: TicketAssigneeProps) => {
    const {t} = useTranslation();
    const activeUsers = useSelector(selectActiveUserList);
    const allUsers = useSelector(selectUserList);
    const dispatch = useDispatch();
    const [searchAssigneeToggle, setSearchAssigneeToggle] = useState(false);
    const [userDropdownItems, setUserDropdownItems] = useState<DropdownItemModel[]>([]);
    const [selectedUser, setSelectedUser] = useState({} as User);
    const [isVisible, setIsVisible, elementRef] = useComponentVisibility<HTMLDivElement>(false)
    const chevronPosition = useRef<HTMLDivElement>(null);

    const [popper, setPopper] = useState<HTMLDivElement | null>(null);
    const {styles, attributes, update} = usePopper(elementRef.current, popper, {
        placement: 'bottom',
        strategy: 'fixed',
        modifiers: [{
            name: 'offset',
            options: {
                offset: [0, 0],
            },
        }]
    });

    useEffect(() => {
        if (isVisible && update) {
            update().then();
        }
    }, [update, isVisible]);

    const userDropdownModel: DropdownModel = {
        isSearchable: true,
        defaultValue: selectedUser.id,
        items: userDropdownItems.sort((a:DropdownItemModel,b:DropdownItemModel) => a.label.localeCompare(b.label)),
        onClick: (id) => {
            const result = activeUsers.find(user => user.id === id);
            if (!result) {
                return;
            }
            updateAssignee(ticketId, result);
            setIsVisible(false);
        },
        isVisible: isVisible
    };

    const mutation = useMutation(setAssignee, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_assigned'
            }));
            dispatch(setTicket(data));
        }, onError: (error: any) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data.statusCode === 409 ? 'ticket_detail.ticket_already_assigned_to_selected_user_error' : 'ticket_detail.ticket_assign_error',
                type: SnackbarType.Error
            }));
        },
    });

    useEffect(() => {
        let results = activeUsers.map(user => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user.id,
            disabled: false
        } as DropdownItemModel));
        if (assignee) {
            results = results.filter(a => a.value !== assignee);
        }
        setUserDropdownItems(results);
    }, [activeUsers, assignee]);

    useEffect(() => {
        const user = allUsers.find(user => user.id === assignee);
        if (user) {
            setSelectedUser(user);
        }
    }, [activeUsers, allUsers, assignee]);


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

    return <div className='col-span-2 flex items-center' ref={elementRef}>
        <div className='flex items-center'>
            {selectedUser?.id ?
                <div className='inline-flex flex-row items-center flex-none cursor-pointer' onClick={openSearchAssignee}>
                    <div className='mr-4'>
                        <Avatar displayStatus={true} userId={selectedUser.id} userFullName={utils.stringJoin(' ', selectedUser.firstName, selectedUser.lastName)} userPicture={selectedUser.profilePicture} />
                    </div>
                    <div ref={chevronPosition} className='pr-2 truncate'>
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
            style={styles.popper} ref={setPopper}{...attributes.popper}
        >
            <Dropdown model={userDropdownModel} />
        </div>
    </div>
}

export default withErrorLogging(TicketAssignee);
