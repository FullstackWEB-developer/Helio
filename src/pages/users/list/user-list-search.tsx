import {UsersPath} from '@app/paths';
import Button from '@components/button/button';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import Confirmation from '@components/confirmation/confirmation';
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
const UserListSearch = ({handleAllCheck, allChecked, displayActions,
    displayDisableAction, displayEnableAction, displayResendInviteAction,
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
        return <>
            {
                displayResendInviteAction &&
                <Button label={'users.list_section.resend_invite'} buttonType='secondary' className='mr-6'
                    onClick={handleMultiselectionInvite} />
            }
            {
                displayDisableAction && <Button label={'users.list_section.disable'}
                    buttonType='secondary' onClick={() => {setDisableConfirmationOpen(true);}} />
            }
            {
                displayEnableAction && <Button label={'users.list_section.enable'} buttonType='secondary'
                    onClick={() => handleMultiselectionStatusChange(UserDetailStatus.Active)} />
            }
        </>
    }
    return (
        <div className='flex w-full mt-4 border-t border-b h-14'>
            <div className={`flex flex-row items-center ${!displayActions ? 'border-r' : ''}`}>
                <Checkbox checked={allChecked} name='select-all-users' label='' className='w-5 pt-2 mx-6' onChange={handleAllCheck} />
                {
                    displayActions ? displayApplicableActions() :
                        (
                            <>
                                <SvgIcon type={Icon.FilterList}
                                    className='mr-6 cursor-pointer icon-medium'
                                    onClick={() => dispatch(setIsFilterOpen(!isOpen))}
                                    fillClass='filter-icon' />
                                <SvgIcon type={Icon.Add} onClick={() => history.push(`${UsersPath}/new`)}
                                    className='mr-6 cursor-pointer icon-medium'
                                    fillClass='add-icon' />
                            </>
                        )
                }
            </div>
            {
                !displayActions &&
                <SearchInputField
                    wrapperClassNames='relative w-full h-full'
                    hasBorderBottom={false}
                    onChange={(value: string) => {setSearchText(value)}}
                    onClear={() => {setSearchText(''); search(true)}}
                    value={searchText}
                    onKeyDown={(e) => {if (e.key === keyboardKeys.enter) {search()} }}
                    iconOnClick={() => search()}
                />
            }
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
