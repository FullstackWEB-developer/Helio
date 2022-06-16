import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Controller, useForm} from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import Select from '../../../../shared/components/select/select';
import {Option} from '@components/option/option';
import {selectActiveUserOptions, selectUserList} from '@shared/store/lookups/lookups.selectors';
import {setAssignee} from '../../services/tickets.service';
import {useMutation} from 'react-query';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import Avatar from '@components/avatar/avatar';
import {useTranslation} from 'react-i18next';
import './ticket-detail-assignee.scss';
import {User} from '@shared/models/user';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import SvgIcon, {Icon} from '@components/svg-icon';

interface TicketDetailAssigneeProps {
    ticket: Ticket
}

const TicketDetailAssignee = ({ticket}: TicketDetailAssigneeProps) => {
    const {control} = useForm();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const userListOptions = useSelector(selectActiveUserOptions);
    const allUserList = useSelector(selectUserList);
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User>();

    useEffect(() => {
        const user: User | undefined = allUserList ? allUserList.find(item => item.id === ticket.assignee) : undefined;
        setSelectedUser(user);
    }, [ticket.assignee, allUserList])

    const updateAssigneeMutation = useMutation(setAssignee, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_assigned'
            }));
            setEditMode(false);
            dispatch(setTicket(data))
        },
        onError: (error: any) => {
            dispatch(addSnackbarMessage({
                message: error?.response?.data.statusCode === 409 ? 'ticket_detail.ticket_already_assigned_to_selected_user_error' : 'ticket_detail.ticket_assign_error',
                type: SnackbarType.Error
            }));
        },
        onSettled: () => {
            dispatch(setGlobalLoading(false));
        }
    });

    const [selectedOption, setSelectedOption] = useState(
        userListOptions ? userListOptions.find((o: Option) => o.value === ticket?.assignee) : undefined
    );


    const handleChangeAssignedTo = (option?: Option) => {
        const user = userListOptions ? userListOptions.find((o: Option) => o.value === option?.value) : {} as any;
        if (ticket.id && user) {
            dispatch(setGlobalLoading(true));
            updateAssigneeMutation.mutate({ticketId: ticket.id, assignee: user.value});
            setSelectedOption(user.value);
        }
    }

    const getFullName = () => selectedUser ? `${selectedUser?.firstName} ${selectedUser?.lastName}` : '';

    if (!isEditMode) {
        return <div className='flex h-14 pb-4 flex-row items-center justify-between'>
            <div className='flex flex-row items-center'>
                <div>
                    {selectedUser && <Avatar userFullName={getFullName()} userPicture={selectedUser?.profilePicture} />}
                </div>
                <div className='pl-4'>{getFullName()}</div>
            </div>
            <div onClick={() => setEditMode(true)}
                className='body2 justify-end cursor-pointer ticket-detail-assignee-change'>
                {selectedUser && t('ticket_detail.info_panel.change')}
                {!selectedUser && t('ticket_detail.info_panel.assign')}
            </div>

        </div>
    }

    return <div className={'w-96 h-14 pb-4 mx-auto flex flex-col'}>
        <form>
            <div className='flex items-baseline'>
                <Controller
                    name='assignedTo'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'assigned-to-user-list'}
                            options={userListOptions}
                            value={selectedOption}
                            onSelect={(option?: Option) => {
                                handleChangeAssignedTo(option);
                            }}
                        />
                    )}
                />
                <SvgIcon type={Icon.Close} className='icon-small cursor-pointer' onClick={() => setEditMode(false)} />
            </div>
        </form>
        
    </div>
}

export default withErrorLogging(TicketDetailAssignee);
