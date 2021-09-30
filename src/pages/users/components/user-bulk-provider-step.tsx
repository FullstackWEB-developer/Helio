import {SelectExternalUser} from '@shared/models';
import {getProviders} from '@shared/services/lookups.service';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {BulkGridDropdownType} from '../models/bulk-grid-dropdown-type.enum';
import {
    selectExternalUsersSelection, selectFilteredExternalUsersSelection,
    selectLocalBulkFilters, selectSelectedUsersLocalPagination
} from '../store/users.selectors';
import {setLocalBulkFilters} from '../store/users.slice';
import BulkGridDropdown from './bulk-grid-dropdown';

const UserBulkProviderStep = () => {

    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const filteredExternalUsers = useSelector(selectFilteredExternalUsersSelection);
    const localFilters = useSelector(selectLocalBulkFilters);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const localPaginationProperties = useSelector(selectSelectedUsersLocalPagination);
    const usersSlice = [localPaginationProperties.pageSize * (localPaginationProperties.page - 1),
    localPaginationProperties.pageSize * localPaginationProperties.page];

    useEffect(() => {
        dispatch(getProviders());
    }, [dispatch]);

    const displayList = () => {
        return localFilters && Object.keys(localFilters).length > 0 ?
            (filteredExternalUsers && filteredExternalUsers.length > 0 ? filteredExternalUsers : []) :
            selectedExternalUsers;
    }

    useEffect(() => {
        dispatch(setLocalBulkFilters({filters: undefined, resetPagination: true}))
    }, []);

    const usersToDisplay = displayList();

    return (
        <div className='w-full overflow-y-auto'>
            <div className='h-12 px-4 bulk-user-grid col-template-step-2 head-row caption-caps'>
                <div className='truncate'>{t('users.bulk_section.name')}</div>
                <div className='truncate'>{t('users.bulk_section.department')}</div>
                <div className='truncate'>{t('users.bulk_section.job_title')}</div>
                <div className='truncate'>{t('users.bulk_section.ehr_mapping')}</div>
            </div>
            {
                usersToDisplay.length > 0 ?
                    usersToDisplay?.slice(usersSlice[0], usersSlice[1]).map((u: SelectExternalUser) => (
                        <div key={u.id} className='px-4 bulk-user-grid data-row col-template-step-2 h-14 body2'>
                            <div className='flex flex-col truncate'>
                                <span>{u.info?.displayName || ''}</span>
                                {u.info?.mail && <span className='body3-medium'>{u.info.mail}</span>}
                            </div>
                            <div className='truncate'>{u.info?.department || ''}</div>
                            <div className='truncate'>{u.info?.jobTitle || ''}</div>
                            <div>
                                <BulkGridDropdown userId={u.id} storedProviderMapping={u.inviteUserModel?.providerId} storedRole={u.inviteUserModel?.roles || []}
                                    purpose={BulkGridDropdownType.ProviderMapping} />
                            </div>
                        </div>
                    )) : <div className='w-full mt-5 text-center subtitle3-small'>{t('users.bulk_section.no_filter_results')}</div>
            }
        </div>
    )
}

export default UserBulkProviderStep;