import { useState, Fragment, useEffect } from 'react';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import SvgIcon, { Icon } from '@components/svg-icon';
import Table from '@components/table/table';
import { deleteLookupValue, getLookupValues, upsertLookupValue } from '@shared/services/lookups.service';
import { existsInCategory } from '@shared/services/contacts.service';
import { selectLookupValues } from '@pages/tickets/store/tickets.selectors';
import { TableModel } from '@components/table/table.models';
import Modal from '@components/modal/modal';
import { ControlledInput } from '@components/controllers';
import { useForm } from 'react-hook-form';
import Button from '@components/button/button';
import Spinner from '@components/spinner/Spinner';


const ContactCategories = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [categoryId, setCategoryId] = useState<string>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [anyContactExistInCategoryText, setAnyContactExistInCategoryText] = useState<boolean>(false);
    const contactCategoriesKey = 'ContactCategory';
    const categories = useSelector((state) => selectLookupValues(state, contactCategoriesKey));
    useEffect(() => { getCategoriesMutation.mutate(dispatch) }, [])
    const tableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: categories,
        headerClassName: 'h-12',
        rowClass: 'h-14',
        columns: [
            {
                title: 'configuration.contact_categories.grid_name',
                field: 'label',
                widthClass: 'w-full',
                rowClassname: 'subtitle2',
                render: (label: string) => {
                    return (<span className='flex items-center h-full ml-3'>{label}</span>)
                }
            },
            {
                field: 'value',
                alignment: 'start',
                widthClass: 'w-10 flex items-center justify-center h-full mr-4',
                render: (value: string) => {
                    return (<SvgIcon type={Icon.Edit} className='icon-medium cursor-pointer' fillClass='edit-icon' onClick={() => {
                        setCategoryId(value);
                        setModalVisible(true);
                    }} />);
                }
            }
        ]
    }
    const getCategoryLabel = () => {
        if (categoryId) {
            return categories.find(d => d.value === categoryId)?.label;
        }
    }
    const deleteCategoryMutation = useMutation(({ key, value }: { key: string, value: string }) => deleteLookupValue(key, value), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'configuration.contact_categories.delete_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'configuration.contact_categories.delete_error'
            }))
        }
    })
    const upsertCategoryMutation = useMutation(({ label, value, key, isUpdate }: { label: string, value: string, key: string, isUpdate: boolean }) => upsertLookupValue(label, value, key, isUpdate), {
        onSuccess: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: categoryId ? 'configuration.contact_categories.update_success' : 'configuration.contact_categories.create_success'
            }))
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: categoryId ? 'configuration.contact_categories.update_error' : 'configuration.contact_categories.create_error'
            }))
        }
    })
    const onAddCategory = (formData: { value: string }) => {
        upsertCategoryMutation.mutate({
            label: formData.value,
            value: (categories.length + 1).toString(),
            key: contactCategoriesKey,
            isUpdate: false
        })
    }

    const onUpdateCategory = (formData: { value: string }) => {
        if (categoryId) {
            upsertCategoryMutation.mutate({
                label: formData.value,
                value: categoryId,
                key: contactCategoriesKey,
                isUpdate: true
            })
        }
    }

    const onDeleteCategory = () => {
        if (categoryId) {
            checkIfAnyContactExistsInCategoryMutation.mutate(+categoryId);
        }
    }

    const onActionCompleted = (refreshTable: boolean = true) => {
        setCategoryId(undefined);
        setModalVisible(false);
        setAnyContactExistInCategoryText(false);
        if (refreshTable) {
            getCategoriesMutation.mutate(dispatch);
        }
    }

    const checkIfAnyContactExistsInCategoryMutation = useMutation((category: number) => existsInCategory(category), {
        onSuccess: (anyContactExistsInCategory: boolean) => {
            if (anyContactExistsInCategory) {
                setAnyContactExistInCategoryText(true);
            } else if (categoryId) {
                deleteCategoryMutation.mutate({
                    key: contactCategoriesKey,
                    value: categoryId.toString()
                })
            }
        },
        onError: () => {
            onActionCompleted();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'configuration.contact_categories.delete_error'
            }))
        }
    })

    const getCategoriesMutation = useMutation(getLookupValues(contactCategoriesKey, true), {
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'configuration.contact_categories.get_error'
            }))
        }
    })

    const { control, handleSubmit, formState } = useForm({ mode: 'all' });
    return (

        <>
            <div className='flex items-center justify-center w-full h-full z-10 absolute hidden'>
                <Modal
                    isDraggable={true}
                    className='w-96'
                    isOpen={modalVisible}
                    title={categoryId ? 'configuration.contact_categories.edit_title' : 'configuration.contact_categories.add_title'}
                    onClose={() => onActionCompleted(false)}
                    isClosable={true}
                    hasOverlay={true}>
                    <div className='flex flex-col pb-11'>
                        <div className='flex flex-col pb-6 pt-6'>
                            {anyContactExistInCategoryText &&
                                <span className='text-red-600 font-light text-sm mb-2 -mt-4'>
                                    {t('configuration.contact_categories.any_contact_exists_in_category')}
                                </span>}

                            <Fragment>
                                <ControlledInput
                                    control={control}
                                    name='value'
                                    type='text'
                                    label='configuration.contact_categories.category_name_label'
                                    containerClassName='w-full'
                                    defaultValue={getCategoryLabel()}
                                    required
                                />
                            </Fragment>
                            <div className='flex justify-end mt-10'>
                                <Button label='common.cancel' className='mr-6' buttonType='secondary' onClick={() => onActionCompleted(false)} />
                                {categoryId && (
                                    <Button label='common.delete' className='mr-6' buttonType='secondary'
                                        disabled={deleteCategoryMutation.isLoading || checkIfAnyContactExistsInCategoryMutation.isLoading}
                                        isLoading={deleteCategoryMutation.isLoading || checkIfAnyContactExistsInCategoryMutation.isLoading}
                                        onClick={() => { onDeleteCategory() }} />
                                )}
                                <Button
                                    type='submit'
                                    buttonType='small'
                                    disabled={!formState.isValid || upsertCategoryMutation.isLoading}
                                    isLoading={upsertCategoryMutation.isLoading}
                                    label='common.save'
                                    onClick={() => {
                                        if (categoryId) {
                                            handleSubmit(onUpdateCategory)()
                                        } else {
                                            handleSubmit(onAddCategory)()
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className='w-10/12 overflow-auto h-full p-6 pr-4'>
                <h5 className='pb-6'>{t('configuration.contact_categories.title')}</h5>
                <div className='body2'>{t('configuration.contact_categories.description')}</div>
                <div className='w-full h-10 flex flex-row my-4'>
                    <Button className='ml-auto' label='configuration.contact_categories.add_category_button' buttonType='small' onClick={() => {
                        setCategoryId(undefined);
                        setModalVisible(true);
                    }} />
                </div>
                {getCategoriesMutation.isLoading ? (
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

export default ContactCategories;