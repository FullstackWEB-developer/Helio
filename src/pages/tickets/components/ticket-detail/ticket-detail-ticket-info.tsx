import React, {useMemo} from 'react';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectEnumValuesAsOptions, selectLookupValues,
    selectLookupValuesAsOptions,
    selectTicketUpdateModel
} from '@pages/tickets/store/tickets.selectors';
import ControlledSelect from '@components/controllers/controlled-select';
import {Option} from '@components/option/option';
import {Control, Controller} from 'react-hook-form';
import {setTicketUpdateModel} from '@pages/tickets/store/tickets.slice';
import {selectLocationsAsOptions} from '@shared/store/lookups/lookups.selectors';
import TagInput from '@components/tag-input/tag-input';
import {Icon} from '@components/svg-icon';
import Spinner from '@components/spinner/Spinner';
import ControlledInput from '@components/controllers/ControlledInput';
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';
import utils from '@shared/utils/utils';
import {Ticket} from '@pages/tickets/models/ticket';
import {selectActiveUserOptions} from '@shared/store/lookups/lookups.selectors';
import {TicketType} from '@shared/models';
import {setParentTicketId} from '@pages/ccp/store/ccp.slice';

interface TicketInfoProps {
    ticket: Ticket,
    control: Control<TicketUpdateModel>,
    watch: (fieldName: string) => any
}

const TicketDetailTicketInfo = ({ticket, control, watch}: TicketInfoProps) => {

    const updateModel = useSelector(selectTicketUpdateModel);
    const dispatch = useDispatch();
    const statusOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketStatus')));
    const locationOptions = useSelector(selectLocationsAsOptions);
    const priorityOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketPriority')));
    const departmentOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'Department'));
    const reasonOptions = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const tagOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketTags'));
    const ticketTypeOptions = useSelector((state) => selectEnumValuesAsOptions(state, 'TicketType'));
    const userListOptions = useSelector(selectActiveUserOptions);

    const handleChangeItem = (fieldName: string, option?: Option) => {
        const value = option ? option : undefined;
        dispatch(setTicketUpdateModel({
            ...updateModel,
            [fieldName]: value
        }));
    }

    const ticketType = watch('type');
    const reasonFilteredOptions = useMemo(() => {
        if (ticketType) {
            const type = ticketType.value ?? ticketType;
            return reasonOptions
                .filter(v => v.parentValue?.toString() === type)
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((item: any) => {
                return {
                    value: item.value,
                    label: item.label
                };
            });
        }
    }, [ticketType, reasonOptions])

    const handleTags = (tags: string[]) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            tags
        }));
    }

    const handleCallbackNumberChange = (number: string) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            callbackPhoneNumber: utils.clearFormatPhone(number)
        }));
    }

    if (!updateModel) {
        return <Spinner size='medium' />
    }

    const handleCallbackOutboundCall = () => {
        if(ticket.type === TicketType.Callback && ticket.id && ticket.callbackPhoneNumber){
            dispatch(setParentTicketId(ticket.id));
        }
        utils.initiateACall(updateModel.callbackPhoneNumber)
    }

    return (
        <div className='pt-2'>
            <ControlledSelect
                name='status'
                label={'ticket_detail.info_panel.status'}
                options={statusOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('status', option)}
            />
            <ControlledSelect
                name='priority'
                label={'ticket_detail.info_panel.priority'}
                options={priorityOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('priority', option)}
            />

            <ControlledSelect
                name='type'
                label={'ticket_detail.info_panel.ticket_type'}
                options={ticketTypeOptions}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('type', option)}
            />
            {
                ticket.callbackPhoneNumber &&
                <ControlledInput
                    name='callbackPhoneNumber'
                    type='tel'
                    control={control}
                    onChange={(e) => handleCallbackNumberChange(e.target.value)}
                    dropdownIcon={Icon.Phone} label={'ticket_detail.info_panel.callback_number'}
                    dropdownIconClickHandler={handleCallbackOutboundCall} />
            }
            {(reasonFilteredOptions && reasonFilteredOptions.length > 0) &&
                <ControlledSelect
                    name='reason'
                    label={'ticket_detail.info_panel.reason'}
                    options={reasonFilteredOptions}
                    control={control}
                    allowClear={true}
                    onSelect={(option?: Option) => handleChangeItem('reason', option)}
                />
            }
            <ControlledSelect
                name='department'
                label={'ticket_detail.info_panel.department'}
                options={departmentOptions}
                allowClear={true}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('department', option)}
            />
            <ControlledSelect
                name='location'
                label={'ticket_detail.info_panel.location'}
                options={locationOptions}
                allowClear={true}
                control={control}
                onSelect={(option?: Option) => handleChangeItem('location', option)}
            />
            <ControlledSelect
                    name='assignee'
                    label={'ticket_detail.info_panel.assigned_to'}
                    options={userListOptions}
                    control={control}
                    allowClear={true}
                    onSelect={(option?: Option) => handleChangeItem('assignee', option)}
            />
            <div className='pb-8'>
                <Controller
                    name='tagsInput'
                    control={control}
                    defaultValue={updateModel.tags}
                    render={(props) => (
                        <TagInput
                            {...props}
                            tagOptions={tagOptions}
                            label={'ticket_detail.info_panel.tags'}
                            initialTags={updateModel.tags}
                            data-test-id='ticket-detail-tag-input'
                            className={'w-full border-none h-14'}
                            setSelectedTags={handleTags}
                        />
                    )}
                />
            </div>
        </div >
    )
}
export default withErrorLogging(TicketDetailTicketInfo);
