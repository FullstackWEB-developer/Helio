import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import Pagination from '@components/pagination/pagination';
import {GetUserList} from '@constants/react-query-constants';
import {ChangeUserStatusRequest, Dictionary, InviteUserRequest, PagedList, Paging, UserDetail, UserDetailStatus, UserInvitationStatus} from '@shared/models';
import {changeUserStatus, getUsers, resendInvite} from '@shared/services/user.service';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import UserListNoResults from './user-list-no-results';
import UserListSearch from './user-list-search';
import UserListActions from './user-list-actions';
import UserFilter from './user-filter';
import './user-list.scss';
import {selectIsUsersFilterOpen, selectUserFilters, selectUsersPaging} from '../store/users.selectors';
import {setUsersPagination} from '../store/users.slice';
import queryString from 'query-string';
import {useHistory} from 'react-router';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {UserListCheckedState} from '../models/user-list-checked-state.model';
import utils from '@shared/utils/utils';

const UserList = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const paginationProperties = useSelector(selectUsersPaging);
    const isUserFilterOpen = useSelector(selectIsUsersFilterOpen);
    const filters = useSelector(selectUserFilters);
    const history = useHistory();
    const queryClient = useQueryClient();
    const [userSelected, setUserSelected] = useState<Dictionary<UserListCheckedState>>({});
    const [checkAll, setCheckAll] = useState(false);
    const isEditAccess = utils.hasPermission('Users.EditUserDetail');

    const {data, isFetching, refetch} = useQuery<PagedList<UserDetail>>([GetUserList, filters],
        () => getUsers(filters, paginationProperties.page, paginationProperties.pageSize),
        {
            onSuccess: (data) => {
                dispatch(setUsersPagination({
                    page: data.page,
                    pageSize: data.pageSize,
                    totalCount: data.totalCount,
                    totalPages: data.totalPages
                }));
            }
        });

    useEffect(() => {
        dispatch(setGlobalLoading(isFetching));
    }, [isFetching]);

    useEffect(() => {
        refetch();
    }, [paginationProperties.page]);

    useEffect(() => {
        history.replace({
            pathname: history.location.pathname,
            search: queryString.stringify({page: paginationProperties.page, ...filters})
        });
    }, [filters, history, paginationProperties.page]);

    const handlePageChange = (p: Paging) => {
        dispatch(setUsersPagination(p));
    }

    const displayInvitationStatus = (invitationStatus: UserInvitationStatus): string => {
        switch (invitationStatus) {
            case UserInvitationStatus.Accepted:
                return t('users.list_section.invitation_accepted');
            case UserInvitationStatus.Sent:
                return t('users.list_section.invitation_sent');
            default:
                return t('users.list_section.invitation_no_invite');
        }
    }

    const displaySnack = (type: SnackbarType, message: string) => {
        dispatch(addSnackbarMessage({
            type,
            message
        }));
    }

    const changeUserStatusMutation = useMutation(
        (payload: ChangeUserStatusRequest[]) => changeUserStatus(payload),
        {
            onSuccess: (_, variables) => {
                updateQueryDataOnStatusChangeSuccess(variables);
                if (variables.length === 1) {
                    const userName = findUserName(variables[0].id);
                    if (userName) {
                        displaySnack(SnackbarType.Success, t('users.list_section.status_change_success_user', {
                            name: userName
                        }));
                    }
                    else {
                        displaySnack(SnackbarType.Success, t('users.list_section.status_change_success_user_fallback'));
                    }
                }
                else {
                    displaySnack(SnackbarType.Success, t('users.list_section.status_change_success_multi'));
                }
            },
            onError: (_, variables) => {
                if (variables.length === 1) {
                    const userName = findUserName(variables[0].id);
                    if (userName) {
                        displaySnack(SnackbarType.Error, t('users.list_section.status_change_failure', {
                            name: userName
                        }));
                    }
                    else {
                        displaySnack(SnackbarType.Error, t('users.list_section.status_change_failure_fallback'));
                    }
                }
                else {
                    displaySnack(SnackbarType.Error, t('users.list_section.status_change_failure_multi'));
                }
            },
            onSettled: () => {
                setCheckAll(false);
                dispatch(setGlobalLoading(false));
            }
        });

    const findUserName = (id: string) => {
        const users: any = queryClient.getQueryData([GetUserList, filters]);
        if (users && users.results && users.results.length > 0) {
            const user: UserDetail = users.results.find((u: UserDetail) => u.id === id || u.email === id);
            if (user?.firstName || user?.lastName) {
                return `${user.firstName || ''} ${user.lastName || ''}`
            }
        }
        return '';
    }

    const handleStatusChange = (statuses: ChangeUserStatusRequest[]) => {
        changeUserStatusMutation.mutate(statuses);
    }

    const updateQueryDataOnStatusChangeSuccess = (variables: ChangeUserStatusRequest[]) => {
        const users: any = queryClient.getQueryData([GetUserList, filters]);
        if (users && users.results && users.results.length > 0) {
            variables.forEach(v => {
                users.results.find((u: UserDetail) => u.id === v.id).status = v.userStatus;
            });
        }
    }

    const resendInviteMutation = useMutation(
        (payload: InviteUserRequest) => resendInvite(payload),
        {
            onSuccess: (_, variables) => {
                if (variables.users.length === 1 && variables.users[0].email) {
                    const userName = findUserName(variables.users[0].email);
                    if (userName) {
                        displaySnack(SnackbarType.Success, t('users.list_section.resend_invite_success', {name: userName}));
                    }
                    else {
                        displaySnack(SnackbarType.Success, t('users.list_section.resend_invite_success_fallback'));
                    }
                }
                else {
                    displaySnack(SnackbarType.Success, t('users.list_section.resend_invite_success_multi'));
                }

            },
            onError: (_, variables) => {
                if (variables.users.length === 1 && variables.users[0].email) {
                    const userName = findUserName(variables.users[0].email);
                    if (userName) {
                        displaySnack(SnackbarType.Error, t('users.list_section.resend_invite_failure', {name: userName}));
                    }
                    else {
                        displaySnack(SnackbarType.Error, t('users.list_section.resend_invite_failure_fallback'));
                    }
                }
                else {
                    displaySnack(SnackbarType.Error, t('users.list_section.resend_invite_failure_multi'));
                }
            },
            onSettled: () => {
                setCheckAll(false);
                dispatch(setGlobalLoading(false));
            }
        }
    );

    const handleResendInvite = (resendInviteRequest: InviteUserRequest) => {
        resendInviteMutation.mutate(resendInviteRequest);
    }

    useEffect(() => {
        if (changeUserStatusMutation.isLoading || resendInviteMutation.isLoading) {
            dispatch(setGlobalLoading(true));
        }
    }, [changeUserStatusMutation.isLoading, resendInviteMutation.isLoading]);

    useEffect(() => {
        if (!data) {
            return;
        }

        const a = getUserSelected();
        setCheckAll(data.results.every(x => a.findIndex(i => i.checkboxCheckEvent.value === x.id && i.checkboxCheckEvent.checked) > -1));

    }, [data, data?.results]);

    const handleCheckboxChange = (e: CheckboxCheckEvent) => {
        if (!data) {
            return;
        }
        const user = data.results.find(p => p.id === e.value);
        if (!!user) {
            const checkedState = {
                checkboxCheckEvent: {value: user.id, checked: e.checked},
                userInvitationStatus: user.invitationStatus,
                userStatus: user.status,
                userEmail: user.email
            } as UserListCheckedState;
            const copy = {...userSelected, [e.value]: checkedState};
            setUserSelected(copy);
            const a = Object.values(copy);

            setCheckAll(data.results.every(x => a.findIndex(i => i.checkboxCheckEvent.value === x.id && i.checkboxCheckEvent.checked) > -1));
        }
    }

    const handleAllCheck = (e: CheckboxCheckEvent) => {
        const copy = {...userSelected};
        data?.results.forEach(user => {
            const userChecked = {
                checkboxCheckEvent: {value: user.id, checked: e.checked},
                userInvitationStatus: user.invitationStatus,
                userStatus: user.status,
                userEmail: user.email
            }
            copy[user.id] = userChecked;
        });
        setUserSelected(copy);
        setCheckAll(e.checked);
    }

    const getUserSelected = () => Object.values(userSelected);
    const getUserChecked = () => getUserSelected().filter(c => c.checkboxCheckEvent.checked).length;
    const atLeastOneChecked = getUserSelected().length > 0 ?
        getUserSelected()?.some(c => c.checkboxCheckEvent.checked) : false;

    const allCheckedUsersDisabled = atLeastOneChecked &&
        Object.values(userSelected)
            .filter((value) => value.checkboxCheckEvent.checked)
            .every((value) => value.userStatus === UserDetailStatus.Inactive);

    const allCheckedUsersEnabled = atLeastOneChecked &&
        Object.values(userSelected)
            .filter((value) => value.checkboxCheckEvent.checked)
            .every((value) => value.userStatus === UserDetailStatus.Active);

    const allCheckedUsersPending = atLeastOneChecked &&
        Object.values(userSelected)
            .filter((value) => value.checkboxCheckEvent.checked)
            .every((value) => value.userInvitationStatus === UserInvitationStatus.Sent);

    const handleMultiselectionStatusChange = (status: UserDetailStatus) => {
        const checkedUserValue = getUserSelected();

        const payload: ChangeUserStatusRequest[] = checkedUserValue && checkedUserValue.length > 0 ?
            checkedUserValue.filter(c => c.checkboxCheckEvent.checked).map(c => ({id: c.checkboxCheckEvent.value, userStatus: status})) : [];
        if (payload.length > 0) {
            changeUserStatusMutation.mutate(payload);
        }
    }

    const handleMultiselectionInvite = () => {
        const checkedUserValue = getUserSelected();

        const payload: InviteUserRequest = {
            users: checkedUserValue && checkedUserValue.length > 0 ?
                checkedUserValue.filter(c => c.checkboxCheckEvent.checked).map(c => ({email: c.userEmail})) : [],
            invitationMessage: ''
        }
        resendInviteMutation.mutate(payload);
    }

    const determineDisablePopupTitleTranslation = () => {
        const checkedUserValue = getUserSelected();

        if (checkedUserValue && checkedUserValue.length > 0) {
            const checkedCount = checkedUserValue.filter(c => c.checkboxCheckEvent.checked);
            if (checkedCount && checkedCount.length === 1) {
                const userName = findUserName(checkedCount[0].checkboxCheckEvent.value);
                return t('users.list_section.disable_modal_title_identity', {name: userName ?? t('common.user')});
            }
            return t('users.list_section.disable_modal_title');
        }
        return '';
    }

    const determineDisablePopupDescriptionTranslation = () => {
        const checkedUserValue = getUserSelected();
        if (checkedUserValue && checkedUserValue.length > 0) {
            const checkedCount = checkedUserValue.filter(c => c.checkboxCheckEvent.checked);
            if (checkedCount && checkedCount.length === 1) {
                const userName = findUserName(checkedCount[0].checkboxCheckEvent.value);
                return t('users.list_section.disable_modal_description_identity', {name: userName ?? t('common.user')});
            }
            else {
                return t('users.list_section.disable_modal_description');
            }
        }
        return '';
    }

    const isRowChecked = (userId: string): boolean => {
        return !!userSelected[userId] && (userSelected[userId].checkboxCheckEvent?.checked ?? false);
    }

    const isFiltered = () => {
        if (!filters) {
            return false;
        }
        if (filters && Object.keys(filters).length === 1 && filters.searchText === '') {
            return false;
        }
        return !!filters && Object.keys(filters).length > 0;
    }

    return (
        <div className='flex flex-auto h-full'>
            <UserFilter isOpen={isUserFilterOpen} />
            <div className='flex flex-col w-full py-6 overflow-x-hidden overflow-y-auto'>
                <div className='flex justify-between px-6'>
                    <h5>{t('users.list_section.title')}</h5>
                    {
                        paginationProperties.totalCount > 0 &&
                        <Pagination value={paginationProperties} onChange={handlePageChange} />
                    }
                </div>
                {
                    ((!data || !data.results || data.results.length === 0) && !isFetching) ?
                        <UserListNoResults /> : (
                            <>
                                <UserListSearch
                                    handleAllCheck={handleAllCheck}
                                    allChecked={checkAll}
                                    isFiltered={isFiltered()}
                                    displayActions={allCheckedUsersDisabled || allCheckedUsersEnabled || allCheckedUsersPending || false}
                                    displayDisableAction={allCheckedUsersEnabled || false}
                                    displayEnableAction={allCheckedUsersDisabled || false}
                                    displayResendInviteAction={allCheckedUsersPending || false}
                                    totalItemCount={paginationProperties.totalCount}
                                    itemSelectedCount={getUserChecked()}
                                    handleMultiselectionStatusChange={handleMultiselectionStatusChange}
                                    handleMultiselectionInvite={handleMultiselectionInvite}
                                    disableConfirmationTitle={determineDisablePopupTitleTranslation}
                                    disableConfirmationDescription={determineDisablePopupDescriptionTranslation} />
                                <div className="h-12 px-4 user-list-grid head-row caption-caps">
                                    <div></div>
                                    <div className='truncate'>{t('users.list_section.name')}</div>
                                    <div className='truncate'>{t('users.list_section.department')}</div>
                                    <div className='truncate'>{t('users.list_section.job_title')}</div>
                                    <div className='truncate'>{t('users.list_section.role')}</div>
                                    <div className='truncate'>{t('users.list_section.status')}</div>
                                    <div className='truncate'>{t('users.list_section.invite')}</div>
                                    <div className='truncate'></div>
                                </div>
                                {
                                    data && data.results?.map((u: UserDetail, index: number) => (
                                        <div key={u.id}
                                            className={`user-list-grid data-row px-6 body2 group ${isRowChecked(u.id) ? 'checked' : ''}`}>
                                            <div>
                                                <Checkbox
                                                    checked={isRowChecked(u.id)}
                                                    label=''
                                                    value={u.id}
                                                    className='pt-2'
                                                    name={`${u.id}-check`}
                                                    onChange={handleCheckboxChange}
                                                />
                                            </div>
                                            <div className='flex flex-col truncate'>
                                                <span>{`${u.firstName || ''} ${u.lastName || ''}${u.department ? ` | ${u.department}` : ''}`}</span>
                                                {u.email && <span className='body3-medium'>{u.email}</span>}
                                            </div>
                                            <div className='truncate'>
                                                {u.department || ''}
                                            </div>
                                            <div className='truncate'>
                                                {u.jobTitle || ''}
                                            </div>
                                            <div>
                                                {u.roles?.map((r, index) => `${r}${index === u.roles.length - 1 ? '' : ', '}`)}
                                            </div>
                                            <div className='truncate'>
                                                {
                                                    u.status ? t(`users.list_section.status_${u.status === 1 ? 'enabled' : 'disabled'}`) : null
                                                }
                                            </div>
                                            <div className='truncate'>
                                                {u.invitationStatus ? displayInvitationStatus(u.invitationStatus) : ''}
                                            </div>
                                            <div>
                                                {
                                                    isEditAccess && <UserListActions user={u} handleStatusChange={handleStatusChange} handleResendInvite={handleResendInvite} />
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        )
                }
            </div>
        </div>
    );
}

export default UserList;
