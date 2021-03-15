import React, {ChangeEvent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import { User } from '../../../../shared/models/user';
import Select, { Option } from '../../../../shared/components/select/select';
import { selectUserList } from '../../../../shared/store/lookups/lookups.selectors';
import { setAssignee } from '../../services/tickets.service';

interface TicketDetailAssigneeProps {
    ticket: Ticket
}

const TicketDetailAssignee = ({ ticket }: TicketDetailAssigneeProps ) => {
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
        userOptions ? userOptions.find((o: Option) => o.value === ticket?.assignee) : null
    );

    const handleChangeAssignedTo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation();
        const selectedUser =
            userOptions ? userOptions.find((o: Option) => o.value.toString() === event.target.value) : {} as any;

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
                            className={'w-full border-none h-14'}
                            options={userOptions}
                            value={selectedOption?.value}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                handleChangeAssignedTo(e);
                            }}
                        />
                    )}
                />
            </div>
        </form>
    </div>
}

export default withErrorLogging(TicketDetailAssignee);
