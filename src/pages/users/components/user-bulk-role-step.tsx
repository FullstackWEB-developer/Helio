import Select from '@components/select/select';
import {SelectExternalUser} from '@shared/models';
import {selectRoleList} from '@shared/store/lookups/lookups.selectors';
import utils from '@shared/utils/utils';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {BulkGridDropdownType} from '../models/bulk-grid-dropdown-type.enum';
import {BulkRolePicker} from '../models/bulk-role-picker.enum';
import {selectExternalUsersSelection, selectFilteredExternalUsersSelection, selectLocalBulkFilters, selectSelectedUsersLocalPagination} from '../store/users.selectors';
import BulkGridDropdown from './bulk-grid-dropdown';
import {Option} from '@components/option/option';
import {setLocalBulkFilters, setRoleToAllSelectedUsers} from '../store/users.slice';
import {getRoleWithState} from '@shared/services/user.service';


const UserBulkRoleStep = ({rolePickerBehavior}: {rolePickerBehavior: BulkRolePicker}) => {
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const filteredExternalUsers = useSelector(selectFilteredExternalUsersSelection);
    const localPaginationProperties = useSelector(selectSelectedUsersLocalPagination);
    const localFilters = useSelector(selectLocalBulkFilters);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const userRoleList = useSelector(selectRoleList);
    const usersSlice = [localPaginationProperties.pageSize * (localPaginationProperties.page - 1),
    localPaginationProperties.pageSize * localPaginationProperties.page];


    const [selectedRole, setSelectedRole] = useState<string>();
    const roleOptions = useMemo(() => utils.parseOptions(userRoleList,
        item => item.name,
        item => item.name
    ), [userRoleList]);

    const handleRoleSelectChange = (option?: Option) => {
        if (option) {
            dispatch(setRoleToAllSelectedUsers(option.value));
            setSelectedRole(option.value);
        }
    }

    useEffect(() => {
        dispatch(setLocalBulkFilters({filters: undefined, resetPagination: true}))
    }, []);

    useEffect(() => {
        dispatch(getRoleWithState);
    }, [dispatch]);

    const displayList = () => {
        return localFilters && Object.keys(localFilters).length > 0 ?
            (filteredExternalUsers && filteredExternalUsers.length > 0 ? filteredExternalUsers : []) :
            selectedExternalUsers;
    }

    const usersToDisplay = displayList();

    return (
        rolePickerBehavior === BulkRolePicker.Group ?
            <div className='flex flex-col'>
                <div className='body2 group-role-description'>{t('users.bulk_section.group_role_description')}</div>
                <div className='md:w-1/4 pt-3'>
                    <Select options={roleOptions} defaultValue={selectedRole} label={'users.bulk_section.pick_a_role'} onSelect={handleRoleSelectChange} />
                </div>
            </div> :
            (
                <div className='w-full overflow-y-auto relative'>

                    <div className='bulk-user-grid col-template-step-2 head-row caption-caps h-12 px-4'>
                        <div className='truncate'>{t('users.bulk_section.name')}</div>
                        <div className='truncate'>{t('users.bulk_section.department')}</div>
                        <div className='truncate'>{t('users.bulk_section.job_title')}</div>
                        <div className='truncate'>{t('users.bulk_section.role')}</div>
                    </div>
                    {
                        usersToDisplay.length > 0 ?

                            usersToDisplay?.slice(usersSlice[0], usersSlice[1]).map((u: SelectExternalUser) => (
                                <div key={u.id} className='bulk-user-grid data-row col-template-step-2 h-14 px-4 body2'>
                                    <div className='flex flex-col truncate'>
                                        <span>{u.info?.displayName || ''}</span>
                                        {u.info?.mail && <span className='body3-medium'>{u.info?.mail}</span>}
                                    </div>
                                    <div className='truncate'>{u.info?.department || ''}</div>
                                    <div className='truncate'>{u.info?.jobTitle || ''}</div>
                                    <div>
                                        <BulkGridDropdown userId={u.id} storedRole={u.inviteUserModel?.roles || []} purpose={BulkGridDropdownType.Role} />
                                    </div>
                                </div>
                            )) : <div className='subtitle3-small w-full text-center mt-5'>{t('users.bulk_section.no_filter_results')}</div>
                    }
                </div>
            )
    );
}

export default UserBulkRoleStep;