import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import Pagination from '@components/pagination/pagination';
import {GetUserList} from '@constants/react-query-constants';
import {ChangeUserStatusRequest, InviteUserRequest, Paging, UserDetail, UserDetailStatus, UserInvitationStatus} from '@shared/models';
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

const UserList = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const paginationProperties = useSelector(selectUsersPaging);
    const isUserFilterOpen = useSelector(selectIsUsersFilterOpen);
    const filters = useSelector(selectUserFilters);
    const history = useHistory();
    const queryClient = useQueryClient();

    const {data, isFetching, refetch} = useQuery([GetUserList, filters],
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
                displaySnack(SnackbarType.Success, t('users.list_section.status_change_success'));
            },
            onError: () => {
                displaySnack(SnackbarType.Error, t('users.list_section.status_change_failure'));
            },
            onSettled: () => {
                populateUserCheckboxArray();
                setCheckAll(false);
                dispatch(setGlobalLoading(false));
            }
        });

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
            onSuccess: () => {
                displaySnack(SnackbarType.Success, t('users.list_section.resend_invite_success'));
            },
            onError: () => {
                displaySnack(SnackbarType.Error, t('users.list_section.resend_invite_failure'));
            },
            onSettled: () => {
                populateUserCheckboxArray();
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

    const populateUserCheckboxArray = (checked = false) => {
        let checkedUserState: UserListCheckedState[] = [];
        if (data && data.results && data.results.length) {
            data.results.map((u: UserDetail) => checkedUserState.push(
                {
                    checkboxCheckEvent: {value: u.id, checked: checked},
                    userInvitationStatus: u.invitationStatus,
                    userStatus: u.status,
                    userEmail: u.email
                }));
        }
        setCheckedUserState(checkedUserState);
    }
    const [checkedUserState, setCheckedUserState] = useState<UserListCheckedState[]>();
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        populateUserCheckboxArray();
        setCheckAll(false);
    }, [data, data?.results]);

    const handleCheckboxChange = (e: CheckboxCheckEvent) => {
        if (checkedUserState && checkedUserState.length > 0) {
            const index = checkedUserState?.findIndex(c => c.checkboxCheckEvent.value === e.value);
            if (index !== -1) {
                const newCheckedUserState: UserListCheckedState[] = [...checkedUserState];
                newCheckedUserState[index] = {
                    ...newCheckedUserState[index],
                    checkboxCheckEvent: {
                        ...newCheckedUserState[index].checkboxCheckEvent,
                        checked: e.checked
                    }
                }

                setCheckedUserState(newCheckedUserState);
                setCheckAll(newCheckedUserState.every(c => c.checkboxCheckEvent.checked))
            }
        }
    }


    const handleAllCheck = (e: CheckboxCheckEvent) => {
        populateUserCheckboxArray(e.checked);
        setCheckAll(e.checked);
    }

    const atLeastOneChecked = checkedUserState && checkedUserState.length > 0 ?
        checkedUserState?.some(c => c.checkboxCheckEvent.checked) : false;

    const allCheckedUsersDisabled = atLeastOneChecked &&
        checkedUserState?.filter(c => c.checkboxCheckEvent.checked)?.every(c => c.userStatus === UserDetailStatus.Inactive);
    const allCheckedUsersEnabled = atLeastOneChecked &&
        checkedUserState?.filter(c => c.checkboxCheckEvent.checked)?.every(c => c.userStatus === UserDetailStatus.Active);
    const allCheckedUsersPending = atLeastOneChecked &&
        checkedUserState?.filter(c => c.checkboxCheckEvent.checked)?.every(c => c.userInvitationStatus === UserInvitationStatus.Sent);

    const handleMultiselectionStatusChange = (status: UserDetailStatus) => {
        const payload: ChangeUserStatusRequest[] = checkedUserState && checkedUserState.length > 0 ?
            checkedUserState.filter(c => c.checkboxCheckEvent.checked).map(c => ({id: c.checkboxCheckEvent.value, userStatus: status})) : [];
        if (payload.length > 0) {
            changeUserStatusMutation.mutate(payload);
        }
    }

    const handleMultiselectionInvite = () => {
        const payload: InviteUserRequest = {
            users: checkedUserState && checkedUserState.length > 0 ?
                checkedUserState.filter(c => c.checkboxCheckEvent.checked).map(c => ({email: c.userEmail})) : [],
            invitationMessage: ''
        }
        resendInviteMutation.mutate(payload);
    }

    return (
        <div className='flex flex-auto h-full'>
            <UserFilter isOpen={isUserFilterOpen} />
            <div className='flex flex-col w-full py-6 overflow-y-auto overflow-x-hidden'>
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
                                    displayActions={allCheckedUsersDisabled || allCheckedUsersEnabled || allCheckedUsersPending || false}
                                    displayDisableAction={allCheckedUsersEnabled || false}
                                    displayEnableAction={allCheckedUsersDisabled || false}
                                    displayResendInviteAction={allCheckedUsersPending || false}
                                    handleMultiselectionStatusChange={handleMultiselectionStatusChange}
                                    handleMultiselectionInvite={handleMultiselectionInvite} />
                                <div className="user-list-grid head-row caption-caps h-12 px-4">
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
                                            className={`user-list-grid data-row h-14 px-4 body2 group ${checkedUserState && checkedUserState[index]?.checkboxCheckEvent?.checked ? 'checked' : ''}`}>
                                            <div>
                                                <Checkbox checked={checkedUserState && checkedUserState[index]?.checkboxCheckEvent?.checked}
                                                    label='' value={u.id} className='pt-2' name={`${u.id}-check`} onChange={handleCheckboxChange} />
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
                                                <UserListActions user={u} handleStatusChange={handleStatusChange} handleResendInvite={handleResendInvite} />
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