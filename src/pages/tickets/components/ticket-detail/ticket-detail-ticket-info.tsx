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
import {setTicket, setTicketUpdateModel} from '@pages/tickets/store/tickets.slice';
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
import { TicketNote } from '@pages/tickets/models/ticket-note';
import { useMutation, useQuery } from 'react-query';
import { addNote, getTicketByNumber } from '@pages/tickets/services/tickets.service';
import { QueryTickets } from '@constants/react-query-constants';
import { useTranslation } from 'react-i18next';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';

interface TicketInfoProps {
    ticket: Ticket,
    control: Control<TicketUpdateModel>,
    watch: (fieldName: string) => any
}

const TicketDetailTicketInfo = ({ticket, control, watch}: TicketInfoProps) => {

    const updateModel = useSelector(selectTicketUpdateModel);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const appUserDetails = useSelector(selectAppUserDetails);
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

    const {refetch: refetchTicket} = useQuery<Ticket, Error>([QueryTickets, ticket?.ticketNumber], () =>
        getTicketByNumber(Number(ticket?.ticketNumber), true),
        {
            enabled: false,
            onSuccess: data => {
                dispatch(setTicket(data))
            }
        }
    );

    const addNoteMutation = useMutation(addNote, {
        onSuccess: () => {
            refetchTicket();
        }
    });

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
        if(ticket.id){
            dispatch(setParentTicketId(ticket.id));
        }
        if(updateModel.callbackPhoneNumber){
            const note: TicketNote = {
                noteText: t('ticket_detail.info_panel.system_message_for_callback', {
                    callerName: appUserDetails ? appUserDetails.fullName : '',
                    phoneNumber: utils.applyPhoneMask(updateModel.callbackPhoneNumber)
                }),
                isVisibleToPatient: false
            };
            if (ticket.id) {
                addNoteMutation.mutate({
                    ticketId: ticket.id,
                    note
                });
            }
        }
        utils.initiateACall(updateModel.callbackPhoneNumber)
    }

    const handleCall = () => {
        if(ticket.originationNumber){
            const note: TicketNote = {
                noteText: t('ticket_detail.info_panel.system_message_for_callback', {
                    callerName: appUserDetails ? appUserDetails.fullName : '',
                    phoneNumber: utils.applyPhoneMask(ticket.originationNumber)
                }),
                isVisibleToPatient: false
            };
            if (ticket.id) {
                addNoteMutation.mutate({
                    ticketId: ticket.id,
                    note
                });
            }
        }
        utils.initiateACall(ticket.originationNumber)
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
            {
                !ticket.callbackPhoneNumber && ticket.originationNumber &&
                <ControlledInput
                    name='originationNumber'
                    type='text'
                    control={control}
                    disabled
                    dropdownIcon={Icon.Phone} label={'ticket_detail.info_panel.phone_number'} defaultValue={utils.applyPhoneMask(ticket.originationNumber)}
                    dropdownIconClickHandler={handleCall} />
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
