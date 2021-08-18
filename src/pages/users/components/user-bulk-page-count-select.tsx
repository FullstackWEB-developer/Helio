import React from 'react';
import {useTranslation} from 'react-i18next';
import Select from '@components/select/select';
import {Option} from '@components/option/option';
import {useDispatch, useSelector} from 'react-redux';
import {setBulkUsersPagination, setSelectedUsersLocalPagination} from '../store/users.slice';
import {selectBulkUsersPaging, selectExternalUsersSelection, selectFilteredExternalUsersSelection, selectSelectedUsersLocalPagination} from '../store/users.selectors';
import {BulkAddStep} from '../models/bulk-add-step.enum';

const UserBulkPageCountSelect = ({currentStep, pageSize}: {currentStep: BulkAddStep, pageSize: number}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const paginationProperties = useSelector(currentStep > BulkAddStep.Selection ? selectSelectedUsersLocalPagination : selectBulkUsersPaging);
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const filteredExternalUsers = useSelector(selectFilteredExternalUsersSelection);
    const rowsPerPageOptions: Option[] = [
        {label: '5', value: '5'},
        {label: '10', value: '10'},
        {label: '25', value: '25'},
        {label: '50', value: '50'},
        {label: '100', value: '100'}
    ];


    return (
        <div className='flex items-baseline mr-24'>
            <div className='body2 pr-3'>{t('users.bulk_section.rows_per_page')}</div>
            <div className='w-20'>
                <Select
                    options={rowsPerPageOptions}
                    value={String(pageSize)}
                    onSelect={(option?: Option) => {
                        const length = filteredExternalUsers && filteredExternalUsers.length ? filteredExternalUsers.length : selectedExternalUsers.length;
                        let pagination = {...paginationProperties, pageSize: Number(option?.value), page: 1};
                        if (currentStep > BulkAddStep.Selection) {
                            pagination = {
                                ...pagination,
                                totalPages: Math.ceil(length / pagination.pageSize)
                            }
                        }
                        dispatch(currentStep > BulkAddStep.Selection ? setSelectedUsersLocalPagination(pagination) : setBulkUsersPagination(pagination))
                    }}
                />
            </div>
        </div>
    );
}

export default UserBulkPageCountSelect;