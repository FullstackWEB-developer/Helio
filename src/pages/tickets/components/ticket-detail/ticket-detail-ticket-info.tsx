import React, {useEffect, useState} from 'react';
import {Ticket} from '../../models/ticket';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectEnumValuesAsOptions,
    selectLookupValuesAsOptions,
    selectTicketUpdateModel
} from '@pages/tickets/store/tickets.selectors';
import ControlledSelect from '@components/controllers/controlled-select';
import {Option} from '@components/option/option';
import {Controller, useForm} from 'react-hook-form';
import {setTicket, setTicketUpdateModel} from '@pages/tickets/store/tickets.slice';
import {selectDepartmentListAsOptions} from '@shared/store/lookups/lookups.selectors';
import Button from '@components/button/button';
import {useMutation} from 'react-query';
import {addFeed, updateTicket} from '@pages/tickets/services/tickets.service';
import {FeedTypes, TicketFeed} from '@pages/tickets/models/ticket-feed';
import {useTranslation} from 'react-i18next';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import TagInput from '@components/tag-input/tag-input';
import Spinner from '@components/spinner/Spinner';

interface TicketInfoProps {
    ticket: Ticket
}

const TicketDetailTicketInfo = ({ticket}: TicketInfoProps) => {

    const updateModel = useSelector(selectTicketUpdateModel);
    const {handleSubmit, control} = useForm({
        defaultValues: updateModel
    });
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [isDirty, setDirty] = useState(false);
    const statusOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketStatus')));
    const departmentOptions = useSelector(selectDepartmentListAsOptions);
    const priorityOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketPriority')));
    const locationOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'Department'));
    const reasonOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketReason'));
    const tagOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketTags'));
    const ticketTypeOptions = useSelector((state) => selectEnumValuesAsOptions(state, 'TicketType'));

    const generateTicketUpdateModel = () => {
        dispatch(setTicketUpdateModel({
            status: statusOptions.find(a => a.value.toString() === ticket.status?.toString()),
            priority: priorityOptions.find(a => a.value.toString() === ticket.priority?.toString()),
            department: departmentOptions.find(a => a.value.toString() === ticket.department?.toString()),
            type: ticketTypeOptions.find(a => a.value.toString() === ticket.type?.toString()),
            reason: reasonOptions.find(a => a.value.toString() === ticket.reason?.toString()),
            location: locationOptions.find(a => a.value.toString() === ticket.location?.toString()),
            tags: ticket.tags ? ticket.tags : []
        }));
    }

    useEffect(() => {
        generateTicketUpdateModel();
    }, [ticket]);

    const addFeedMutation = useMutation(addFeed, {
        onSuccess: (data) => {
            dispatch(setTicket(data));
        }
    });

    const ticketUpdateMutation = useMutation(updateTicket, {
        onSuccess: (data, variables) => {
            const ticketData = variables.ticketData;
            dispatch(setTicket(data));
            if (data.id && ticketData.status) {
                const feedData: TicketFeed = {
                    feedType: FeedTypes.StatusChange,
                    description: `${t('ticket_detail.feed.description_prefix')} ${updateModel.status?.label}`
                };
                addFeedMutation.mutate({ticketId: ticket.id!, feed: feedData});
            }
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.ticket_updated'
            }));
            setDirty(false);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'ticket_detail.ticket_update_failed',
                type: SnackbarType.Error
            }));
        }
    });

    const onSubmit = () => {
        ticketUpdateMutation.mutate({
            id: ticket.id!,
            ticketData: {
                department: updateModel.department?.value !== ticket.department?.toString() ? updateModel.department?.value : undefined,
                status: updateModel.status?.value !== ticket.status?.toString() ? Number(updateModel.status?.value) : undefined,
                priority: updateModel.priority?.value !== ticket.priority?.toString() ? Number(updateModel.priority?.value) : undefined,
                reason: updateModel.reason?.value !== ticket.reason?.toString() ? updateModel.reason?.value : undefined,
                location: updateModel.location?.value !== ticket.location?.toString() ? updateModel.location?.value : undefined,
                type: updateModel.type?.value !== ticket.type?.toString() ? updateModel.type?.value : undefined,
                tags: updateModel.tags
            }
        })
    }

    const handleChangeItem = (fieldName: string, option?: Option) => {
        if (option) {
            dispatch(setTicketUpdateModel({
                ...updateModel,
                [fieldName]: option
            }));
            setDirty(true);
        }
    }

    const handleTags = (tags: string[]) => {
        dispatch(setTicketUpdateModel({
            ...updateModel,
            tags
        }));
        setDirty(true);
    }

    if (!updateModel) {
        return <Spinner size='medium'/>
    }

    const resetForm = () => {
        generateTicketUpdateModel();
        setDirty(false);
    }

    return (
        <div className='pt-2'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <ControlledSelect
                        name='status'
                        label={'ticket_detail.info_panel.status'}
                        options={statusOptions}
                        value={updateModel.status}
                        control={control}
                        onSelect={(option?: Option) => handleChangeItem('status', option)}
                    />
                    <ControlledSelect
                        name='priority'
                        label={'ticket_detail.info_panel.priority'}
                        options={priorityOptions}
                        value={updateModel.priority}
                        control={control}
                        onSelect={(option?: Option) => handleChangeItem('priority', option)}
                    />

                    <ControlledSelect
                        name='type'
                        label={'ticket_detail.info_panel.ticket_type'}
                        options={ticketTypeOptions}
                        value={updateModel.type}
                        control={control}
                        onSelect={(option?: Option) => handleChangeItem('type', option)}
                    />
                    {(reasonOptions.length > 0) &&
                    <ControlledSelect
                        name='reason'
                        label={'ticket_detail.info_panel.reason'}
                        options={reasonOptions}
                        value={updateModel.reason}
                        control={control}
                        onSelect={(option?: Option) => handleChangeItem('reason', option)}
                    />
                    }
                    <ControlledSelect
                        name='department'
                        label={'ticket_detail.info_panel.department'}
                        options={departmentOptions}
                        value={updateModel.department}
                        control={control}
                        onSelect={(option?: Option) => handleChangeItem('department', option)}
                    />
                    <ControlledSelect
                        name='location'
                        label={'ticket_detail.info_panel.location'}
                        options={locationOptions}
                        value={updateModel.location}
                        control={control}
                        onSelect={(option?: Option) => handleChangeItem('location', option)}
                    />
                    <div className='pb-8'>
                        <Controller
                            name='tagsInput'
                            control={control}
                            defaultValue=''
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
                    {isDirty && <div className='flex flex-row space-x-4 justify-end bg-secondary-50 mt-2'>
                        <div className='flex items-center'>
                            <Button data-test-id='ticket-detail-info-panel-cancel-ticket-button' type={'button'}
                                    buttonType='secondary'
                                    label={'common.cancel'}
                                    onClick={() => resetForm()}
                            />
                        </div>
                        <div>
                            <Button data-test-id='ticket-detail-info-panel-update-ticket-button' type={'submit'}
                                    buttonType='small'
                                    isLoading={ticketUpdateMutation.isLoading}
                                    label={'ticket_detail.info_panel.update_ticket'}/>
                        </div>
                    </div>}
                </div>
            </form>
        </div>
    )
}
export default withErrorLogging(TicketDetailTicketInfo);
