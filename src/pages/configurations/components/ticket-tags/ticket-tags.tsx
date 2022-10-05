import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { ControlledInput } from '@components/controllers';
import Modal from '@components/modal/modal';
import SvgIcon, { Icon } from '@components/svg-icon';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import Spinner from '@components/spinner/Spinner';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { deleteLookupValue, getLookupValues, upsertLookupValue } from '@shared/services/lookups.service';
import { useDispatch, useSelector } from 'react-redux';
import { selectLookupValues } from '@pages/tickets/store/tickets.selectors';
import { TicketLookupValue } from '@pages/tickets/models/ticket-lookup-values.model';
import './ticket-tags.scss';

const TicketTags = () => {

    const key = "TicketTags";
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tagModalOpen, setTagModalOpen] = useState(false);
    const [tagId, setTagId] = useState<string | undefined>(undefined);
    const tags = useSelector((state) => selectLookupValues(state, key));
    const { control, handleSubmit, formState } = useForm({ mode: 'all' });
    const { isValid } = formState;


    const getTagsMutation = useMutation(getLookupValues(key, true), {
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_tags.get_error'
            }))
        }
    });

    const displayToolTip = (message: string) => {
        return <ToolTipIcon
            icon={Icon.InfoOutline}
            placement='right-start'
            iconClassName='cursor-pointer'
            iconFillClass='rgba-062-fill'
        >
            <div className='body2 p-3'>{message}</div>
        </ToolTipIcon>
    }

    const onActionCompleted = () => {
        setTagId(undefined);
        setTagModalOpen(false);
        getTagsMutation.mutate(dispatch);
    };

    const handleDelete = () => {
        if (tagId) {
            deleteTagMutation.mutate({
                key: key,
                value: tagId
            })
        }
    }

    const onTagAdd = (formData: any) => {
        upsertTagMutation.mutate({
            label: formData.value,
            value: (tags.length + 1).toString(),
            key: key,
            isUpdate: false
        })
    }

    const onTagUpdate = (formData: any) => {
        if (tagId) {
            upsertTagMutation.mutate({
                label: formData.value,
                value: tagId,
                key: key,
                isUpdate: true
            })
        }
    }

    const getTagLabel = () => {
        if (tagId) {
            return tags.find(tag => tag.value === tagId)?.label;
        }
        return ''
    }

    const handleCreateTagClick = () => {
        setTagId(undefined);
        setTagModalOpen(true);
    }

    const deleteTagMutation = useMutation(({ key, value }: { key: string, value: string }) => deleteLookupValue(key, value), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_tags.delete_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_tags.delete_error'
            }))
        }
    })

    const upsertTagMutation = useMutation(({ label, value, key, isUpdate }: { label: string, value: string, key: string, isUpdate: boolean }) => upsertLookupValue(label, value, key, isUpdate), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: tagId ? 'ticket_tags.update_success' : 'ticket_tags.create_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: tagId ? 'ticket_tags.update_error' : 'ticket_tags.create_error'
            }))
        }
    })

    const tableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: tags,
        wrapperClassName: '',
        headerClassName: 'h-12',
        rowClass: 'h-14',
        columns: [
            {
                title: 'ticket_tags.table.tag_name',
                field: 'label',
                widthClass: 'w-full',
                rowClassname: 'subtitle2',
                render: (label: string, row: TicketLookupValue) => {
                    return (<span className='flex items-center h-full body2'>{label}
                        {row.isReadOnly ? <div className='ml-2'>{displayToolTip(t('ticket_tags.tooltip_system_default'))}</div> : "  "}</span>)
                }
            },
            {
                title: "",
                field: 'value', 
                alignment: 'start',
                widthClass: 'w-10 flex items-center justify-center h-full mr-4',
                render: (value: string, row: TicketLookupValue) => {
                    if (!row.isReadOnly) {
                        return (
                            <SvgIcon dataTestId={`edit-${value}`} type={Icon.Edit} className='icon-medium cursor-pointer' fillClass='edit-icon' onClick={() => {
                                setTagId(value);
                                setTagModalOpen(true);
                            }} />)
                    }
                }
            }
        ]
    }

    return (<>
        <div className='flex items-center justify-center w-full h-full z-10 absolute hidden'>
            <Modal
                isDraggable={true}
                className='ticket-tag-modal-width'
                isOpen={tagModalOpen}
                title={!tagId ? t('ticket_tags.modal.add_tag') : t('ticket_tags.modal.edit_tag')}
                onClose={() => setTagModalOpen(false)}
                isClosable={true}
                closeableOnEscapeKeyPress={tagModalOpen}
                hasOverlay={true}
                titleClassName=" px-6 pb-2 pt-9 h7">
                <div className='flex flex-col pb-11'>
                    <div className='flex flex-col pb-6 ticket-tag-modal-title'>
                        <ControlledInput
                            control={control}
                            name='value'
                            type='text'
                            label='ticket_tags.modal.input_label'
                            dataTestId='ticket_tags.modal.input_label'
                            containerClassName='w-2/3'
                            defaultValue={getTagLabel()}
                            required
                        />
                        <div className='flex justify-end mt-10'>
                            <Button data-testid='cancel-tags' label='common.cancel' className='mr-6' buttonType='secondary' onClick={() => setTagModalOpen(false)} />
                            {tagId && (
                                <Button data-testid='delete-tags' label='common.delete' className='mr-6' buttonType='secondary' disabled={deleteTagMutation.isLoading} isLoading={deleteTagMutation.isLoading} onClick={() => handleDelete()} />
                            )}<Button
                                data-testid='save-changes'
                                type='submit'
                                buttonType='small'
                                disabled={!isValid}
                                isLoading={upsertTagMutation.isLoading}
                                label='common.save'
                                onClick={() => {
                                    if (tagId) {
                                        handleSubmit(onTagUpdate)()
                                    } else {
                                        handleSubmit(onTagAdd)()
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
        <div className='ticket-tags overflow-auto h-full px-6 pt-7'>
            <h6 className='pb-7'>{t('ticket_tags.title')}</h6>
            <div className='body2 pb-6'>{t('ticket_tags.description')}</div>
            <div className='w-full h-14 flex flex-row justify-between'>
                <div className='flex flex-col justify-end ticket-tags-table-header'>
                    <div className='h7 pl-1 pb-2'>{t('ticket_tags.table_header')}</div>
                </div>
                <div className='flex flex-col justify-center mr-8'>
                    <Button data-testid='add' label='ticket_tags.create_tag' buttonType='small' onClick={() => handleCreateTagClick()} />
                </div>
            </div>
            {getTagsMutation.isLoading ? (
                <Spinner size='large-40' className='pt-2' />
            ) : (
                <div>
                    <Table model={tableModel} />
                </div>
            )}
        </div>
    </>
    )
}
export default TicketTags;