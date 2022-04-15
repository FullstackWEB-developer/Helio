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
import {Ticket} from './models/ticket';
import {TicketNote} from './models/ticket-note';
import {
    selectEnumValuesAsOptions,
    selectIsTicketEnumValuesLoading,
    selectIsTicketLookupValuesLoading,
    selectLookupValues,
    selectLookupValuesAsOptions
} from './store/tickets.selectors';
import {selectContacts} from '@shared/store/contacts/contacts.selectors';
import {
    selectIsDepartmentListLoading,
    selectLocationsAsOptions,
    selectUserOptions
} from '@shared/store/lookups/lookups.selectors';
import {createTicket, getEnumByType} from './services/tickets.service';
import { getLookupValues } from '@shared/services/lookups.service';
import {getContactById, searchContactsByName} from '@shared/services/contacts.service';
import {getLocations, getUserList} from '@shared/services/lookups.service';
import {Prompt, useHistory} from 'react-router-dom';
import utils from '../../shared/utils/utils';
import {TicketsPath} from '@app/paths';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {getPatientActionNotes, getPatientCaseDocument} from '@pages/patients/services/patient-document.service';
import {Patient} from '@pages/patients/models/patient';
import {GetContactById, QueryContacts} from '@constants/react-query-constants';
import {useMutation, useQuery} from 'react-query';
import useDebounce from '@shared/hooks/useDebounce';
import ControlledInput from '@components/controllers/ControlledInput';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import ControlledTimeInput from '@components/controllers/ControlledTimeInput';
import {DEBOUNCE_SEARCH_DELAY_MS} from '@shared/constants/form-constants';
import {ContactType} from '@pages/contacts/models/ContactType';
import {AxiosError} from 'axios';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import ControlledSelect from '@components/controllers/controlled-select';
import {TicketType} from '@pages/tickets/models/ticket-type.enum';
import './ticket-new.scss';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';
import {ChannelTypes} from '@shared/models';
import Confirmation from '@components/confirmation/confirmation';

