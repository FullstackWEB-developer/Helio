import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Controller, useForm} from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import Select from '../../../../shared/components/select/select';
import {Option} from '@components/option/option';
import {selectUserOptions} from '@shared/store/lookups/lookups.selectors';
import {setAssignee} from '../../services/tickets.service';
import {useMutation} from 'react-query';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import {setTicket} from '@pages/tickets/store/tickets.slice';
import Avatar from '@components/avatar/avatar';
import {AvatarModel} from '@components/avatar/avatar.models';
import utils from '@shared/utils/utils';
import {useTranslation} from 'react-i18next';
import './ticket-detail-assignee.scss';

interface TicketDetailAssigneeProps {
    ticket: Ticket
}

const TicketDetailAssignee = ({ticket}: TicketDetailAssigneeProps) => {
    const {control} = useForm();
    const dispatch = useDispatch();
    const userList = useSelector(selectUserOptions);
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const {t} = useTranslation();
    const [selectedUser, setSelectedUser] = useState<Option | undefined>();
    useEffect(() => {
        const user = userList ? userList.find((o: Option) => o.value === ticket.assignee) : {} as any;
        setSelectedUser(user);
    }, [selectedUser])

    const updateAssigneeMutation = useMutation(setAssignee, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_assigned'
            }));
            setEditMode(false);
            dispatch(setTicket(data))
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_assign_error',
                type: SnackbarType.Error
            }));
        }
    });

    const [selectedOption, setSelectedOption] = useState(
        userList ? userList.find((o: Option) => o.value === ticket?.assignee) : undefined
    );

    const handleChangeAssignedTo = (option?: Option) => {
        const user = userList ? userList.find((o: Option) => o.value === option?.value) : {} as any;
        if (ticket.id && user) {
            updateAssigneeMutation.mutate({ticketId: ticket.id, assignee: user.value});
            setSelectedOption(user.value);
        }
    }

    const avatarModel: AvatarModel = {
        initials: utils.getInitialsFromFullName(selectedUser?.label ? selectedUser?.label : '')
    }

    if (!isEditMode) {
        return <div className='flex h-14 pb-4 flex-row items-center justify-between'>
            <div className='flex flex-row items-center'>
                <div>
                    <Avatar model={avatarModel}/>
                </div>
                <div className='pl-4'>{selectedUser?.label}</div>
            </div>
            <div onClick={() => setEditMode(true)}
                 className='body2 justify-end cursor-pointer ticket-detail-assignee-change'>
                {t('ticket_detail.info_panel.change')}
            </div>

        </div>
    }

    return <div className={'w-96 h-14 pb-4 mx-auto flex flex-col'}>
        <form>
            <div className='divide-y px-8'>
                <Controller
                    name='assignedTo'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'assigned-to-user-list'}
                            options={userList}
                            value={selectedOption}
                            onSelect={(option?: Option) => {
                                handleChangeAssignedTo(option);
                            }}
                        />
                    )}
                />
            </div>
        </form>
    </div>
}

export default withErrorLogging(TicketDetailAssignee);
