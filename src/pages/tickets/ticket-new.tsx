import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import withErrorLogging from '../../shared/HOC/with-error-logging';

import ThreeDots from '../../shared/components/skeleton-loader/skeleton-loader';
import Select, { Option } from '../../shared/components/select/select';
import Input from '../../shared/components/input/input';
import Button from '../../shared/components/button/button';
import { Contact } from '../../shared/models/contact.model';
import { Department } from '../../shared/models/department';
import { Ticket } from './models/ticket';
import { TicketNote } from './models/ticket-note';
import {
    selectIsTicketEnumValuesLoading,
    selectEnumValues,
    selectTicketOptionsError,
    selectIsTicketLookupValuesLoading, selectLookupValues
} from './store/tickets.selectors';
import { selectContacts, selectIsContactOptionsLoading } from '../../shared/store/contacts/contacts.selectors';
import { selectDepartmentList, selectIsDepartmentListLoading } from '../../shared/store/lookups/lookups.selectors';

import { createTicket, getEnumByType, getLookupValues } from './services/tickets.service';
import { getContacts } from '../../shared/services/contacts.service';
import { getDepartments } from '../../shared/services/lookups.service';
import dayjs from 'dayjs';

const TicketNew = () => {
    const { handleSubmit, control, errors, setValue } = useForm();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const requiredText = t('common.required');
    const TicketTypeDefault = '1';
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


    const onSubmit = async (formData: any) => {
        if (!formData) {
            return;
        }

        const notes = [] as TicketNote[];
        if (formData.note) {
            notes.push({
                noteText: formData.note
            });
        }

        const ticketData: Ticket = {
            type: selectedTicketTypeOption ? selectedTicketTypeOption.value : TicketTypeDefault,
            reason: formData.reason,
            contactId: formData.contactId,
            connectContactId: '00000000-0000-0000-0000-000000000000',
            subject: formData.subject,
            status: formData.status,
            priority: formData.priority,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
            channel: formData.channel,
            department: formData.department,
            location: formData.location,
            assignee: formData.assignee,
            patientChartNumber: formData.patientChartNumber,
            patientCaseNumber: formData.patientCaseNumber,
            tags: [],
            notes: notes
        };

        dispatch(createTicket(ticketData));
    }

    useEffect(() => {
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

    const channelOptions: Option[] = getOptions(ticketChannels);
    const priorityOptions: Option[] = getOptions(ticketPriorities);
    const statusOptions: Option[] = getOptions(ticketStatuses);
    const ticketTypeOptions: Option[] = getOptions(ticketTypes);

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

    const [selectedTicketTypeOption, setSelectedTicketTypeOption] =
        useState(ticketTypeOptions && ticketTypeOptions.length > 0 ? ticketTypeOptions[0] : null);

    let subjectOptions: Option[] = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesSubject);
    let reasonOptions: Option[] = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesReason);

    const departmentOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesDepartment);
    const tagsOptions: Option[] = getTicketLookupValuesOptions(ticketLookupValuesTags);

    const handleChangeTicketType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation();
        const selectedTicketType =
            ticketTypeOptions ? ticketTypeOptions.find((o: Option) => o.value.toString() === event.target.value) : {} as any;

        setSelectedTicketTypeOption(selectedTicketType);
        subjectOptions = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesSubject);
        reasonOptions = getTicketLookupValuesOptionsByTicketType(ticketLookupValuesReason);

        if (reasonOptions && reasonOptions.length > 0) {
            setTimeout(() => {
                setValue('reason', reasonOptions[0].value);
            }, 1000);
        }
    }

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

    const manageTicketTypeOptions = () => {
        if (selectedTicketTypeOption === null && ticketTypeOptions && ticketTypeOptions.length > 0) {
            setSelectedTicketTypeOption(ticketTypeOptions[0]);
        }
    }

    manageTicketTypeOptions();


    return <div className={'w-96 py-4 mx-auto flex flex-col'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='ticketType'
                control={control}
                defaultValue={ticketTypeOptions ? ticketTypeOptions[0] : ''}
                rules={{ required: requiredText }}
                render={() => (
                    <Select
                        data-test-id={'ticket-new-ticket-type'}
                        className={'w-full'}
                        label={t('ticket_new.ticket_type')}
                        options={ticketTypeOptions}
                        value={selectedTicketTypeOption ? selectedTicketTypeOption.value : ''}
                        onChange={handleChangeTicketType}
                    />
                )}
            />
            <Controller
                name='reason'
                control={control}
                defaultValue={reasonOptions ? reasonOptions[0] : ''}
                as={Select}
                options={reasonOptions}
                className={'w-full'}
                data-test-id={'ticket-new-reason'}
                label={t('ticket_new.reason')}
            />
            <Controller
                name='contactId'
                control={control}
                defaultValue={contactOptions ? contactOptions[0] : ''}
                rules={{ required: requiredText }}
                as={Select}
                options={contactOptions}
                className={'w-full'}
                data-test-id='ticket_new.contact'
                label={t('ticket_new.contact')}
            />
            <Controller
                name='subject'
                control={control}
                defaultValue={subjectOptions ? subjectOptions[0] : ''}
                as={Select}
                options={subjectOptions}
                className={'w-full'}
                data-test-id={'ticket-new-subject'}
                label={t('ticket_new.subject')}
            />
            <Controller
                name='status'
                control={control}
                defaultValue={statusOptions ? statusOptions[0] : ''}
                rules={{ required: requiredText }}
                as={Select}
                options={statusOptions}
                className={'w-full'}
                data-test-id={'ticket-new-status'}
                label={t('ticket_new.status')}
            />
            <Controller
                name='priority'
                control={control}
                defaultValue={priorityOptions ? priorityOptions[0] : ''}
                rules={{ required: requiredText }}
                as={Select}
                options={priorityOptions}
                className={'w-full'}
                data-test-id={'ticket-new-priority'}
                label={t('ticket_new.priority')}
            />
            <Controller
                type='date'
                name='dueDate'
                control={control}
                rules={{ required: requiredText }}
                as={Input}
                className={'w-full'}
                defaultValue={dayjs().format('yyyy-MM-dd')}
                error={errors.dueDate?.message}
                data-test-id={'ticket-new-due-date'}
                label={t('ticket_new.due_date')}
            />
            <Controller
                name='dueTime'
                control={control}
                as={Input}
                className={'w-full'}
                defaultValue={'08:00'}
                data-test-id={'ticket-new-due-time'}
                label={t('ticket_new.due_time')}
            />
            <Controller
                name='channel'
                control={control}
                defaultValue={channelOptions ? channelOptions[0] : ''}
                as={Select}
                options={channelOptions}
                className={'w-full'}
                data-test-id={'ticket-new-channel'}
                label={t('ticket_new.channel')}
            />
            <Controller
                name='department'
                control={control}
                defaultValue={departmentOptions ? departmentOptions[0] : ''}
                as={Select}
                options={departmentOptions}
                className={'w-full'}
                data-test-id='ticket-new-department'
                label={t('ticket_new.department')}
            />
            <Controller
                name='location'
                control={control}
                defaultValue={locationOptions ? locationOptions[0] : ''}
                rules={{ required: requiredText }}
                as={Select}
                options={locationOptions}
                className={'w-full'}
                data-test-id={'ticket-new-location'}
                label={t('ticket_new.location')}
            />
            <Controller
                name='assignee'
                control={control}
                defaultValue={''}
                rules={{ required: requiredText }}
                as={Input}
                className={'w-full'}
                data-test-id={'ticket-new-assignee'}
                label={t('ticket_new.assignee')}
            />
            <Controller
                name='patientChartNumber'
                control={control}
                defaultValue={''}
                as={Input}
                className={'w-full'}
                data-test-id={'ticket-new-patient-chart-number'}
                label={t('ticket_new.patient_chart_number')}
            />
            <Controller
                name='patientCaseNumber'
                control={control}
                defaultValue={''}
                as={Input}
                className={'w-full'}
                data-test-id={'ticket-new-patient-case-number'}
                label={t('ticket_new.patient_case_number')}
            />
            <Controller
                name='tags'
                control={control}
                defaultValue={''}
                as={Select}
                options={tagsOptions}
                className={'w-full'}
                data-test-id='ticket-new-tags'
                label={t('ticket_new.tags')}
            />
            <Controller
                name='note'
                control={control}
                defaultValue={''}
                as={Input}
                data-test-id={'ticket-new-add-note'}
                label={t('ticket_new.add_note')}
            />
            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                <Button data-test-id='ticket-new-create-button' type={'submit'}
                    className='btn-primary'
                    label={t('ticket_new.create')} />
                <Button data-test-id='ticket-new-cancel-button' type={'button'}
                    className='btn-secondary'
                    label={t('common.cancel')} />
            </div>
        </form>
    </div>
}

export default withErrorLogging(TicketNew);