const TicketNew = () => {
    dayjs.extend(utc);

    const {handleSubmit, control, errors, setError, clearErrors, formState, setValue, watch} = useForm({mode: 'all'});
    const {isValid, errors: stateError, isDirty, isSubmitted} = formState;
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(window.location.search);
    const queryPatientId = queryParams.get('patientId') || '';
    const queryContactId = queryParams.get('contactId');

    const users = useSelector(selectUserOptions);
    const locationOptions = useSelector(selectLocationsAsOptions);
    const contacts = useSelector(selectContacts);
    const sourceOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketChannel')));
    const priorityOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketPriority')));
    const statusOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketStatus')));
    const ticketTypeOptions = useSelector((state => selectEnumValuesAsOptions(state, 'TicketType')));
    const [closingPromptOpen, setClosingPromptOpen] = useState(false);
    const departmentOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'Department'));
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, 'TicketReason'));
    const ticketLookupValuesSubject = useSelector((state) => selectLookupValues(state, 'TicketSubject'));
    const tagOptions = useSelector((state) => selectLookupValuesAsOptions(state, 'TicketTags'));

    const isDepartmentListLoading = useSelector(selectIsDepartmentListLoading);
    const isLookupValuesLoading = useSelector(selectIsTicketLookupValuesLoading);
    const isTicketEnumValuesLoading = useSelector(selectIsTicketEnumValuesLoading);
    const [tags, setTags] = useState<string[]>([]);
    const [noteText, setNoteText] = useState('');
    const [isPatientIdLoading, setPatientIdLoading] = useState(false);
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const patientIdRef = useRef('');
    const [defaultContact, setDefaultContact] = useState<string>('');
    const [patientCaseId, setPatientCaseId] = useState('');
    const [isPatientCaseIdLoading, setPatientCaseIdLoading] = useState(false);
    const patientCaseIdRef = useRef('');

    const [contactSearchTerm, setContactSearchTerm] = useState('');
    const [contactOptions, setContactOptions] = useState<Option[]>([]);
    const [contactName, setContactName] = useState<string>();
    const [debounceContactSearchTerm] = useDebounce(contactSearchTerm, DEBOUNCE_SEARCH_DELAY_MS);

    const {
        refetch: refetchContacts,
        isFetching,
        isLoading
    } = useQuery<Contact[], Error>([QueryContacts, debounceContactSearchTerm],
        () => {
            return searchContactsByName(debounceContactSearchTerm)
        }, {
        enabled: false,
        onSuccess: (data) => {
            const contactOptionResult = data.map(item => ({
                label: item.type === ContactType.Company ? item.companyName : `${item.firstName} ${item.lastName}`,
                value: item.id
            }) as Option);

            setContactOptions(contactOptionResult);
            if (contactOptionResult && contactOptionResult[0]) {
                setValue('contactId', contactOptionResult[0]);
            }
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
            history.push(`${TicketsPath}/${data.ticketNumber}`);
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: t('tickets.ticket_creation_failed')
            }));
        }
    });
    const {
        data: contact,
        refetch: refetchContact
    } = useQuery<Contact, AxiosError>([GetContactById, queryContactId], () =>
        getContactById(queryContactId!),
        {
            enabled: false,
            onSuccess: ((data) => {
                if (data) {
                    const contactOption = getContactOption(data);
                    setContactOptions([contactOption]);
                    setValue('contactId', queryContactId, {shouldDirty: true});
                    setDefaultContact(contactOption.value);
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

        const type = Number(formData.type);
        let patient = patientId;
        if (type === TicketType.BusinessOffice ||
            type === TicketType.Facility ||
            type === TicketType.Lab ||
            type === TicketType.Pharmacy) {
            patient = '';
        }

        let contactId = formData.contactId;
        if (type === TicketType.EstablishedPatient ||
            type === TicketType.NewPatient) {
            contactId = '';
        }

        const ticketData: Ticket = {
            ...formData,
            subject: subjectValue,
            contactId,
            dueDate: dueDateTime ? dueDateTime.utc().local().toDate() : undefined,
            assignedOn: formData.assignee !== '' ? new Date() : undefined,
            patientId: patient ? Number(patient) : undefined,
            assigneeFullName: formData.assignee !== '' ? users.find(a => a.value === formData.assignee)?.label : undefined,
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

    useEffect(() => {
        if (!patientId || patientIdRef.current === patientId) {
            return;
        }

        async function getPatientById() {
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

        getPatientById().then();
    }, [patientId]);

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
        if (!value) {
            setPatientName('');
        }
        clearErrors('patientId');
    }

    useEffect(() => {
        if (!!queryPatientId) {
            onPatientIdChanged(queryPatientId);
        }
    }, [queryPatientId]);

    const handlePageClose = () => {
        if (isDirty) {
            setClosingPromptOpen(true);
        } else {
            history.push(TicketsPath);
        }
    }

    const onCloseConfirm = () => {
        setClosingPromptOpen(false);
        history.push(TicketsPath);
    }

    useEffect(() => {
        dispatch(getUserList());
        dispatch(getLocations());
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
            refetchContacts().then();
        } else {
            setContactOptions([]);
        }
        if (queryContactId) {
            refetchContact().then();
        }
    }, [contact, debounceContactSearchTerm, queryContactId, refetchContact, refetchContacts, setValue]);

    const getTicketLookupValuesOptionsByTicketType = (data: any[] | undefined) => {
        if (data) {
            const ticketType = watch('type');
            if (!ticketType) {
                return [];
            }
            const filtered = data.filter(v => v.parentValue === ticketType.toString());
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

    const setSelectedTags = (data: string[]) => {
        setTags(data);
    };

    if (isDepartmentListLoading || isLookupValuesLoading || isTicketEnumValuesLoading) {
        return <Spinner fullScreen />;
    }

    if (contacts === undefined
        || locationOptions === undefined
        || sourceOptions === undefined
        || priorityOptions === undefined
        || statusOptions === undefined
        || ticketTypeOptions === undefined
        || departmentOptions === undefined
        || ticketLookupValuesReason === undefined
        || ticketLookupValuesSubject === undefined
        || tagOptions === undefined
    ) {
        return <div data-test-id='ticket-new-load-failed'>{t('ticket_new.load_failed')}</div>
    }

    const shouldDisplayField = (field: string) => {
        const ticketType = watch('type');
        const patientId = watch('patientId');
        const patientCaseNumber = watch('patientCaseNumber');
        const type = Number(ticketType);
        switch (field) {
            case 'contactId': {
                return !(type === TicketType.EstablishedPatient || type === TicketType.NewPatient || !!patientId || !!patientCaseNumber);

            }
            case 'patientId':
            case 'patientCaseNumber': {
                return !(type === TicketType.BusinessOffice ||
                    type === TicketType.Facility ||
                    type === TicketType.Lab ||
                    type === TicketType.Pharmacy);
            }
            case 'reason': {
                if (!reasonOptions || reasonOptions.length === 0) {
                    return false;
                }
                return !(type === TicketType.Default || type === TicketType.Callback)
            }
        }
        return false;
    }

    const onContactSelectChanged = (controllerProps: ControllerRenderProps<Record<string, any>>, option?: Option) => {
        if (option) {
            controllerProps.onChange(option.value);
            setContactName(option.label);
        } else {
            controllerProps.onChange();
        }

    }

    return <div className="flex flex-col w-full pb-5 mx-6 mt-5 overflow-y-auto">
        <div className='h-18'>
            <h5>{t('ticket_new.title')}</h5>
        </div>
        <div className='pt-7'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                <div className='grid grid-cols-3 gap-x-8'>
                    <ControlledSelect
                        name='type'
                        label={'ticket_new.ticket_type'}
                        options={ticketTypeOptions}
                        control={control}
                        allowClear={true}
                        required={true}
                    />
                    <div>
                        {shouldDisplayField('reason') &&
                            <ControlledSelect
                                name='reason'
                                label={'ticket_new.reason'}
                                options={reasonOptions}
                                control={control}
                                allowClear={true}
                            />
                        }
                    </div>
                    <div />
                    <div>
                        {
                            subjectOptions && subjectOptions.length > 1
                                ?
                                <ControlledSelect
                                    name='subject'
                                    label={'ticket_new.subject'}
                                    options={subjectOptions}
                                    control={control}
                                    allowClear={true}
                                    required={true}
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
                    <ControlledSelect
                        name='assignee'
                        label={'ticket_new.assignee'}
                        options={users}
                        control={control}
                        allowClear={true}
                        required={true}
                    />
                    <div />
                    <ControlledSelect
                        name='status'
                        label={'ticket_new.status'}
                        options={statusOptions}
                        allowClear={true}
                        defaultValue={TicketStatuses.Open.toString()}
                        control={control}
                        required={true}
                    />
                    <ControlledSelect
                        name='priority'
                        label={'ticket_new.priority'}
                        options={priorityOptions}
                        control={control}
                        allowClear={true}
                        required={true}
                    />
                    <div />
                    <div className="flex">
                        <ControlledDateInput
                            name='dueDate'
                            min={dayjs().startOf('day').toDate()}
                            defaultValue={null}
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
                        />
                    </div>
                    <ControlledSelect
                        name='channel'
                        label={'ticket_new.channel'}
                        allowClear={true}
                        options={sourceOptions}
                        defaultValue={ChannelTypes.UserCreated.toString()}
                        control={control}
                        required={true}
                    />
                    <div />
                    <ControlledSelect
                        name='department'
                        label={'ticket_new.department'}
                        options={departmentOptions}
                        control={control}
                        allowClear={true}
                    />
                    <ControlledSelect
                        name='location'
                        label={'ticket_new.location'}
                        options={locationOptions}
                        allowClear={true}
                        control={control}
                    />
                    <div />
                    <div>
                        {shouldDisplayField('patientId') &&
                            <ControlledInput
                                name='patientId'
                                control={control}
                                defaultValue={queryPatientId}
                                type='number'
                                placeholder={t('ticket_new.patient_id')}
                                isLoading={isPatientIdLoading}
                                disabled={!!queryPatientId}
                                onBlur={({target}: ChangeEvent<HTMLInputElement>) => onPatientIdChanged(target.value)}
                            />
                        }</div>
                    <div>
                        {
                            shouldDisplayField('patientCaseNumber') &&
                            <ControlledInput
                                name='patientCaseNumber'
                                control={control}
                                type='number'
                                defaultValue=''
                                placeholder={t('ticket_new.patient_case_number')}
                                isLoading={isPatientCaseIdLoading}
                                onChange={({target}: ChangeEvent<HTMLInputElement>) => onPatientCaseIdChanged(target.value)}
                                onBlur={validatePatientCaseId}
                            />
                        }</div>
                    <div />
                    {shouldDisplayField('patientId') && patientName && <>
                        <div
                            className='flex flex-row items-center w-full h-12 px-6 mb-6 rounded-md new-ticket-patient-background'>
                            <div className='whitespace-pre body2-medium'>{`${t('ticket_new.patient_label')} `}</div>
                            <div className='body2'>{patientName}</div>
                        </div>
                        <div />
                        <div />
                    </>}
                    <div>
                        {<div hidden={!shouldDisplayField('contactId')}><Controller
                            name='contactId'
                            control={control}
                            defaultValue=''
                            render={(props) => (
                                <Select
                                    {...props}
                                    data-test-id='ticket_new.contact'
                                    label={'ticket_new.contact'}
                                    options={contactOptions}
                                    defaultValue={defaultContact}
                                    error={errors.contactId?.message}
                                    allowClear={true}
                                    isLoading={isLoading || isFetching}
                                    suggestionsPlaceholder={t('ticket_new.suggestion_placeholder')}
                                    onTextChange={(value: string) => setContactSearchTerm(value || '')}
                                    onSelect={(option) => onContactSelectChanged(props, option)}
                                />
                            )}
                        /></div>}
                    </div>
                    <div />
                    <div />
                    <div className='col-span-2'>
                        <ControlledInput
                            name='note'
                            control={control}
                            placeholder={t('ticket_new.add_note')}
                            defaultValue=''
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNoteText(e.target.value)}
                        />
                    </div>
                    <div />
                    <div className='flex flex-col '>
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
                    </div>
                    <div />
                    <div />
                    <div className='pt-8'>
                        <Button data-test-id='ticket-new-cancel-button' type={'button'}
                            buttonType='secondary-medium'
                            label={'common.cancel'}
                            onClick={() => handlePageClose()}
                        />
                    </div>
                    <div className='flex justify-end pt-8'>
                        <Button isLoading={createTicketMutation.isLoading} disabled={!isValid || !stateError}
                            data-test-id='ticket-new-create-button' type={'submit'}
                            label={'ticket_new.create'} />
                    </div>
                </div>

                <div />
            </form>
            <Confirmation title={t('common.confirm_close')}
                okButtonLabel={t('common.yes')} isOpen={closingPromptOpen}
                onOk={onCloseConfirm} onCancel={() => setClosingPromptOpen(false)} onClose={() => setClosingPromptOpen(false)} closeableOnEscapeKeyPress={true} />
            <Prompt
                when={isDirty && !closingPromptOpen && !isSubmitted}
                message={t('common.confirm_close')}
            />
        </div>
    </div>
}

export default withErrorLogging(TicketNew);
