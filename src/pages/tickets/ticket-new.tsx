import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {Controller, ControllerRenderProps, useForm} from 'react-hook-form';
import withErrorLogging from '../../shared/HOC/with-error-logging';

import Button from '../../shared/components/button/button';
import Select from '../../shared/components/select/select';
import {Option} from '@components/option/option';
import TagInput from '../../shared/components/tag-input/tag-input';
import {Contact} from '@shared/models/contact.model';
import {Department} from '@shared/models/department';
import {Ticket} from './models/ticket';
import {TicketNote} from './models/ticket-note';
import {
    selectEnumValues,
    selectIsTicketEnumValuesLoading,
    selectIsTicketLookupValuesLoading,
    selectLookupValues
} from './store/tickets.selectors';
import {selectContacts} from '@shared/store/contacts/contacts.selectors';
import {
    selectDepartmentList,
    selectIsDepartmentListLoading,
    selectUserOptions
} from '@shared/store/lookups/lookups.selectors';

import {createTicket, getEnumByType, getLookupValues} from './services/tickets.service';
import {getContactById, searchContactsByName} from '@shared/services/contacts.service';
import {getDepartments, getUserList} from '@shared/services/lookups.service';
import {useHistory} from 'react-router-dom';
import utils from '../../shared/utils/utils';
import {TicketsPath} from '../../app/paths';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {getPatientActionNotes, getPatientCaseDocument} from '@pages/patients/services/patient-document.service';
import {Patient} from '@pages/patients/models/patient';
import {GetContactById, QueryContacts} from '@constants/react-query-constants';
import {useMutation, useQuery} from 'react-query';
import useDebounce from '@shared/hooks/useDebounce';
import ControlledInput from '@components/controllers/ControllerInput';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import ControlledTimeInput from '@components/controllers/ControlledTimeInput';
import {DEBOUNCE_SEARCH_DELAY_MS} from '@shared/constants/form-constants';
import {ContactType} from '@pages/contacts/models/ContactType';
import {AxiosError} from 'axios';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import Spinner from '@components/spinner/Spinner';

