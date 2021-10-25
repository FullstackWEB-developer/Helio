import {UsersPath} from '@app/paths';
import Button from '@components/button/button';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import Confirmation from '@components/confirmation/confirmation';
import FilterDot from '@components/filter-dot/filter-dot';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import SearchInputField from '@components/search-input-field/search-input-field';
import SvgIcon, {Icon} from '@components/svg-icon';
import {UserDetailStatus} from '@shared/models';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router';
import {selectIsUsersFilterOpen, selectUserFilters} from '../store/users.selectors';
import {setIsFilterOpen, setUserFilters} from '../store/users.slice';

interface UserListSearchProps {
    handleAllCheck: (e: CheckboxCheckEvent) => void,
    isFiltered: boolean,
    totalItemCount: number,
    itemSelectedCount: number,
    allChecked: boolean,
    displayActions: boolean,
    displayDisableAction: boolean,
    displayEnableAction: boolean,
    displayResendInviteAction: boolean,
    handleMultiselectionStatusChange: (status: UserDetailStatus) => void,
    handleMultiselectionInvite: () => void,
    disableConfirmationTitle: () => string,
    disableConfirmationDescription: () => string
}
const UserListSearch = ({handleAllCheck,
    allChecked,
    displayActions,
    displayDisableAction,
    displayEnableAction,
    displayResendInviteAction,
    itemSelectedCount,
    totalItemCount,
    isFiltered,
    handleMultiselectionStatusChange, handleMultiselectionInvite, disableConfirmationTitle, disableConfirmationDescription}: UserListSearchProps) => {

    const history = useHistory();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const isOpen = useSelector(selectIsUsersFilterOpen);
    const filters = useSelector(selectUserFilters);
    const [searchText, setSearchText] = useState(filters?.searchText);
    const search = (searchOnClear = false) => {
        dispatch(setUserFilters({filters: {...filters, searchText: searchOnClear ? '' : searchText}, resetPagination: true}))
    }
    const [disableConfirmationOpen, setDisableConfirmationOpen] = useState(false);

    const onDisableCancel = () => {
        setDisableConfirmationOpen(false);
    }

    const onDisableConfirm = () => {
        handleMultiselectionStatusChange(UserDetailStatus.Inactive);
        onDisableCancel();
    }

    const displayApplicableActions = () => {
        return <div className='flex flex-row items-center h-full px-6 border-l'>
            {displayResendInviteAction &&
                <Button
                    label='users.list_section.resend_invite'
                    buttonType='secondary'
                    className='mr-6 whitespace-nowrap'
                    onClick={handleMultiselectionInvite}
                />
            }
            {displayDisableAction &&
                <Button
                    label='users.list_section.disable'
                    buttonType='secondary'
                    className='mr-6'
                    onClick={() => {setDisableConfirmationOpen(true);}}
                />
            }
            {displayEnableAction &&
                <Button
                    label='users.list_section.enable'
                    buttonType='secondary'
                    className='mr-6'
                    onClick={() => handleMultiselectionStatusChange(UserDetailStatus.Active)}
                />
            }
        </div>
    }
    return (
        <div className='flex w-full mt-4 border-t border-b h-14 user-list-search-stripe'>
            <div className='flex flex-row items-center border-r'>
                <Checkbox checked={allChecked} name='select-all-users' label='' className='w-5 pt-2 mx-6' onChange={handleAllCheck} />
                {itemSelectedCount > 0 &&
                    <span className='subtitle2 mr-9'>
                        {t('users.list_section.selected_count', {selectedCount: itemSelectedCount, totalCount: totalItemCount})}
                    </span>
                }
            </div>
            <div className='w-1/6 border-r'>
                <SearchInputField
                    wrapperClassNames='relative h-full'
                    hasBorderBottom={false}
                    onChange={(value: string) => {setSearchText(value)}}
                    onClear={() => {setSearchText(''); search(true)}}
                    value={searchText}
                    onKeyDown={(e) => {if (e.key === keyboardKeys.enter) {search()} }}
                    iconOnClick={() => search()}
                    placeholder='users.list_section.placeholder_search'
                />
            </div>
            <div className='flex flex-row items-center ml-6'>
                <div className='relative flex flex-row items-center'>
                    <SvgIcon
                        type={Icon.FilterList}
                        className='mr-6 cursor-pointer icon-medium'
                        onClick={() => dispatch(setIsFilterOpen(!isOpen))}
                        fillClass='filter-icon'
                    />
                    {isFiltered &&
                        <div className='absolute bottom-0.5 right-6'>
                            <FilterDot />
                        </div>
                    }
                </div>
                {!displayActions &&
                    <SvgIcon
                        type={Icon.Add}
                        onClick={() => history.push(`${UsersPath}/new`)}
                        className='mr-6 cursor-pointer icon-medium'
                        fillClass='add-icon'
                    />
                }
                {displayActions &&

                    displayApplicableActions()
                }
            </div>
            <div className='absolute top-0 w-1/3 left-1/3'>
                <Confirmation title={disableConfirmationTitle()}
                    message={disableConfirmationDescription()}
                    hasOverlay={true}
                    okButtonLabel={t('users.list_section.disable')} isOpen={disableConfirmationOpen}
                    onOk={onDisableConfirm} onCancel={onDisableCancel} onClose={onDisableCancel} />
            </div>
        </div>
    )
}

export default UserListSearch;
