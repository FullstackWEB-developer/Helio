import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import { User } from '@shared/models/user';
import Select from '../../../../shared/components/select/select';
import { Option } from '@components/option/option';
import { selectUserList } from '@shared/store/lookups/lookups.selectors';
import { setAssignee } from '../../services/tickets.service';

interface TicketDetailAssigneeProps {
    ticket: Ticket
}

const TicketDetailAssignee = ({ ticket }: TicketDetailAssigneeProps) => {
    const { control } = useForm();
    const dispatch = useDispatch();
    const userList = useSelector(selectUserList);
    const userOptions: Option[] = userList ? userList.map((item: User) => {
        return {
            value: item.id,
            label: item.id
        };
    }) : [];
    const [selectedOption, setSelectedOption] = useState(
        userOptions ? userOptions.find((o: Option) => o.value === ticket?.assignee) : undefined
    );

    const handleChangeAssignedTo = (option?: Option) => {
        const selectedUser = userOptions ? userOptions.find((o: Option) => o.value === option?.value) : {} as any;
        if (ticket.id && selectedUser) {
            dispatch(setAssignee(ticket.id, selectedUser.value));
            setSelectedOption(selectedUser.value);
        }
    }

    return <div className={'w-96 py-4 mx-auto flex flex-col'}>
        <form>
            <div className='divide-y'>
                <Controller
                    name='assignedTo'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'assigned-to-user-list'}
                            options={userOptions}
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