const TicketNew = () => {
    dayjs.extend(utc);

    const {handleSubmit, control, errors, setError, clearErrors, formState, setValue} = useForm({mode: 'all'});
    const {isValid, errors: stateError} = formState;
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const requiredText = t('common.required');
    const TicketTypeDefault = '1';

    const queryParams = new URLSearchParams(window.location.search);
    const queryPatientId = queryParams.get('patientId');
    const queryContactId = queryParams.get('contactId');

    const users = useSelector(selectUserOptions);
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

    const isDepartmentListLoading = useSelector(selectIsDepartmentListLoading);
    const isLookupValuesLoading = useSelector(selectIsTicketLookupValuesLoading);
    const isTicketEnumValuesLoading = useSelector(selectIsTicketEnumValuesLoading);

    const [isTicketTypeSelected, setIsTicketTypeSelected] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [noteText, setNoteText] = useState('');

    const [isPatientIdLoading, setPatientIdLoading] = useState(false);
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const patientIdRef = useRef('');

    const [patientCaseId, setPatientCaseId] = useState('');
    const [isPatientCaseIdLoading, setPatientCaseIdLoading] = useState(false);
    const patientCaseIdRef = useRef('');

    const [contactSearchTerm, setContactSearchTerm] = useState('');
    const [contactOptions, setContactOptions] = useState<Option[]>([]);
    const [contactName, setContactName] = useState<string>();
    const [debounceContactSearchTerm] = useDebounce(contactSearchTerm, DEBOUNCE_SEARCH_DELAY_MS);

    const {refetch: refetchContacts, isFetching, isLoading} = useQuery<Contact[], Error>([QueryContacts, debounceContactSearchTerm],
        () => {
            return searchContactsByName(debounceContactSearchTerm)
        }, {
        enabled: false,
        onSuccess: (data) => {
            const contactOptionResult = data.map(item => ({
                label: item.type === ContactType.Company ? item.companyName : `${item.firstName} ${item.lastName}`,
                value: item.id
            }) as Option);

            setContactOptions(contactOptionResult)
        },
        onError: () => {
            setError('contactId', {type: 'notFound', message: t('ticket_new.error_getting_contacts')});
        }
    });

    const createTicketMutation = useMutation(createTicket, {
        onSuccess: (data) => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: t('tickets.ticket_created', {ticketNumber: data.ticketNumber})
            }));
            history.push(TicketsPath);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('tickets.ticket_creation_failed')
            }));
        }
    });
    const {data: contact, refetch: refetchContact} = useQuery<Contact, AxiosError>([GetContactById, queryContactId], () =>
        getContactById(queryContactId!),
        {
            enabled: false,
            onSuccess: ((data) => {
                if (data) {
                    const contactOption = getContactOption(data);
                    setContactOptions([contactOption]);
                    setValue('contactId', queryContactId, {shouldValidate: true});
                }
            }),
            onError: () => {
                setError('contactId', {type: 'notFound', message: t('ticket_new.error_getting_contacts')});
            }
        }
    );

    const getContactOption = (data: Contact) => {
        return data ? {
            value: data.id,
            label: data.type === ContactType.Company ? data.companyName : `${data.firstName} ${data.lastName}`
        } : {} as Option;
    }

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
            subject: subjectValue,
            status: formData.status,
            priority: formData.priority,
            dueDate: dueDateTime ? dueDateTime.utc().local().toDate() : undefined,
            channel: formData.channel,
            department: formData.department,
            location: formData.location,
            assignee: formData.assignee,
            assignedOn: formData.assignee !== '' ? new Date() : undefined,
            patientId: patientId ? Number(patientId) : undefined,
            patientCaseNumber: patientCaseId ? Number(patientCaseId) : undefined,
            tags: tags,
            notes: notes,
            createdForName: getCreatedForName()
        };

        createTicketMutation.mutate(ticketData);
    }

    const getCreatedForName = () => {
        if (!!patientName) {
            return patientName;
        }
        return contactName;
    }

    const validatePatientId = async () => {
        if (!patientId || patientIdRef.current === patientId) {
            return;
        }
        setPatientIdLoading(true);
        try {
            const patient: Patient = await getPatientByIdWithQuery(Number(patientId));
            if (!patient) {
                throw new Error();
            }
            setPatientName(`${patient.firstName} ${patient.lastName}`);
            patientIdRef.current = patientId;
        } catch {
            setError('patientId', {type: 'notFound', message: t('ticket_new.patient_id_not_found')});
        } finally {
            setPatientIdLoading(false);
        }
    }

    const validatePatientCaseId = async () => {
        if (!patientCaseId || patientCaseIdRef.current === patientCaseId) {
            return;
        }

        setPatientCaseIdLoading(true);
        try {
            if (!!patientId) {
                const patientCase = await getPatientCaseDocument(Number(patientId), Number(patientCaseId));
                if (!patientCase) {
                    throw new Error();
                }
            } else {
                const patientActionNotes = await getPatientActionNotes(Number(patientCaseId));
                if (!patientActionNotes) {
                    throw new Error();
                }
            }
            patientCaseIdRef.current = patientCaseId;
        } catch {
            setError('patientCaseNumber', {type: 'notFound', message: t('ticket_new.patient_case_id_not_found')});
        } finally {
            setPatientCaseIdLoading(false);
        }
    }

    const onPatientCaseIdChanged = (value: string) => {
        patientCaseIdRef.current = '';
        setPatientCaseId(value);
        clearErrors('patientCaseNumber');
    }

    const onPatientIdChanged = (value: string) => {
        patientIdRef.current = '';
        setPatientId(value);
        setPatientName('');
        clearErrors('patientId');
    }
    useEffect(() => {
        dispatch(getUserList());
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

    useEffect(() => {
        if (debounceContactSearchTerm && debounceContactSearchTerm.length > 2) {
            refetchContacts();
        } else {
            setContactOptions([]);
        }
        if (queryContactId) {
            refetchContact();
        }
    }, [contact, debounceContactSearchTerm, queryContactId, refetchContact, refetchContacts, setValue]);

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

    const locationOptions: Option[] = departments ? departments.map((item: Department) => {
        return {
            value: item.id.toString(),
            label: item.name
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

    const setSelectedTags = (data: string[]) => {
        setTags(data);
    };

    if (isDepartmentListLoading || isLookupValuesLoading || isTicketEnumValuesLoading) {
        return <Spinner fullScreen />;
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

    function onSelectChange<TFieldValues>(props: ControllerRenderProps<TFieldValues>) {
        return (option?: Option) => {
            if (option) {
                props.onChange(option.value);
            }
        };
    }

    const onContactSelectChanged = (controllerProps: ControllerRenderProps<Record<string, any>>, option?: Option) => {
        if (!option) {
            return;
        }
        controllerProps.onChange(option.value);
        setContactName(option.label);
    }

    return <div className="flex flex-col w-full mx-6 my-5 overflow-y-auto">
        <h5>{t('ticket_new.title')}</h5>
        <div className={'w-96 pt-10 mx-auto flex flex-col'}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                <div>
                    <Controller
                        name='ticketType'
                        control={control}
                        defaultValue=''
                        rules={{required: requiredText}}
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-new-ticket-type'}
                                label={'ticket_new.ticket_type'}
                                options={ticketTypeOptions}
                                value={props.value}
                                onSelect={(option?: Option) => {
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
                                    onSelect={onSelectChange(props)}
                                />
                            )}
                        />
                    }

                    <Controller
                        name='contactId'
                        control={control}
                        defaultValue=''
                        rules={{required: requiredText}}
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id='ticket_new.contact'
                                label={'ticket_new.contact'}
                                options={contactOptions}
                                value={props.value}
                                error={errors.contactId?.message}
                                isLoading={isLoading || isFetching}
                                required={true}
                                suggestionsPlaceholder={t('ticket_new.suggestion_placeholder')}
                                onTextChange={(value: string) => setContactSearchTerm(value || '')}
                                onSelect={(option) => onContactSelectChanged(props, option)}
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
                                    rules={{required: requiredText}}
                                    render={(props) => (
                                        <Select
                                            {...props}
                                            data-test-id={'ticket-new-subject-select'}
                                            label={'ticket_new.subject'}
                                            options={subjectOptions}
                                            value={props.value}
                                            error={errors.subject?.message}
                                            required={true}
                                            onSelect={onSelectChange(props)}
                                        />
                                    )}
                                />
                                :
                                <ControlledInput
                                    name='subjectInput'
                                    control={control}
                                    defaultValue=''
                                    placeholder={t('ticket_new.subject')}
                                    required={true}
                                    dataTestId={'ticket-new-assignee'}
                                />
                        }
                    </div>
                    <Controller
                        name='status'
                        control={control}
                        defaultValue=''
                        rules={{required: requiredText}}
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-new-status'}
                                label={'ticket_new.status'}
                                options={statusOptions}
                                value={props.value}
                                error={errors.status?.message}
                                required={true}
                                onSelect={onSelectChange(props)}
                            />
                        )}
                    />
                    <Controller
                        name='priority'
                        control={control}
                        defaultValue=''
                        rules={{required: requiredText}}
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-new-priority'}
                                label={'ticket_new.priority'}
                                options={priorityOptions}
                                value={props.value}
                                error={errors.priority?.message}
                                required={true}
                                onSelect={onSelectChange(props)}
                            />
                        )}
                    />
                    <div className="flex">
                        <ControlledDateInput
                            name='dueDate'
                            label='ticket_new.due_date'
                            className='mr-8'
                            control={control}
                            type='date'
                            dataTestId={'ticket-new-due-date'}
                            onValidationError={() => setError('dueDate', {message: 'Validation error'})}
                        />
                        <ControlledTimeInput
                            name='dueTime'
                            defaultValue=''
                            control={control}
                            dataTestId={'ticket-new-due-time'}
                            label='ticket_new.due_time'
                            autoComplete={false}
                        />
                    </div>
                    <Controller
                        name='channel'
                        control={control}
                        defaultValue=''
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-new-channel'}
                                options={sourceOptions}
                                label={'ticket_new.channel'}
                                required={true}
                                value={props.value}
                                error={errors.channel?.message}
                                onSelect={onSelectChange(props)}
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
                                onSelect={onSelectChange(props)}
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
                                onSelect={onSelectChange(props)}
                            />
                        )}
                    />
                    <Controller
                        name='assignee'
                        control={control}
                        defaultValue=''
                        rules={{required: requiredText}}
                        render={(props) => (
                            <Select
                                {...props}
                                data-test-id={'ticket-new-assignee'}
                                options={users}
                                label={'ticket_new.assignee'}
                                value={props.value}
                                error={errors.assignee?.message}
                                required={true}
                                onSelect={onSelectChange(props)}
                            />
                        )}
                    />
                    {
                        isTicketTypeSelected &&
                        <ControlledInput
                            name='patientId'
                            control={control}
                            defaultValue={queryPatientId}
                            type='number'
                            placeholder={t('ticket_new.patient_id')}
                            isLoading={isPatientIdLoading}
                            disabled={!!queryPatientId}
                            assistiveText={patientName}
                            dataTestId={'ticket-new-patient-id'}
                            onChange={({target}: ChangeEvent<HTMLInputElement>) => onPatientIdChanged(target.value)}
                            onBlur={validatePatientId}
                        />
                    }
                    {
                        isTicketTypeSelected &&
                        <ControlledInput
                            name='patientCaseNumber'
                            control={control}
                            type='number'
                            defaultValue=''
                            placeholder={t('ticket_new.patient_case_number')}
                            isLoading={isPatientCaseIdLoading}
                            dataTestId={'ticket-new-patient-case-number'}
                            onChange={({target}: ChangeEvent<HTMLInputElement>) => onPatientCaseIdChanged(target.value)}
                            onBlur={validatePatientCaseId}
                        />
                    }
                </div>
                <ControlledInput
                    name='note'
                    control={control}
                    placeholder={t('ticket_new.add_note')}
                    dataTestId={'ticket-new-add-note'}
                    defaultValue=''
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNoteText(e.target.value)}
                />
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
                <div className='flex flex-row justify-start space-x-4 mt-7'>
                    <div className='flex items-center'>
                        <Button data-test-id='ticket-new-cancel-button' type={'button'}
                            buttonType='secondary-big'
                            label={'common.cancel'}
                            onClick={() => history.push(TicketsPath)}
                        />
                    </div>
                    <div>
                        <Button isLoading={createTicketMutation.isLoading} buttonType='big' disabled={!isValid || !stateError}
                            data-test-id='ticket-new-create-button' type={'submit'}
                            label={'ticket_new.create'} />
                    </div>
                </div>
            </form>
        </div>
    </div>
}

export default withErrorLogging(TicketNew);
