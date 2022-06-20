import Button from '@components/button/button';
import { ControlledInput } from '@components/controllers';
import Modal from '@components/modal/modal';
import SvgIcon, { Icon } from '@components/svg-icon';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {deleteLookupValue, getLookupValues, upsertLookupValue} from '@shared/services/lookups.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import './ticket-department.scss';
import { useMutation } from 'react-query';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';

const TicketDepartment = () => {
    const {t} = useTranslation(); 
    const key = "Department"
    const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
    const [departmentId, setDepartmentId] = useState<string | undefined>(undefined);
    const departments = useSelector((state) => selectLookupValues(state, key));
    const {control, handleSubmit, formState} = useForm({mode: 'all'});
    const {isValid} = formState;
    const dispatch = useDispatch();
    const tableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: departments,
        wrapperClassName: '',
        headerClassName: 'h-12',
        rowClass: 'h-14',
        columns: [
            {
                title: 'ticket_department.table.department_name',
                field: 'label',
                widthClass: 'w-full',
                rowClassname: 'subtitle2',
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
                    return (<SvgIcon type={Icon.Edit} className='icon-medium cursor-pointer' fillClass='edit-icon' onClick={() => {
                        setDepartmentId(value);
                        setDepartmentModalOpen(true);
                    }}/>);
                }
            }
        ]
    }
    
    const onAddDepartment = (formData: any) => {
        upsertDepartmentMutation.mutate({
            label: formData.value,
            value: (departments.length + 1).toString(),
            key: key,
            isUpdate: false
        })
    }

    const onUpdateDepartment = (formData: any) => {
        if(departmentId){
            upsertDepartmentMutation.mutate({
                label: formData.value,
                value: departmentId,
                key: key,
                isUpdate: true
            })
        }
    }

    const onDeleteDepartment = () => {
        if(departmentId){
            deleteDepartmentMutation.mutate({
                key: key,
                value: departmentId
            })
        }
    }

    const onActionCompleted = () => {
        setDepartmentId(undefined);
        setDepartmentModalOpen(false);
        getDepartmentMutation.mutate(dispatch);
    }

    const getDepartmentLabel = () => {
        if(departmentId){
            return departments.find(d => d.value === departmentId)?.label;
        }
    }

    const getDepartmentMutation = useMutation(getLookupValues(key, true), {
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message:'ticket_department.get_error'
            }))
        }
    })

    const deleteDepartmentMutation = useMutation(({key, value}: {key: string, value: string}) => deleteLookupValue(key, value), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Success,
                message:'ticket_department.delete_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message:'ticket_department.delete_error'
            }))
        }
    })

    const upsertDepartmentMutation = useMutation(({label, value, key, isUpdate}: {label: string, value: string, key: string, isUpdate: boolean}) => upsertLookupValue(label, value, key, isUpdate), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Success,
                message: departmentId ? 'ticket_department.update_success' : 'ticket_department.create_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type:SnackbarType.Error,
                message: departmentId ? 'ticket_department.update_error' : 'ticket_department.create_error'
            }))
        }
    })
    
    return (
        <>
            <div className='flex items-center justify-center w-full h-full z-10 absolute hidden'>
                <Modal
                    isDraggable={true}
                    className='ticket-department-modal-width'
                    isOpen={departmentModalOpen}
                    title={!departmentId ? t('ticket_department.add_department') : t('ticket_department.edit_department')}
                    onClose={() => setDepartmentModalOpen(false)}
                    isClosable={true}
                    closeableOnEscapeKeyPress={departmentModalOpen}
                    hasOverlay={true}>
                    <div className='flex flex-col pb-11'>
                        <div className='flex flex-col pb-6 ticket-department-modal-title'>
                            <Fragment>
                                <ControlledInput
                                    control={control}
                                    name='value'
                                    type='text'
                                    label='ticket_department.input_label'
                                    containerClassName='w-full'
                                    defaultValue={getDepartmentLabel()}
                                    required
                                />
                            </Fragment>
                            <div className='flex justify-end mt-10'>
                                <Button label='common.cancel' className='mr-6' buttonType='secondary' onClick={() => setDepartmentModalOpen(false)} />
                                {departmentId && (
                                    <Button label='common.delete' className='mr-6' buttonType='secondary' disabled={deleteDepartmentMutation.isLoading} isLoading={deleteDepartmentMutation.isLoading} onClick={() => onDeleteDepartment()} />
                                )}
                                <Button
                                    type='submit'
                                    buttonType='small'
                                    disabled={!isValid || upsertDepartmentMutation.isLoading}
                                    isLoading={upsertDepartmentMutation.isLoading}
                                    label='common.save'
                                    onClick={() => {
                                        if(departmentId){
                                            handleSubmit(onUpdateDepartment)()
                                        }else{
                                            handleSubmit(onAddDepartment)()
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className='ticket-department overflow-auto h-full p-6 pr-4'>
                <h5 className='ticket-department-header'>{t('ticket_department.title')}</h5>
                <div className='body2 pb-6'>{t('ticket_department.description')}</div>
                <div className='w-full h-14 flex flex-row justify-between'>
                    <div className='flex flex-col justify-end ticket-department-table-header'>
                        <div className='h7'>{t('ticket_department.table_header')}</div>
                    </div>
                    <div className='flex flex-col justify-center mr-8'>
                        <Button label='ticket_department.create_department' buttonType='small' onClick={() => {
                            setDepartmentId(undefined);
                            setDepartmentModalOpen(true);
                        }} />
                    </div>
                </div>
                {getDepartmentMutation.isLoading ? (
                    <Spinner size='large-40' className='pt-2' />
                ):(
                    <div>
                        <Table model={tableModel} />
                    </div>
                )}
            </div>
        </>
    );
}

export default TicketDepartment;

