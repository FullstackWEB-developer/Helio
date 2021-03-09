import React, {ChangeEvent, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import withErrorLogging from '../../shared/HOC/with-error-logging';

import ThreeDots from '../../shared/components/skeleton-loader/skeleton-loader';
import Button from '../../shared/components/button/button';
import Input from '../../shared/components/input/input';
import Select, { Option } from '../../shared/components/select/select';
import TagInput from '../../shared/components/tag-input/tag-input';
import { Contact } from '../../shared/models/contact.model';
import { Department } from '../../shared/models/department';
import { Ticket } from './models/ticket';
import { TicketNote } from './models/ticket-note';
import {
    selectIsTicketEnumValuesLoading,
    selectEnumValues,
    selectTicketOptionsError,
    selectIsTicketLookupValuesLoading,
    selectLookupValues
} from './store/tickets.selectors';
import { selectContacts, selectIsContactOptionsLoading } from '../../shared/store/contacts/contacts.selectors';
import {
    selectDepartmentList,
    selectIsDepartmentListLoading,
    selectUserList
} from '../../shared/store/lookups/lookups.selectors';

import {createTicket, getEnumByType, getLookupValues} from './services/tickets.service';
import { getContacts } from '../../shared/services/contacts.service';
import {getDepartments, getUserList} from '../../shared/services/lookups.service';
import TextArea from '../../shared/components/textarea/textarea';
import { User } from '../../shared/models/user';
import { useHistory } from 'react-router-dom';

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

    const onSubmit = async (formData: any) => {
        if (!formData) {
            return;
        }

        const subjectOption = subjectOptions.find(o => o.value === formData.subject);
        const subjectValue = subjectOptions && subjectOptions.length > 1 && subjectOption ? subjectOption.label : formData.subjectInput;

        let dueDateTime;
        if (formData.dueDate && formData.dueTime) {
            const hours = parseInt(formData.dueTime.split(':')[0]);
            const minutes = parseInt(formData.dueTime.split(':')[1]);
            dueDateTime = dayjs.utc(formData.dueDate).hour(hours).minute(minutes);
        } else if (formData.dueDate) {
            dueDateTime = dayjs.utc(formData.dueDate);
        } else {
            const hours = parseInt(formData.dueTime.split(':')[0]);
            const minutes = parseInt(formData.dueTime.split(':')[1]);
            dueDateTime = dayjs.utc().hour(hours).minute(minutes);
        }

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
            patientChartNumber: formData.patientChartNumber,
            patientCaseNumber: formData.patientCaseNumber,
            tags: tags,
            notes: notes
        };

        await createTicket(ticketData);
        history.push('/my_tickets');
    }

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

    const addFirstOption = (data: any[], firstItemLabel: string, isAsterisk?: boolean) => {
        data.unshift({
            value: 0,
            label: firstItemLabel,
            hidden: true,
            isAsterisk: isAsterisk
        });
    }

    let sourceOptions: Option[] = getOptions(ticketChannels);
    let priorityOptions: Option[] = getOptions(ticketPriorities);
    let statusOptions: Option[] = getOptions(ticketStatuses);
    let ticketTypeOptions: Option[] = getOptions(ticketTypes);

    addFirstOption(sourceOptions, 'Source', true);
    addFirstOption(priorityOptions, 'Priority', true);
    addFirstOption(statusOptions, 'Status', true);
    addFirstOption(ticketTypeOptions, 'Ticket Type');

    const assigneeOptions: Option[] = users ? users.map((item: User) => {
        return {
            value: item.id,
            label: item.id
        };
    }) : [];
    addFirstOption(assigneeOptions, t('ticket_new.assignee'), true);

    const contactOptions: Option[] = contacts ? contacts.map((item: Contact) => {
        return {
            value: item.id,
            label: item.name
        };
    }) : [];
    addFirstOption(contactOptions, t('ticket_new.contact'), true);

    const locationOptions: Option[] = departments ? departments.map((item: Department) => {
        return {
            value: item.id.toString(),
            label: item.address
        };
    }) : [];
    addFirstOption(locationOptions, t('ticket_new.location'));

    const getTicketLookupValuesOptions = (data: any[] | undefined) => {
        if (data) {
            return convertToOptions(data)
        }
        return [];
    }

    const [selectedTicketTypeOption, setSelectedTicketTypeOption] =
        useState(ticketTypeOptions && ticketTypeOptions.length > 0 ? ticketTypeOptions[0] : null);

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

    let subjectOptions: Option[] = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesSubject);
    addFirstOption(subjectOptions, t('ticket_new.subject'), true);

    let reasonOptions: Option[] = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesReason);
    addFirstOption(reasonOptions, t('ticket_new.reason'));

    const departmentOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesDepartment);
    addFirstOption(departmentOptions, t('ticket_new.department'));

    const tagOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesTags);

    const handleChangeTicketType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation();
        const selectedTicketType =
            ticketTypeOptions ? ticketTypeOptions.find((o: Option) => o.value.toString() === event.target.value) : {} as any;

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
        return <div data-test-id='ticket-new-error'>{t('ticket_new.error')}</div>
    }

    return <div className={'w-96 py-4 mx-auto flex flex-col'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='divide-y'>
                <Controller
                    name='ticketType'
                    control={control}
                    defaultValue=''
                    rules={{ required: requiredText }}
                    render={(props) => (
                        <Select
                            {...props}
                            data-test-id={'ticket-new-ticket-type'}
                            className={'w-full border-none h-14'}
                            label={t('ticket_new.ticket_type')}
                            options={ticketTypeOptions}
                            value={props.value}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                props.onChange(e)
                                handleChangeTicketType(e);
                            }}
                            error={errors.ticketType?.message}
                        />
                    )}
                />
                { (isTicketTypeSelected && reasonOptions.length > 1) &&
                    <Controller
                        name='reason'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-new-reason'}
                                className={'w-full border-none h-14'}
                                placeholder={t('ticket_new.reason')}
                                options={reasonOptions}
                                value={props.value}
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
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.contact')}
                            options={contactOptions}
                            value={props.value}
                            error={errors.contactId?.message}
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
                                        className={'w-full border-none h-14'}
                                        options={subjectOptions}
                                        value={props.value}
                                        error={errors.subject?.message}
                                    />
                                )}
                            />
                            :
                            <Controller
                                name='subjectInput'
                                control={control}
                                defaultValue=''
                                placeholder={'*' + t('ticket_new.subject')}
                                rules={{required: requiredText}}
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
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.status')}
                            options={statusOptions}
                            value={props.value}
                            error={errors.status?.message}
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
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.priority')}
                            options={priorityOptions}
                            value={props.value}
                            error={errors.priority?.message}
                        />
                    )}
                />
                <Controller
                    name='dueDate'
                    control={control}
                    defaultValue=''
                    render={(props) => (
                        <Input
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
                        <Input
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
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.channel')}
                            options={sourceOptions}
                            value={props.value}
                            error={errors.channel?.message}
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
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.department')}
                            options={departmentOptions}
                            value={props.value}
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
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.location')}
                            options={locationOptions}
                            value={props.value}
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
                            className={'w-full border-none h-14'}
                            placeholder={t('ticket_new.assignee')}
                            options={assigneeOptions}
                            value={props.value}
                            error={errors.assignee?.message}
                        />
                    )}
                />
                {
                    isTicketTypeSelected &&
                    <Controller
                        name='patientChartNumber'
                        control={control}
                        defaultValue=''
                        placeholder={t('ticket_new.patient_chart_number')}
                        as={Input}
                        className={'w-full border-none h-14'}
                        data-test-id={'ticket-new-patient-chart-number'}
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
                        label={t('ticket_new.tags')}
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
                        label={t('common.cancel')}
                        onClick={() => history.push('/my_tickets')}
                    />
                </div>
                <div>
                    <Button data-test-id='ticket-new-create-button' type={'submit'}
                            label={t('ticket_new.create')} />
                </div>
            </div>
        </form>
    </div>
}

export default withErrorLogging(TicketNew);
