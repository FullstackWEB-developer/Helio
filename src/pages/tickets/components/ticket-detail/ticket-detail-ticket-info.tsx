import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed, getEnumByType, getLookupValues, updateTicket } from '../../services/tickets.service';
import { Ticket } from '../../models/ticket';
import { Controller, useForm } from 'react-hook-form';
import Select from '@components/select/select';
import { Option } from '@components/option/option';
import TagInput from '@components/tag-input/tag-input';
import Button from '@components/button/button';
import { selectDepartmentList, selectIsDepartmentListLoading } from '@shared/store/lookups/lookups.selectors';
import {
    selectEnumValues,
    selectIsTicketEnumValuesLoading,
    selectIsTicketLookupValuesLoading,
    selectLookupValues,
    selectTicketOptionsError
} from '../../store/tickets.selectors';
import { setTicket } from '../../store/tickets.slice';
import { getDepartments } from '@shared/services/lookups.service';
import { Department } from '@shared/models/department';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import withErrorLogging from '@shared/HOC/with-error-logging';
import { FeedTypes, TicketFeed } from '../../models/ticket-feed';
import { useMutation } from 'react-query';
import Logger from '@shared/services/logger';

interface TicketInfoProps {
    ticket: Ticket
}

const TicketDetailTicketInfo = ({ ticket }: TicketInfoProps) => {
    const { handleSubmit, control, errors, formState } = useForm();
    const [formVisible, setFormVisible] = useState(true);
    const [isTicketInfoButtonsVisible, setIsTicketInfoButtonsVisible] = useState(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const departments = useSelector(selectDepartmentList);
    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));
    const ticketLookupValuesDepartment = useSelector((state) => selectLookupValues(state, 'Department'));
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketLookupValuesTags = useSelector((state) => selectLookupValues(state, 'TicketTags'));

    const error = useSelector(selectTicketOptionsError);

    const isDepartmentListLoading = useSelector(selectIsDepartmentListLoading);
    const isLookupValuesLoading = useSelector(selectIsTicketLookupValuesLoading);
    const isTicketEnumValuesLoading = useSelector(selectIsTicketEnumValuesLoading);
    const logger = Logger.getInstance();

    const ticketUpdateMutation = useMutation(updateTicket, {
        onSuccess: (data, variables) => {
            const ticketData = variables.ticketData;
            if (ticketData.tags) {
                setInitialTags(ticketData.tags);
            }
            dispatch(setTicket(data));
            if (ticketData.id && ticketData.status) {
                const feedData: TicketFeed = {
                    feedType: FeedTypes.StatusChange,
                    description: `${t('ticket_detail.feed.description_prefix')} ${selectedStatus?.label}`
                };
                dispatch(addFeed(ticketData.id, feedData));
            }
            resetForm();
        },
        onError: (error) => {
            logger.error('Error updating ticket', error);
        }
    });

    const onSubmit = async () => {
        const ticketData: Ticket = {
            type: isDirty('ticketType') ? selectedTicketTypeOption?.value : undefined,
            reason: isDirty('reason') ? selectedReason?.value : undefined,
            status: isDirty('status') && selectedStatus ? parseInt(selectedStatus.value) : undefined,
            priority: isDirty('priority') && selectedPriority ? parseInt(selectedPriority.value) : undefined,
            department: isDirty('department') ? selectedDepartment?.value : undefined,
            location: isDirty('location') ? selectedLocation?.value : undefined,
            tags: isDirty('tagsInput') ? tags : undefined
        };
        if (ticket?.id) {
            ticketUpdateMutation.mutate({ id: ticket.id, ticketData: ticketData });
        }
    }

    const isDirty = (field: string) => {
        return !!formState.dirtyFields[field];
    };

    useEffect(() => {
        dispatch(getDepartments());
        dispatch(getEnumByType('FeedType'));
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketType'));
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketReason'));
        dispatch(getLookupValues('TicketTags'));
    }, [dispatch]);

    const getOptions = (data: any[] | undefined) => {
        return data !== undefined ? data?.map((item: any) => {
            return {
                value: item.key,
                label: item.value
            };
        }) : [];
    }

    const priorityOptions: Option[] = getOptions(ticketPriorities);
    const statusOptions: Option[] = getOptions(ticketStatuses);
    const ticketTypeOptions: Option[] = getOptions(ticketTypes);

    const locationOptions: Option[] = useMemo(() => {
        return departments ? departments.map((item: Department) => {
            return {
                value: item.id.toString(),
                label: item.address
            };
        }) : []
    }, [departments]);

    const [selectedStatus, setSelectedStatus] = useState(
        statusOptions ? statusOptions.find((o: Option) => parseInt(o.value) === ticket?.status) : undefined
    );

    const [selectedPriority, setSelectedPriority] = useState(
        priorityOptions ? priorityOptions.find((o: Option) => parseInt(o.value) === ticket?.priority) : undefined
    );

    const [selectedLocation, setSelectedLocation] = useState(
        locationOptions ? locationOptions.find((o: Option) => o.value === ticket?.location) : undefined
    );

    useEffect(() => {
        if (statusOptions?.length > 0 && !selectedStatus) {
            setSelectedStatus(statusOptions.find((o: Option) => parseInt(o.value) === ticket?.status));
        }
        if (priorityOptions?.length > 0 && !selectedPriority) {
            setSelectedPriority(priorityOptions.find((o: Option) => parseInt(o.value) === ticket?.priority));
        }

        if (locationOptions?.length > 0 && !selectedLocation) {
            setSelectedLocation(locationOptions.find((o: Option) => o.value === ticket?.location));
        }
    }, [
        statusOptions, selectedStatus, ticket?.status,
        priorityOptions, selectedPriority, ticket?.priority,
        locationOptions, selectedLocation, ticket?.location,
    ]);

    useEffect(() => {
        if (ticket?.status && ticket.status.toString() !== selectedStatus?.value?.toString()) {
            setSelectedStatus(selectedStatus);
        }
    }, [statusOptions, ticket?.status])

    const getTicketLookupValuesOptions = (data: any[] | undefined) => {
        if (data) {
            return convertToOptions(data)
        }
        return [];
    }

    const [selectedTicketTypeOption, setSelectedTicketTypeOption] =
        useState(ticketTypeOptions ? ticketTypeOptions.find((o: Option) => o.value === ticket?.type) : undefined);

    const getTicketLookupValuesOptionsByTicketType = (data: any[] | undefined) => {
        if (data && selectedTicketTypeOption) {
            const filtered = data.filter(v => v.parentValue === selectedTicketTypeOption.value.toString());
            return convertToOptions(filtered);
        }
        return [];
    }

    const convertToOptions = (data: any[]) => {
        return data.map((item: any) => {
            return {
                value: item.value,
                label: item.label
            };
        })
    }

    const reasonOptions: Option[] = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesReason);
    const departmentOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesDepartment);
    const tagOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesTags);

    const [selectedReason, setSelectedReason] = useState(
        reasonOptions ? reasonOptions.find((o: Option) => o.value === ticket?.reason) : undefined
    );

    const [selectedDepartment, setSelectedDepartment] = useState(
        departmentOptions ? departmentOptions.find((o: Option) => o.value === ticket?.department) : undefined
    );

    const [tags, setTags] = useState<string[]>(ticket?.tags || []);
    const [initialTags, setInitialTags] = useState<string[]>(ticket?.tags || []);

    useEffect(() => {
        if (ticketTypeOptions?.length > 0 && !selectedTicketTypeOption) {
            setSelectedTicketTypeOption(ticketTypeOptions.find((o: Option) => o.value === ticket?.type));
        }

        if (reasonOptions?.length > 0 && !selectedReason) {
            setSelectedReason(reasonOptions.find((o: Option) => o.value === ticket?.reason));
        }

        if (departmentOptions?.length > 0 && !selectedDepartment) {
            setSelectedDepartment(departmentOptions.find((o: Option) => o.value === ticket?.department));
        }
    }, [
        ticketTypeOptions, selectedTicketTypeOption, ticket?.type,
        reasonOptions, selectedReason, ticket?.reason,
        departmentOptions, selectedDepartment, ticket?.department]);

    const handleChangeItem = (option: Option, itemType: Option[], dirtyField: string, setter: Function) => {

        const selectedOption =
            itemType ? itemType.find((o: Option) => o.value === option?.value) : {} as any;

        if (selectedOption) {
            setter(selectedOption);
            formState.dirtyFields[dirtyField] = true
            setIsTicketInfoButtonsVisible(true);
        }
    }

    const setSelectedTags = (tags: string[]) => {
        setTags(tags);
        formState.dirtyFields.tagsInput = true
        setIsTicketInfoButtonsVisible(true);
    };

    const resetForm = () => {
        setFormVisible(false);
        setTimeout(() => {
            setFormVisible(true);
        }, 0);
        setIsTicketInfoButtonsVisible(false);
    }

    if (isDepartmentListLoading || isLookupValuesLoading || isTicketEnumValuesLoading) {
        return <ThreeDots data-test-id='ticket-detail-loading' />;
    }

    if (departments === undefined
        || ticketPriorities === undefined
        || ticketStatuses === undefined
        || ticketTypes === undefined
        || ticketLookupValuesDepartment === undefined
        || ticketLookupValuesReason === undefined
        || ticketLookupValuesTags === undefined
    ) {
        return <div data-test-id='ticket-detail-load-failed'>{t('ticket_detail.info_panel.load_failed')}</div>
    }

    if (error) {
        return <div data-test-id='ticket-detail-error'>{t('common.error')}</div>
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        {formVisible &&
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Controller
                        name='status'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-detail-status'}
                                label={'ticket_detail.info_panel.status'}
                                options={statusOptions}
                                value={selectedStatus}
                                onSelect={(option?: Option) => {
                                    if (option) {
                                        props.onChange(option.value);
                                        handleChangeItem(option, statusOptions, "status", setSelectedStatus);
                                    }
                                }}
                                error={errors.status?.message}
                            />
                        )}
                    />
                    <Controller
                        name='priority'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-detail-priority'}
                                label={'ticket_detail.info_panel.priority'}
                                options={priorityOptions}
                                value={selectedPriority}
                                onSelect={(option?: Option) => {
                                    if (option) {
                                        props.onChange(option.value);
                                        handleChangeItem(option, priorityOptions, "priority", setSelectedPriority);
                                    }
                                }}
                                error={errors.priority?.message}
                            />
                        )}
                    />
                    <Controller
                        name='ticketType'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-detail-ticket-type'}
                                label={'ticket_detail.info_panel.ticket_type'}
                                options={ticketTypeOptions}
                                value={selectedTicketTypeOption}
                                onSelect={(option?: Option) => {
                                    if (option) {
                                        props.onChange(option.value);
                                        handleChangeItem(option, ticketTypeOptions, "ticketType", setSelectedTicketTypeOption);
                                    }
                                }}
                                error={errors.ticketType?.message}
                            />
                        )}
                    />
                    {(selectedTicketTypeOption && reasonOptions.length > 0) &&
                        <Controller
                            name='reason'
                            control={control}
                            defaultValue=''
                            render={(props) => (
                                <Select
                                    {...props}
                                    data-test-id={'ticket-detail-reason'}
                                    label={'ticket_detail.info_panel.reason'}
                                    options={reasonOptions}
                                    value={selectedReason}
                                    onSelect={(option?: Option) => {
                                        if (option) {
                                            props.onChange(option?.value);
                                            handleChangeItem(option, reasonOptions, "reason", setSelectedReason);
                                        }
                                    }}
                                />
                            )}
                        />
                    }
                    <Controller
                        name='department'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id='ticket-detail-department'
                                label={'ticket_detail.info_panel.department'}
                                options={departmentOptions}
                                value={selectedDepartment}
                                onSelect={(option?: Option) => {
                                    if (option) {
                                        props.onChange(option?.value);
                                        handleChangeItem(option, departmentOptions, "department", setSelectedDepartment);
                                    }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name='location'
                        control={control}
                        defaultValue={locationOptions ? locationOptions[0] : ''}
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-detail-location'}
                                label={'ticket_detail.info_panel.location'}

                                options={locationOptions}
                                value={selectedLocation}
                                onSelect={(option?: Option) => {
                                    if (option) {
                                        props.onChange(option.value);
                                        handleChangeItem(option, locationOptions, "location", setSelectedLocation);
                                    }
                                }}
                                error={errors.location?.message}
                            />
                        )}
                    />
                </div>
                <Controller
                    name='tagsInput'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <TagInput
                            {...props}
                            tagOptions={tagOptions}
                            label={'ticket_detail.info_panel.tags'}
                            initialTags={initialTags}
                            data-test-id='ticket-detail-tag-input'
                            className={'w-full border-none h-14'}
                            setSelectedTags={setSelectedTags}
                        />
                    )}
                />
                {isTicketInfoButtonsVisible &&
                    <div className='flex flex-row space-x-4 justify-end bg-secondary-50 mt-2'>
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
                                label={'ticket_detail.info_panel.update_ticket'} />
                        </div>
                    </div>
                }
            </form>
        }
    </div>
}

export default withErrorLogging(TicketDetailTicketInfo);
