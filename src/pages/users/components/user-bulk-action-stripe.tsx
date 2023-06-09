import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import SearchInputField from '@components/search-input-field/search-input-field';
import SvgIcon, {Icon} from '@components/svg-icon';
import {GetExternalUserList} from '@constants/react-query-constants';
import {ExternalUser, InviteUserModel, SelectExternalUser} from '@shared/models';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQueryClient} from 'react-query';
import {useSelector, useDispatch} from 'react-redux';
import {BulkAddStep} from '../models/bulk-add-step.enum';
import {
    selectBulkFilters,
    selectExternalUsersSelection,
    selectIsBulkLocalUsersFiltered,
    selectIsBulkUsersFiltered,
    selectIsBulkUsersFilterOpen,
    selectIsLocalBulkFilterOpen,
    selectLocalBulkFilters
} from '../store/users.selectors';
import {clearAllExternalUsersSelectionOnCurrentPage, selectAllExternalUsersOnCurrentPage, setBulkUserFilters, setIsBulkFilterOpen, setIsLocalBulkFilterOpen, setLocalBulkFilters} from '../store/users.slice';
import FilterDot from '@components/filter-dot/filter-dot';
import {setIsCallsLogFiltered} from '@pages/calls-log/store/calls-log.slice';

const UserBulkActionStripe = ({currentStep}: {currentStep: BulkAddStep}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const isBulkFilterOpen = useSelector(selectIsBulkUsersFilterOpen);
    const isLocalBulkFilterOpen = useSelector(selectIsLocalBulkFilterOpen);
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const filters = useSelector(currentStep > BulkAddStep.Selection ? selectLocalBulkFilters : selectBulkFilters);
    const queryClient = useQueryClient();
    const isFiltered = useSelector(selectIsBulkUsersFiltered);
    const isLocalFiltered = useSelector(selectIsBulkLocalUsersFiltered);
    const [searchText, setSearchText] = useState('');
    const currentPageUsers: any = queryClient.getQueryData([GetExternalUserList, filters]);
    const handleSelectAllCheckboxChange = (e: CheckboxCheckEvent) => {

        if (currentPageUsers?.results?.length > 0) {
            if (e.checked) {

                let payload: ExternalUser[] = [];
                currentPageUsers?.results?.forEach((u: ExternalUser) => {
                    if (!selectedExternalUsers?.find((selectedUser: SelectExternalUser) =>
                        selectedUser?.id === u?.azureId) && !!u?.mail) {
                        payload.push(u);
                    }
                });
                if (payload.length > 0) {
                    dispatch(selectAllExternalUsersOnCurrentPage(payload.map((u: ExternalUser) => {
                        const inviteModel: InviteUserModel = {
                            email: u.mail,
                            ...(u?.givenName && {firstName: u?.givenName}),
                            ...(u?.surname && {lastName: u?.surname})
                        }
                        return {
                            id: u.azureId,
                            inviteUserModel: inviteModel,
                            info: u
                        }
                    }
                    )));
                }
            }
            else {
                let payload: string[] = [];
                currentPageUsers?.results?.forEach((u: ExternalUser) => {
                    if (selectedExternalUsers?.find((selectedUser: SelectExternalUser) =>
                        selectedUser?.id === u?.azureId && !!selectedUser.inviteUserModel.email)) {
                        payload.push(u.azureId);
                    }
                });
                if (payload.length > 0) {
                    dispatch(clearAllExternalUsersSelectionOnCurrentPage(payload));
                }
            }
        }
    }

    const areAllSelectedOnPage = currentPageUsers?.results
        ?.filter((u: ExternalUser) => !!u.mail && !!u.azureId)
        ?.every((u: ExternalUser) => selectedExternalUsers.findIndex(user => user.id === u.azureId) !== -1);

    const search = (searchOnClear = false) => {
        dispatch(
            currentStep > BulkAddStep.Selection ?
                setLocalBulkFilters({filters: {...filters, searchText: searchOnClear ? '' : searchText}, resetPagination: true}) :
                setBulkUserFilters({filters: {...filters, searchText: searchOnClear ? '' : searchText}, resetPagination: true})
        );
    }

    const determineProperCountWording = () => {
        return selectedExternalUsers.length === 0 || selectedExternalUsers.length > 1 ?
            t('users.bulk_section.x_users_selected_plural', {count: selectedExternalUsers.length}) :
            t('users.bulk_section.x_users_selected_singular')
    }

    useEffect(() => {
        setSearchText('');
    }, [currentStep])

    useEffect(() => {
        if (filters?.searchText) {
            setSearchText(filters.searchText);
        }
        return () => {
            dispatch(setIsCallsLogFiltered(false));
        }
    }, [dispatch]);

    return (
        <div className='flex h-14 px-4 border-t border-b'>
            <div className='md:w-1/6 truncate'>
                {
                    currentStep > BulkAddStep.Selection ?
                        <div className='subtitle2 pt-4'>{determineProperCountWording()}</div> :
                        <Checkbox data-testid='bulk-check-all' name='bulk-check-all' truncate={true}
                            label={determineProperCountWording()}
                            className='pt-4'
                            checked={areAllSelectedOnPage}
                            onChange={handleSelectAllCheckboxChange} />
                }
            </div>
            <div className='md:w-1/6 border-r border-l'>
                <SearchInputField
                    dataTestId='search'
                    wrapperClassNames='relative h-full w-1/6'
                    hasBorderBottom={false}
                    placeholder={'users.search'}
                    onChange={(value: string) => {setSearchText(value)}}
                    onClear={() => {setSearchText(''); search(true)}}
                    value={searchText}
                    onKeyDown={(e) => {if (e.key === keyboardKeys.enter) {search()} }}
                    iconOnClick={() => search()}
                    onBlur={() => {
                        if (!searchText.length && filters?.searchText) {
                            setSearchText(filters?.searchText)
                        }
                    }}
                />
            </div>
            <div className='flex items-center pl-6 body2'>
                <div className='relative'>
                    <SvgIcon type={Icon.FilterList}
                             className='icon-medium cursor-pointer mr-4'
                             onClick={() => dispatch(currentStep !== BulkAddStep.Selection ? setIsLocalBulkFilterOpen(!isLocalBulkFilterOpen) : setIsBulkFilterOpen(!isBulkFilterOpen))}
                             fillClass='filter-icon' />
                            {(currentStep > BulkAddStep.Selection ? isLocalFiltered : isFiltered) && <div className='absolute bottom-0.5 right-5'>
                        <FilterDot />
                    </div>}
                </div>
                {t('common.filters')}
            </div>
        </div>
    )
}

export default UserBulkActionStripe;
