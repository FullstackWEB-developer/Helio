import Button from '@components/button/button';
import { ControlledInput, ControlledSelect } from '@components/controllers';
import Modal from '@components/modal/modal';
import SvgIcon, { Icon } from '@components/svg-icon';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {deleteLookupValue, getLookupValues, upsertLookupValue} from '@shared/services/lookups.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import './ticket-configurations.scss';
import { useMutation, useQuery } from 'react-query';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import Select from '@components/select/select';
import { getIntents, getTicketTypes, saveTicketTypes } from '@pages/tickets/services/tickets.service';
import { Option } from '@components/option/option';
import { TicketTypes } from '@pages/tickets/models/ticket-types.model';
import { GetIntents, GetTicketTypes } from '@constants/react-query-constants';

const TicketConfigurations = () => {
    const {t} = useTranslation(); 
    const ticketReasonKey = "TicketReason"
    const ticketSubjectKey = "TicketSubject"
    const [lookupModalOpen, setLookupModalOpen] = useState(false);
    const [lookupId, setLookupId] = useState<string | undefined>(undefined);
    const [ticketTypes, setTicketTypes] = useState<TicketTypes[]>([]);
    const [ticketTypeOptions, setTicketTypeOptions] = useState<Option[]>([]);
    const [intentOptions, setIntentOptions] = useState<Option[]>([]);
    const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>();
    const [selectedLookupType, setSelectedLookupType] = useState<string>(ticketReasonKey);
    const ticketLookupValuesReason = useSelector((state) => selectLookupValues(state, ticketReasonKey));
    const ticketLookupValuesSubject = useSelector((state) => selectLookupValues(state, ticketSubjectKey));
    const {control, handleSubmit, formState} = useForm({mode: 'all'});
    const {isValid} = formState;
    const {control: ticketTypeControl, handleSubmit: ticketTypeHandleSubmit, formState: ticketTypeFormState} = useForm({mode: 'all'});
    const {isValid: ticketTypeIsValid} = ticketTypeFormState;
    const dispatch = useDispatch();
    
    useEffect(() => {
        refetchTicketTypes();
        refetchIntents();
    }, []);

    useEffect(() => {
        dispatch(getLookupValues(ticketReasonKey));
        dispatch(getLookupValues(ticketSubjectKey));
    }, [dispatch])
    
    useEffect(() => {
        if(!!selectedTicketTypeId)
        {
            getTicketTypeValues()
        }
    }, [selectedTicketTypeId])
    
    const reasonModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: ticketLookupValuesReason.filter(x => x.parentValue === selectedTicketTypeId),
        wrapperClassName: '',
        headerClassName: 'h-12',
        rowClass: 'h-14',
        columns: [
            {
                title: 'ticket_configuration.reason_table.reason_label',
                field: 'label',
                widthClass: 'w-full',
                rowClassname: 'subtitle2',
                render: (label: string) => {
                    return (<span className='flex items-center h-full ml-3'>{label}</span>)
                }
            },{
                title: 'ticket_configuration.reason_table.voice_bot_name',
                field: 'intentName',
                widthClass: 'w-full',
                rowClassname: 'subtitle2',
                tooltip: "ticket_configuration.reason_table.voice_bot_tooltip",
                render: (label: string) => {
                    return (<span className='flex items-center h-full ml-3'>{label}</span>)
                }
            },
            {
                title: "",
                field: 'value',
                alignment: 'start',
                widthClass: 'w-10 flex items-center justify-center h-full mr-4',
                render: (value: string) => {
                    return (<SvgIcon dataTestId={`edit-${value}`} type={Icon.Edit} className='icon-medium cursor-pointer' fillClass='edit-icon' onClick={() => editIconClick(value,ticketReasonKey)}/>);
                }
            }
        ]
    }

    const subjectModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: ticketLookupValuesSubject.filter(x => x.parentValue === selectedTicketTypeId),
        wrapperClassName: '',
        headerClassName: 'h-12',
        rowClass: 'h-14',
        columns: [
            {
                title: 'ticket_configuration.subject_table.reason_label',
                field: 'label',
                widthClass: 'w-full',
                rowClassname: 'subtitle2',
                render: (label: string) => {
                    return (<span className='flex items-center h-full ml-3'>{label}</span>)
                }
            },{
                title: 'ticket_configuration.subject_table.voice_bot_name',
                field: 'intentName',
                widthClass: 'w-full',
                rowClassname: 'subtitle2',
                tooltip: "ticket_configuration.subject_table.voice_bot_tooltip",
                render: (label: string) => {
                    return (<span className='flex items-center h-full ml-3'>{label}</span>)
                }
            },
            {
                title: "",
                field: 'value',
                alignment: 'start',
                widthClass: 'w-10 flex items-center justify-center h-full mr-4',
                render: (value: string) => {
                    return (<SvgIcon dataTestId={`edit-${value}`} type={Icon.Edit} className='icon-medium cursor-pointer' fillClass='edit-icon' onClick={() => editIconClick(value,ticketSubjectKey)}/>);
                }
            }
        ]
    }

    const editIconClick = (value: string, lookupType: string) => {
        setLookupId(value);
        setLookupModalOpen(true);
        setSelectedLookupType(lookupType)
    }

    const getTicketTypeValues = () => {
        let selectedTicketType = ticketTypes.filter(x => x.id.toString() === selectedTicketTypeId);
        if(selectedTicketType.length > 0 && selectedTicketType[0]?.dueDuration)
        {
            ticketTypeControl.setValue('duration', selectedTicketType[0].dueDuration.toString());
        }
    }
    
    const onAddLookupValue = (formData: any) => {
        if(!!selectedLookupType && selectedTicketTypeId){
            const ids = ticketReasonKey ? ticketLookupValuesReason.map(a => parseInt(a.value)) : ticketLookupValuesSubject.map(a => parseInt(a.value));
            const max = Math.max(...ids) + 1;
            upsertLookupMutation.mutate({
                label: formData.value,
                value: max.toString(),
                key: selectedLookupType,
                isUpdate: false,
                intentName: formData.intentName,
                parentValue: selectedTicketTypeId
            })
        }
        
    }

    const onUpdateLookupValue = (formData: any) => {
        if(!!selectedLookupType && lookupId && selectedTicketTypeId){
            upsertLookupMutation.mutate({
                label: formData.value,
                value: lookupId,
                key: selectedLookupType,
                isUpdate: true,
                intentName: formData.intentName,
                parentValue: selectedTicketTypeId
            })
        }
    }

    const onDeleteLookupValue = () => {
        if(lookupId && !!selectedLookupType){
            deleteLookupMutation.mutate({
                key: selectedLookupType,
                value: lookupId
            })
        }
    }

    const onTicketTypeUpdate = (formData: any) => {
        let selectedTicketType = ticketTypes.filter(x => x.id.toString() === selectedTicketTypeId);
        if(selectedTicketType.length > 0){
            updateTicketTypeMutation.mutate({
                ticketTypes: {
                    id: selectedTicketType[0].id,
                    dueDuration: formData.duration,
                    name: selectedTicketType[0].name
                }
            })
        }
    }

    const onActionCompleted = () => {
        setLookupId(undefined);
        setLookupModalOpen(false);
        dispatch(getLookupValues(selectedLookupType, true));
    }

    const getLookupValue = () => {
        if(selectedLookupType === ticketReasonKey){
            return ticketLookupValuesReason.find(d => d.value === lookupId)?.label;
        }else if(selectedLookupType === ticketSubjectKey){
            return ticketLookupValuesSubject.find(d => d.value === lookupId)?.label;
        }
        return ''
    }

    const getIntentValue = () => {
        if(selectedLookupType === ticketReasonKey){
            return ticketLookupValuesReason.find(d => d.value === lookupId)?.intentName;
        }else if(selectedLookupType === ticketSubjectKey){
            return ticketLookupValuesSubject.find(d => d.value === lookupId)?.intentName;
        }
        return ''
    }

    const getLookupLabel = () => {
        if(selectedLookupType === ticketReasonKey){
            return t('ticket_configuration.reason_label')
        }else if(selectedLookupType === ticketSubjectKey){
            return t('ticket_configuration.subject_label')
        }
        return ''
    }

    const getModalTitle = () => {
        if(selectedLookupType === ticketReasonKey){
            return !lookupId ? t('ticket_configuration.add_reason') : `${t('ticket_configuration.edit_reason')}: ${ticketLookupValuesReason.find(d => d.value === lookupId)?.label}`
        }else if(selectedLookupType === ticketSubjectKey){
            return !lookupId ? t('ticket_configuration.add_subject') : `${t('ticket_configuration.edit_subject')}: ${ticketLookupValuesSubject.find(d => d.value === lookupId)?.label}`
        }
        return ''
    }

    const {isLoading: isTicketTypeLoading, refetch: refetchTicketTypes} = useQuery([GetTicketTypes], () => {
        return getTicketTypes();
    }, {
        enabled: false,
        onSuccess: (data) => {
            if(data.length > 0)
            {
                let options: Option[] = []
                data.forEach(x => {
                    options.push({ label: x.name, value: x.id.toString()})
                });
                setTicketTypeOptions(options);
                setIntentOptions(options);
                setTicketTypes(data);
                setSelectedTicketTypeId(data[0].id.toString());
                ticketTypeControl.setValue('duration', data[0].dueDuration);
            } else {
                setSelectedTicketTypeId(undefined);
                setTicketTypeOptions([]);
                setIntentOptions([]);
            }
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message:'ticket_configuration.get_error'
            }))
        }
    });

    const {refetch: refetchIntents} = useQuery([GetIntents], () => {
        return getIntents();
    }, {
        enabled: false,
        onSuccess: (data) => {
            if(data.length > 0)
            {
                let options: Option[] = []
                data.forEach(x => {
                    options.push({ label: x.intentName, value: x.intentName})
                });
                setIntentOptions(options);
            } else {
                setIntentOptions([]);
            }
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message:'ticket_configuration.get_error'
            }))
        }
    })

    const deleteLookupMutation = useMutation(({key, value}: {key: string, value: string}) => deleteLookupValue(key, value), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Success,
                message:'ticket_configuration.delete_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message:'ticket_configuration.delete_error'
            }))
        }
    })

    const upsertLookupMutation = useMutation(({label, value, key, isUpdate, intentName, parentValue}: {label: string, value: string, key: string, isUpdate: boolean, intentName: string, parentValue: string}) => upsertLookupValue(label, value, key, isUpdate, false, intentName, parentValue), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Success,
                message: lookupId ? 'ticket_configuration.update_success' : 'ticket_configuration.create_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message: lookupId ? 'ticket_configuration.update_error' : 'ticket_configuration.create_error'
            }))
        }
    })

    const updateTicketTypeMutation = useMutation(({ticketTypes}: {ticketTypes: TicketTypes}) => saveTicketTypes(ticketTypes), {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type:SnackbarType.Success,
                message: 'ticket_configuration.update_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message: 'ticket_configuration.update_error'
            }))
        }
    })
    
    return (
        <>
            <div className='flex items-center justify-center w-full h-full z-10 absolute hidden'>
                <Modal
                    isDraggable={true}
                    className='ticket-configurations-modal-width'
                    isOpen={lookupModalOpen}
                    title={getModalTitle()}
                    onClose={() => setLookupModalOpen(false)}
                    isClosable={true}
                    closeableOnEscapeKeyPress={lookupModalOpen}
                    hasOverlay={true}>
                        <div className='flex flex-col pb-11'>
                            <div className='flex flex-col pb-6 ticket-configurations-modal-title'>
                                <Fragment>
                                    <ControlledInput
                                        control={control}
                                        name='value'
                                        type='text'
                                        label={getLookupLabel()}
                                        containerClassName='w-full'
                                        defaultValue={getLookupValue()}
                                        required
                                    />
                                </Fragment>
                                <Fragment>
                                    <ControlledSelect
                                        name='intentName'
                                        label='ticket_configuration.voice_intent'
                                        options={intentOptions}
                                        allowClear={true}
                                        defaultValue={getIntentValue()}
                                        control={control}
                                    />
                                </Fragment>
                                <div className='flex justify-end mt-10'>
                                    <Button data-testid='cancel-configurations' label='common.cancel' className='mr-6' buttonType='secondary' onClick={() => setLookupModalOpen(false)} />
                                    {lookupId && (
                                        <Button data-testid='delete-configurations' label='common.delete' className='mr-6' buttonType='secondary' disabled={deleteLookupMutation.isLoading} isLoading={deleteLookupMutation.isLoading} onClick={() => onDeleteLookupValue()} />
                                    )}
                                    <Button
                                        data-testid='save-changes'
                                        type='submit'
                                        buttonType='small'
                                        disabled={!isValid || upsertLookupMutation.isLoading}
                                        isLoading={upsertLookupMutation.isLoading}
                                        label='common.save'
                                        onClick={() => {
                                            if(lookupId){
                                                handleSubmit(onUpdateLookupValue)()
                                            }else{
                                                handleSubmit(onAddLookupValue)()
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal>
            </div>
            <div className='ticket-configurations overflow-auto h-full p-6 pr-4'>
                {isTicketTypeLoading ? (
                    <Spinner size='large-40' className='pt-2' />
                ):(
                    <>
                        <h5 className='ticket-configurations-header'>{t('ticket_configuration.title')}</h5>
                        <div className='body2 pb-6'>{t('ticket_configuration.description')}</div>
                        <div className='mt-4 w-80'>
                            <Select
                                options={ticketTypeOptions}
                                label='ticket_configuration.ticket_type'
                                defaultValue={selectedTicketTypeId}
                                onSelect={option => setSelectedTicketTypeId(option?.value)}
                            />
                        </div>
                        <div className='mt-10 w-48'>
                            <ControlledInput
                                control={ticketTypeControl}
                                name='duration'
                                type='number'
                                defaultValue={ticketTypes.length > 0 ? ticketTypes[0].dueDuration : undefined}
                                label='ticket_configuration.duration'
                                assistiveText='ticket_configuration.hours'
                                containerClassName='w-full h-full'
                            />
                        </div>
                        <div className='mt-10 w-full h-14 flex flex-row justify-between'>
                            <div className='flex flex-col justify-end ticket-configurations-table-header'>
                                <div className='h7'>{t('ticket_configuration.table_reason_header')}</div>
                            </div>
                            <div className='flex flex-col justify-center mr-8'>
                                <Button data-testid='add' label='ticket_configuration.add_reason' buttonType='small' onClick={() => {
                                    setLookupId(undefined);
                                    setLookupModalOpen(true);
                                    setSelectedLookupType(ticketReasonKey)
                                }} />
                            </div>
                        </div>
                        {isTicketTypeLoading ? (
                            <Spinner size='large-40' className='pt-2' />
                        ):(
                            <div>
                                <Table model={reasonModel} />
                            </div>
                        )}
                        <div className='w-full mt-16 h-14 flex flex-row justify-between'>
                            <div className='flex flex-col justify-end ticket-configurations-table-header'>
                                <div className='h7'>{t('ticket_configuration.table_subject_header')}</div>
                            </div>
                            <div className='flex flex-col justify-center mr-8'>
                                <Button data-testid='add' label='ticket_configuration.add_subject' buttonType='small' onClick={() => {
                                    setLookupId(undefined);
                                    setLookupModalOpen(true);
                                    setSelectedLookupType(ticketSubjectKey)
                                }} />
                            </div>
                        </div>
                        {isTicketTypeLoading ? (
                            <Spinner size='large-40' className='pt-2' />
                        ):(
                            <div>
                                <Table model={subjectModel} />
                            </div>
                        )}
                        <div className='flex justify-start mt-10'>
                                <Button
                                    data-testid='save-changes'
                                    type='submit'
                                    buttonType='small'
                                    disabled={!ticketTypeIsValid || updateTicketTypeMutation.isLoading}
                                    isLoading={updateTicketTypeMutation.isLoading}
                                    label='common.save'
                                    onClick={() => ticketTypeHandleSubmit(onTicketTypeUpdate)()}
                                />
                                <Button data-testid='cancel-configurations' label='common.cancel' className='ml-6' buttonType='secondary' onClick={() => getTicketTypeValues()} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default TicketConfigurations;

