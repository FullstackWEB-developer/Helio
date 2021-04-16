import React, { ChangeEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {Controller, ControllerRenderProps, useForm} from 'react-hook-form';
import withErrorLogging from '../../shared/HOC/with-error-logging';

import ThreeDots from '../../shared/components/skeleton-loader/skeleton-loader';
import Button from '../../shared/components/button/button';
import Input from '../../shared/components/input/input';
import Select from '../../shared/components/select/select';
import { Option } from '@components/option/option';
import TagInput from '../../shared/components/tag-input/tag-input';
import { Contact } from '@shared/models/contact.model';
import { Department } from '@shared/models/department';
import { Ticket } from './models/ticket';
import { TicketNote } from './models/ticket-note';
import {
    selectEnumValues,
    selectIsTicketEnumValuesLoading,
    selectIsTicketLookupValuesLoading,
    selectLookupValues,
    selectTicketOptionsError
} from './store/tickets.selectors';
import { selectContacts, selectIsContactOptionsLoading } from '@shared/store/contacts/contacts.selectors';
import {
    selectDepartmentList,
    selectIsDepartmentListLoading,
    selectUserList
} from '@shared/store/lookups/lookups.selectors';

import { createTicket, getEnumByType, getLookupValues } from './services/tickets.service';
import { getContacts } from '@shared/services/contacts.service';
import { getDepartments, getUserList } from '@shared/services/lookups.service';
import TextArea from '../../shared/components/textarea/textarea';
import { User } from '@shared/models/user';
import { useHistory } from 'react-router-dom';
import utils from '../../shared/utils/utils';
import { TicketsPath } from '../../app/paths';
import DateTimeInput from "@components/date-time-input/date-time-input";

const TicketNew = () => {
    dayjs.extend(utc);
    const { handleSubmit, control, errors } = useForm();
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const requiredText = t('common.required');
    const TicketTypeDefault = '1';
    const users = useSelector(selectUserList);
    const departments = useSelector(selectDepartmentList);
    const contacts = useSelector(selectContacts);
    const ticketChannels = useSelector((state => selectEnumValues(state, 'TicketChannel')));
    const ticketPriorities = useSelector((state => selectEnumValues(state, 'TicketPriority')));
    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')));
    const ticketTypes = useSelector((state => selectEnumValues(state, 'TicketType')));

    const ticketLookupValuesDepartment = useSelector((state) => selectLookupValues(state, 'Department'));
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketLookupValuesSubject = useSelector((state) => selectLookupValues(state, 'TicketSubject'));
    const ticketLookupValuesTags = useSelector((state) => selectLookupValues(state, 'TicketTags'));

    const error = useSelector(selectTicketOptionsError);

    const isContactsLoading = useSelector(selectIsContactOptionsLoading);
    const isDepartmentListLoading = useSelector(selectIsDepartmentListLoading);
    const isLookupValuesLoading = useSelector(selectIsTicketLookupValuesLoading);
    const isTicketEnumValuesLoading = useSelector(selectIsTicketEnumValuesLoading);

    const [isTicketTypeSelected, setIsTicketTypeSelected] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [noteText, setNoteText] = useState('');
    const [isCreating, setCreating] = useState(false);
    const onSubmit = async (formData: any) => {
        if (!formData) {
            return;
        }

        const subjectOption = subjectOptions.find(o => o.value === formData.subject);
        const subjectValue = subjectOptions && subjectOptions.length > 1 && subjectOption ? subjectOption.label : formData.subjectInput;

        const dueDateTime = utils.getDateTime(formData.dueDate, formData.dueTime);

        const notes = [] as TicketNote[];
        if (noteText) {
            notes.push({
                noteText: noteText
            });
        }

        const ticketData: Ticket = {
            type: selectedTicketTypeOption ? selectedTicketTypeOption.value : TicketTypeDefault,
            reason: formData.reason,
            contactId: formData.contactId,
            connectContactId: '00000000-0000-0000-0000-000000000000',
            subject: subjectValue,
            status: formData.status,
            priority: formData.priority,
            dueDate: dueDateTime ? dueDateTime.toDate() : undefined,
            channel: formData.channel,
            department: formData.department,
            location: formData.location,
            assignee: formData.assignee,
            assignedOn: formData.assignee !== '' ? new Date() : undefined,
            patientId: formData.patientId,
            patientCaseNumber: formData.patientCaseNumber,
            tags: tags,
            notes: notes
        };

        setCreating(true);
        await createTicket(ticketData);
        setCreating(false);
        history.push(TicketsPath);
    }

    const queryparams = new URLSearchParams(window.location.search);
    const queryPatientId = queryparams.get('patientId');

    useEffect(() => {
        dispatch(getUserList());
        dispatch(getContacts());
        dispatch(getDepartments());
        dispatch(getEnumByType('TicketChannel'));
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketType'));
        dispatch(getLookupValues('Department'));
        dispatch(getLookupValues('TicketReason'));
        dispatch(getLookupValues('TicketSubject'));
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

    let sourceOptions: Option[] = getOptions(ticketChannels);
    let priorityOptions: Option[] = getOptions(ticketPriorities);
    let statusOptions: Option[] = getOptions(ticketStatuses);
    let ticketTypeOptions: Option[] = getOptions(ticketTypes);
    const assigneeOptions: Option[] = users ? users.map((item: User) => {
        return {
            value: item.id,
            label: item.id
        };
    }) : [];

    const contactOptions: Option[] = contacts ? contacts.map((item: Contact) => {
        return {
            value: item.id,
            label: item.name
        };
    }) : [];

    const locationOptions: Option[] = departments ? departments.map((item: Department) => {
        return {
            value: item.id.toString(),
            label: item.address
        };
    }) : [];

    const getTicketLookupValuesOptions = (data: any[] | undefined) => {
        if (data) {
            return convertToOptions(data)
        }
        return [];
    }

    const [selectedTicketTypeOption, setSelectedTicketTypeOption] =
        useState<Option>();

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

    const subjectOptions: Option[] = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesSubject);
    const reasonOptions: Option[] = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesReason);
    const departmentOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesDepartment);
    const tagOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesTags);

    const handleChangeTicketType = (option?: Option) => {
        const selectedTicketType =
            ticketTypeOptions ? ticketTypeOptions.find((o: Option) => o.value === option?.value) : {} as any;

        setSelectedTicketTypeOption(selectedTicketType);
        setIsTicketTypeSelected(true);
    }

    const setSelectedTags = (tags: string[]) => {
        setTags(tags);
    };

    if (isContactsLoading || isDepartmentListLoading || isLookupValuesLoading || isTicketEnumValuesLoading) {
        return <ThreeDots data-test-id='ticket-new-loading' />;
    }

    if (contacts === undefined
        || departments === undefined
        || ticketChannels === undefined
        || ticketPriorities === undefined
        || ticketStatuses === undefined
        || ticketTypes === undefined
        || ticketLookupValuesDepartment === undefined
        || ticketLookupValuesReason === undefined
        || ticketLookupValuesSubject === undefined
        || ticketLookupValuesTags === undefined
    ) {
        return <div data-test-id='ticket-new-load-failed'>{t('ticket_new.load_failed')}</div>
    }

    if (error) {
        return <div data-test-id='ticket-new-error'>{t('common.error')}</div>
    }

    function onSelectChange<TFieldValues>(props: ControllerRenderProps<TFieldValues>) {
        return (option?: Option) => {
            if (option) {
                props.onChange(option.value);
            }
        };
    }

    return <div className={'w-96 py-4 mx-auto flex flex-col'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Controller
                    name='ticketType'
                    control={control}
                    defaultValue=''
                    rules={{ required: requiredText }}
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'ticket-new-ticket-type'}
                            label={'ticket_new.ticket_type'}
                            options={ticketTypeOptions}
                            value={props.value}
                            onChange={(option?: Option) => {
                                if (option) {
                                    props.onChange(option?.value);
                                    handleChangeTicketType(option);
                                }
                            }}
                            error={errors.ticketType?.message}
                            required={true}
                        />
                    )}
                />
                {(isTicketTypeSelected && reasonOptions.length > 0) &&
                    <Controller
                        name='reason'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                label={'ticket_new.reason'}
                                data-test-id={'ticket-new-reason'}
                                options={reasonOptions}
                                value={props.value}
                                onChange={onSelectChange(props)}
                            />
                        )}
                    />
                }

                <Controller
                    name='contactId'
                    control={control}
                    defaultValue=''
                    rules={{ required: requiredText }}
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id='ticket_new.contact'
                            label={'ticket_new.contact'}
                            options={contactOptions}
                            value={props.value}
                            error={errors.contactId?.message}
                            required={true}
                            onChange={onSelectChange(props)}
                        />
                    )}
                />
                <div>
                    {
                        subjectOptions && subjectOptions.length > 1
                            ?
                            <Controller
                                name='subject'
                                control={control}
                                defaultValue=''
                                rules={{ required: requiredText }}
                                render={(props) => (
                                    <Select
                                        {...props}
                                        data-test-id={'ticket-new-subject-select'}
                                        label={'ticket_new.subject'}
                                        options={subjectOptions}
                                        value={props.value}
                                        error={errors.subject?.message}
                                        required={true}
                                        onChange={onSelectChange(props)}
                                    />
                                )}
                            />
                            :
                            <Controller
                                name='subjectInput'
                                control={control}
                                defaultValue=''
                                placeholder={'*' + t('ticket_new.subject')}
                                rules={{ required: requiredText }}
                                as={Input}
                                className={'w-full border-none h-14'}
                                data-test-id={'ticket-new-assignee'}
                                error={errors.subjectInput?.message}
                            />
                    }
                </div>
                <Controller
                    name='status'
                    control={control}
                    defaultValue=''
                    rules={{ required: requiredText }}
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'ticket-new-status'}
                            label={'ticket_new.status'}
                            options={statusOptions}
                            value={props.value}
                            error={errors.status?.message}
                            required={true}
                            onChange={onSelectChange(props)}
                        />
                    )}
                />
                <Controller
                    name='priority'
                    control={control}
                    defaultValue=''
                    rules={{ required: requiredText }}
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'ticket-new-priority'}
                            label={'ticket_new.priority'}
                            options={priorityOptions}
                            value={props.value}
                            error={errors.priority?.message}
                            required={true}
                            onChange={onSelectChange(props)}
                        />
                    )}
                />
                <Controller
                    name='dueDate'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <DateTimeInput
                            {...props}
                            type='date'
                            data-test-id={'ticket-new-due-date'}
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.due_date')}
                            value={props.value}
                            error={errors.dueDate?.message}
                        />
                    )}
                />
                <Controller
                    type='text'
                    name='dueTime'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <DateTimeInput
                            {...props}
                            type='time'
                            data-test-id={'ticket-new-due-time'}
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.due_time')}
                            value={props.value}
                            error={errors.dueTime?.message}
                        />
                    )}
                />
                <Controller
                    name='channel'
                    control={control}
                    defaultValue=''
                    rules={{ required: requiredText }}
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'ticket-new-channel'}
                            options={sourceOptions}
                            label={'ticket_new.channel'}
                            value={props.value}
                            error={errors.channel?.message}
                            required={true}
                            onChange={onSelectChange(props)}
                        />
                    )}
                />
                <Controller
                    name='department'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id='ticket-new-department'
                            label={'ticket_new.department'}
                            options={departmentOptions}
                            value={props.value}
                            onChange={onSelectChange(props)}
                        />
                    )}
                />
                <Controller
                    name='location'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'ticket-new-location'}
                            label={'ticket_new.location'}
                            options={locationOptions}
                            value={props.value}
                            onChange={onSelectChange(props)}
                        />
                    )}
                />
                <Controller
                    name='assignee'
                    control={control}
                    defaultValue=''
                    rules={{ required: requiredText }}
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'ticket-new-assignee'}
                            options={assigneeOptions}
                            label={'ticket_new.assignee'}
                            value={props.value}
                            error={errors.assignee?.message}
                            required={true}
                            onChange={onSelectChange(props)}
                        />
                    )}
                />
                {
                    isTicketTypeSelected &&
                    <Controller
                        name='patientId'
                        control={control}
                        defaultValue={queryPatientId}
                        placeholder={t('ticket_new.patient_id')}
                        as={Input}
                        className={'w-full border-none h-14'}
                        data-test-id={'ticket-new-patient-id'}
                    />
                }
                {
                    isTicketTypeSelected &&
                    <Controller
                        name='patientCaseNumber'
                        control={control}
                        defaultValue=''
                        placeholder={t('ticket_new.patient_case_number')}
                        as={Input}
                        className={'w-full border-none h-14'}
                        data-test-id={'ticket-new-patient-case-number'}
                    />
                }
            </div>
            <Controller
                name='tagsInput'
                control={control}
                defaultValue=''
                render={(props) => (
                    <TagInput
                        {...props}
                        tagOptions={tagOptions}
                        label={'ticket_new.tags'}
                        data-test-id='ticket-new-tag-input'
                        className={'w-full border-none h-14'}
                        setSelectedTags={setSelectedTags}
                    />
                )}
            />
            <Controller
                name='note'
                control={control}
                defaultValue=''
                render={() => (
                    <TextArea
                        className={'w-full pb-4 h-20'}
                        data-test-id={'ticket-new-add-note'}
                        placeholder={t('ticket_new.add_note')}
                        value={noteText}
                        rows={2}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                    />
                )}
            />
            <div className='flex flex-row space-x-4 justify-end bg-secondary-50'>
                <div className='flex items-center'>
                    <Button data-test-id='ticket-new-cancel-button' type={'button'}
                        buttonType='secondary'
                        label={'common.cancel'}
                        onClick={() => history.push(TicketsPath)}
                    />
                </div>
                <div>
                    <Button disabled={isCreating} data-test-id='ticket-new-create-button' type={'submit'}
                        label={'ticket_new.create'} />
                </div>
            </div>
        </form>
    </div>
}

export default withErrorLogging(TicketNew);
