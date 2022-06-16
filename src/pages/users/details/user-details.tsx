import Avatar from "@components/avatar";
import Button from "@components/button/button";
import StatusDotLabel from '@components/status-dot-label';
import {UserStatus} from "@shared/store/app-user/app-user.models";
import {useForm} from "react-hook-form";
import {ControlledCheckbox, ControlledInput, ControlledSelect} from "@components/controllers";
import React, {useEffect, useMemo, useState} from "react";
import {getProviders} from "@shared/services/lookups.service";
import {useDispatch, useSelector} from "react-redux";
import {selectForwardToOptions, selectProviderList, selectRoleList} from "@shared/store/lookups/lookups.selectors";
import utils from "@shared/utils/utils";
import {
    changeUserStatus,
    getCallForwardingTypeWithState,
    getConnectUser,
    getRoleWithState,
    getUserDetailExtended,
    getUserMobilePhone,
    updateCallForwarding,
    updateUser
} from "@shared/services/user.service";
import {useHistory, useParams} from 'react-router';
import {useMutation, useQuery} from "react-query";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {GetMobilePhone, GetUserConnect, GetUserExtended} from "@constants/react-query-constants";
import {
    CallForwardingDetail,
    CallForwardingType,
    ConnectUser,
    RoleBase,
    UserDetailExtended,
    UserDetailStatus,
    UserRole
} from "@shared/models";
import Spinner from '@components/spinner/Spinner';
import {DATE_LONG_FORMAT} from "@constants/form-constants";
import {
    authenticationSelector,
    selectAppUserDetails,
    selectLiveAgentStatuses
} from "@shared/store/app-user/appuser.selectors";
import {addSnackbarMessage} from "@shared/store/snackbar/snackbar.slice";
import {SnackbarType} from "@components/snackbar/snackbar-type.enum";
import {useTranslation} from "react-i18next";
import ProviderMappingToolTip from "../components/provider-tool-tip";
import './user-details.scss';
import {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import useCheckPermission from "@shared/hooks/useCheckPermission";
import {NotAuthorizedPath} from "@app/paths";
import UserNotificationPreference from "../components/user-notifications-toggle";
import {UserNotificationPreferences} from "@shared/models/user-notification-preferences.enum";
import {setAppUserDetails} from "@shared/store/app-user/appuser.slice";
import {setUserList} from "@shared/store/lookups/lookups.slice";

dayjs.extend(utc);

const UserDetails = () => {

    const {t} = useTranslation();
    const {control, handleSubmit, watch, formState, setValue, getValues, reset, clearErrors} = useForm({
        shouldUnregister: false,
        mode: "all"
    });

    const dispatch = useDispatch();
    const providers = useSelector(selectProviderList);
    const forwardToTypes = useSelector(selectForwardToOptions);
    const rolesList = useSelector(selectRoleList);
    const usersLiveStatus = useSelector(selectLiveAgentStatuses);
    const [userLiveStatus, setUserLiveStatus] = useState(UserStatus.Offline);
    const {userId} = useParams<{userId: string}>();
    const [userDetailExtended, setUserDetailExtended] = useState<UserDetailExtended>();
    const forwardToSelected = Number(watch('forward_to')) as CallForwardingType;
    const [isForwardEnabled, setIsForwardEnabled] = useState(false);
    const forwardValuePhone = watch('forward_to_value_phone') as string;
    const forwardValueAgent = watch('forward_to_value_agent') as string;
    const [connectUserList, setConnectUserList] = useState<ConnectUser[]>([]);
    const currentUserStatus = userDetailExtended?.user.status;
    const canEditUser = useCheckPermission('Users.EditUserDetail');
    const [userProvider, setUserProvider] = useState('');
    const [isSomeUserRoleChecked, setIsSomeUserRoleChecked] = useState(false);
    const user = useSelector(authenticationSelector);
    const history = useHistory();

    const rolesSorted = useMemo(() => {
        if (!rolesList || rolesList.length < 1) {
            return [];
        }
        const sorted = [...rolesList];
        sorted.sort((a, b) => {
            const aOrder = UserRole[a.name as keyof typeof UserRole] ?? 99;
            const bOrder = UserRole[b.name as keyof typeof UserRole] ?? 99;
            return aOrder - bOrder;
        });
        return sorted;
    }, [rolesList]);

    const connectUserOptions = useMemo(() =>
        utils.parseOptions(connectUserList,
            item => item.displayName,
            item => item.userName
        ), [connectUserList]);

    const providerOptions = useMemo(() =>
        utils.parseOptions(providers,
            item => utils.stringJoin(' ', item.firstName, item.lastName),
            item => item.id.toString()
        ), [providers]);

    const forwardToOptions = useMemo(() =>
        utils.parseOptions(forwardToTypes,
            item => item.value,
            item => item.key.toString()
        ), [forwardToTypes]);


    const {refetch: mobilePhoneRefetch, isLoading: isMobilePhoneLoading, isFetching: isMobilePhoneFetching} = useQuery([GetMobilePhone, forwardToSelected, forwardValuePhone],
        () => getUserMobilePhone(userDetailExtended?.user.id ?? ''),
        {
            enabled: false,
            onSuccess: (data) => {
                setValue('forward_to_value_phone', data.mobilePhoneNumber, {shouldDirty: true, shouldValidate: true});
            }
        });

    useEffect(() => {
        if (!!user.id && !canEditUser && userId !== user.id) {
            history.replace(NotAuthorizedPath);
        }
    }, [canEditUser, history, user, userId]);

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getCallForwardingTypeWithState);
        dispatch(getRoleWithState);
    }, [dispatch]);

    useEffect(() => {
        const phone = getValues('forward_to_value_phone');
        if (forwardToSelected === CallForwardingType.Phone && !phone) {
            mobilePhoneRefetch();
        }
    }, [forwardToSelected, getValues, mobilePhoneRefetch])

    const loadUserData = (data: UserDetailExtended) => {
        const user = data.user;
        const statusResult = usersLiveStatus.find(x => x.userId === user.id);

        if (user.providerId) {
            setValue('provider', user.providerId.toString());
            if (!canEditUser) {
                const currentProvider = providers?.find(p => p.id === user.providerId)?.displayName;
                if (currentProvider) {
                    setUserProvider(currentProvider);
                }
            }
        }

        if (statusResult) {
            setUserLiveStatus(user.latestConnectStatus as UserStatus ?? UserStatus.Offline);
        }
        if (user.callForwardingEnabled) {
            setValue('enable_forward', {value: undefined, checked: true});
            setIsForwardEnabled(true);
        }

        if (user.callForwardingType) {
            setValue('forward_to', user.callForwardingType.toString());
            if (parseInt(user.callForwardingType.toString()) === CallForwardingType.Agent) {
                setValue('forward_to_value_agent', user.callForwardingValue);
            } else {
                setValue('forward_to_value_phone', user.callForwardingValue);
            }
        }

        for (const role of user?.roles) {
            setValue(`userrole_${role}`, {value: role, checked: true}, {shouldDirty: false, shouldValidate: false});
        }

        setIsSomeUserRoleChecked(getIsSomeUserRoleChecked);
    }
    const {isLoading, isFetching, isError} = useQuery([GetUserExtended, userId],
        () => getUserDetailExtended(userId),
        {
            refetchOnMount: 'always',
            onSuccess: data => {
                setUserDetailExtended(data);
                loadUserData(data);
            }
        });

    const {isLoading: isConnectLoading, isFetching: isConnectFetching} = useQuery([GetUserConnect],
        () => getConnectUser(),
        {
            enabled: true,
            onSuccess: data => {
                setConnectUserList(data);
            }
        });

    const showMessage = (type: SnackbarType, message: string) => {
        dispatch(addSnackbarMessage({
            type: type,
            message: message
        }));
    }

    const getIsSomeUserRoleChecked = () => {
        return rolesList.some(userRole => {
            const role = getValues(`userrole_${userRole.name}`);
            return role && role.checked;
        });
    }

    const onUserRoleChanged = () => {
        setIsSomeUserRoleChecked(getIsSomeUserRoleChecked);
    }

    const getUserRole = (role: RoleBase) => {
        if (canEditUser) {
            return <ControlledCheckbox
                control={control}
                label={t(`users.role_${role.name.toLowerCase()}`)}
                name={`userrole_${role.name}`}
                value={role.name}
                onChange={onUserRoleChanged}
            />
        } else {
            const userRole = getValues(`userrole_${role.name}`);
            if (userRole && userRole.checked) {
                return <div className='body2'>
                    {t(`users.role_${role.name.toLowerCase()}`)}
                </div>
            }
        }
    }

    const storedUserData = useSelector(selectAppUserDetails)
    const updateMutation = useMutation(updateUser, {
        onSuccess: (data) => {
            const updatedUserDetail = {...userDetailExtended!, user: data};
            setUserDetailExtended(updatedUserDetail);
            reset();
            loadUserData(updatedUserDetail);
            showMessage(SnackbarType.Success, 'users.user_update_success');
            setCurrentlyUpdatingNotificationPreference(undefined);
            dispatch(setAppUserDetails({
                ...storedUserData,
                callNotification: data.callNotification,
                smsNotification: data.smsNotification,
                emailNotification: data.emailNotification,
                chatNotification: data.chatNotification,
            }));
        },
        onError: () => {
            showMessage(SnackbarType.Error, 'users.user_update_error');
            setCurrentlyUpdatingNotificationPreference(undefined);
        }
    });

    const updateCallForwardingMutation = useMutation(updateCallForwarding, {
        onSuccess: () => {
            if (userDetailExtended) {
                userDetailExtended.user.callForwardingEnabled = getValues('enable_forward').checked;
                const userCallForwardingType = getValues('forward_to');
                userDetailExtended.user.callForwardingType = userCallForwardingType;

                if (parseInt(userCallForwardingType) === CallForwardingType.Agent) {
                    userDetailExtended.user.callForwardingValue = getValues('forward_to_value_agent');
                } else {
                    userDetailExtended.user.callForwardingValue = getValues('forward_to_value_phone');
                }

                setUserDetailExtended(userDetailExtended);
                reset({
                    enable_forward: undefined
                });
                loadUserData(userDetailExtended);
            }
            showMessage(SnackbarType.Success, 'users.user_update_success');
        },
        onError: () => {
            showMessage(SnackbarType.Error, 'users.user_update_error');
        }
    });

    const getNextStatus = () => {
        return currentUserStatus === UserDetailStatus.Active ? UserDetailStatus.Inactive : UserDetailStatus.Active;
    }

    const changeUserStatusMutation = useMutation(
        (param: {userId: string, userStatus: UserDetailStatus}) => changeUserStatus([{id: param.userId, userStatus: param.userStatus}]),
        {
            onSuccess: () => {
                const data = {...userDetailExtended!};
                data.user.status = getNextStatus();
                dispatch(setUserList([]));
                setUserDetailExtended(data);
                showMessage(SnackbarType.Success, t('users.user_update_success'));
            },
            onError: () => {
                showMessage(SnackbarType.Error, t('users.user_update_error'));
            }
        });


    const changeStatus = () => {
        if (!userDetailExtended) {
            return;
        }
        const user = userDetailExtended.user;
        const newStatus = getNextStatus();
        changeUserStatusMutation.mutate({userId: user.id, userStatus: newStatus});
    }

    const onChangeEnableForward = (event: CheckboxCheckEvent) => {
        setIsForwardEnabled(event.checked);
        if(!event.checked) {
            clearErrors('forward_to_value_phone');
        }
    }

    const saveUser = (formData: any) => {
        if (!userDetailExtended) {
            return;
        }
        const user = userDetailExtended.user;
        const roles: string[] = []
        if (formData.enable_forward) {
            user.callForwardingEnabled = formData.enable_forward.checked;
        }

        if (formData.forward_to) {
            user.callForwardingType = formData.forward_to;
            if (formData.forward_to === CallForwardingType.Agent.toString()) {
                user.callForwardingValue = formData.forward_to_value_agent;
            } else {
                user.callForwardingValue = formData.forward_to_value_phone;
            }
        }

        Object.keys(formData)
            .filter(p => p.includes('userrole'))
            .map(p => formData[p])
            .forEach(role => {
                if (role && role.checked) {
                    roles.push(role.value);
                }
            });

        const diff = roles.filter(x => !user?.roles.includes(x)).concat(user.roles?.filter(x => !roles.includes(x)))
        let isRolesChanged = false;
        if (diff.length > 0) {
            user.roles = roles;
            isRolesChanged = true;
        }
        user.providerId = formData.provider && Number(formData.provider);

        updateMutation.mutate(user, {
            onSuccess: () => {
                if (isRolesChanged) {
                    showMessage(SnackbarType.Info, 'users.user_update_role');
                }
            }
        });
    }

    const saveCallForwarding = (formData: any) => {
        if (!userId) {
            return;
        }

        const callForwardingDetail: CallForwardingDetail = {
            callForwardingEnabled: false
        }

        if (formData.enable_forward) {
            callForwardingDetail.callForwardingEnabled = formData.enable_forward.checked;
        }

        if (formData.forward_to) {
            callForwardingDetail.callForwardingType = formData.forward_to;
            if (formData.forward_to === CallForwardingType.Agent.toString()) {
                callForwardingDetail.callForwardingValue = formData.forward_to_value_agent;
            } else {
                callForwardingDetail.callForwardingValue = formData.forward_to_value_phone;
            }
        }

        updateCallForwardingMutation.mutate(callForwardingDetail);
    }

    const [currentlyUpdatingNotificationPreference, setCurrentlyUpdatingNotificationPreference] = useState<UserNotificationPreferences | undefined>(undefined); 
    const onNotificationToggleSwitch = (checked: boolean, notificationType: UserNotificationPreferences) => {
        if (userDetailExtended?.user) {
            setCurrentlyUpdatingNotificationPreference(notificationType);
            updateMutation.mutate({...userDetailExtended.user, [`${notificationType}Notification`]: checked});
        }
    }

    if (isError) {
        return (
            <div className="px-6 py-8">
                <h6 className='text-danger'>{t('users.not_found')}</h6>
            </div>
        );
    }

    if (isLoading || isFetching || isConnectLoading || isConnectFetching) {
        return <Spinner fullScreen />;
    }

    const isButtonDisabled = () => {
        return !formState.isDirty ||
            !isSomeUserRoleChecked ||
            !!formState.errors['forward_to_value_phone']?.message ||
            !!formState.errors['forward_to_value_agent']?.message ||
            isMobilePhoneLoading ||
            isMobilePhoneFetching ||
            (isForwardEnabled && !forwardToSelected) ||
            (isForwardEnabled && forwardToSelected && !forwardValuePhone && forwardToSelected === CallForwardingType.Phone) ||
            (isForwardEnabled && forwardToSelected && !forwardValueAgent && forwardToSelected === CallForwardingType.Agent);
    }

    return (
        <div className='flex flex-row w-full px-6 py-8 overflow-y-auto user-details'>
            <div className='flex flex-col items-center pr-10 user-details-sidebar'>
                <Avatar
                    className='w-40 h-40'
                    labelClassName='avatar-label'
                    userPicture={userDetailExtended?.user.profilePicture}
                    userFullName={utils.stringJoin(' ', userDetailExtended?.user.firstName, userDetailExtended?.user.lastName)}
                />

                <StatusDotLabel
                    status={userLiveStatus}
                    label={userLiveStatus.toString()}
                    className='mt-4'
                />

                {
                    canEditUser &&
                    <div className='flex flex-col self-start mt-5 body3-medium'>
                        <span className='mb-1'>
                            <span>{t('users.info_section.created_by')}</span>
                            <span className='pl-0.5'>{userDetailExtended?.user.createdByName ?? '-'}</span>
                        </span>
                        <span className='mb-1'>
                            <span>{t('users.info_section.created_on')}</span>
                            <span className='pl-0.5'>{dayjs.utc(userDetailExtended?.user.createdOn).local().format(DATE_LONG_FORMAT)}</span>
                        </span>
                        <span className='mb-1'>
                            <span>{t('users.info_section.modified_by')}</span>
                            <span className='pl-0.5'>{userDetailExtended?.user.modifiedByName ?? '-'} </span>
                        </span>
                        <span className='mb-1'>
                            <span>{t('users.info_section.modified_on')}</span>
                            <span className='pl-0.5'>{dayjs.utc(userDetailExtended?.user.modifiedOn).local().format(DATE_LONG_FORMAT)}</span>
                        </span>
                    </div>
                }
            </div>
            <div className='flex flex-col w-full'>
                <div className='flex flex-row items-center justify-between pb-5 border-b'>
                    <div className='flex flex-col'>
                        <h5>{utils.stringJoin(' ', userDetailExtended?.user.firstName, userDetailExtended?.user.lastName)}</h5>
                        <label className='mt-4 body1'>{userDetailExtended?.user.jobTitle}</label>
                    </div>
                    <div className="flex flex-row">
                        <Button
                            type='button'
                            buttonType='medium'
                            label='common.save'
                            className='mr-5'
                            disabled={isButtonDisabled()}
                            isLoading={updateMutation.isLoading}
                            onClick={() => canEditUser ? handleSubmit(saveUser)() : handleSubmit(saveCallForwarding)()}
                        />
                        {
                            canEditUser &&
                            <Button
                                type='button'
                                buttonType='secondary-medium'
                                isLoading={changeUserStatusMutation.isLoading}
                                label={currentUserStatus === UserDetailStatus.Active ? 'common.disable' : 'common.enable'}
                                onClick={changeStatus}
                            />
                        }
                    </div>
                </div>
                <div className='flex flex-col pt-5'>
                    <div className='flex flex-col'>
                        <label className='subtitle'>{t('users.info_section.title')}</label>
                        <div className='flex flex-col mt-5'>
                            <span className='body2-medium'>
                                <span>{t('users.info_section.email')}</span>
                                <span className='body2 pl-0.5'>{userDetailExtended?.user.email}</span></span>
                            {userDetailExtended?.user.department &&
                                <span className='body2-medium'>
                                    <span>{t('users.info_section.department')}</span>
                                    <span className='body2 pl-0.5'>{userDetailExtended?.user.department}</span>
                                </span>
                            }
                        </div>
                    </div>

                    <div className='flex flex-row mt-5 pr-28'>
                        <div className='flex flex-col flex-1 pr-4'>
                            <label className='subtitle'>{t('users.role')}</label>
                            <div className='mt-6'>
                                {
                                    React.Children.toArray(
                                        rolesSorted.map(role => getUserRole(role)
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className='flex-1 pl-4'>
                            <label className='subtitle'>{t('users.ehr_settings')}</label>
                            {
                                canEditUser ?
                                    <div className="flex flex-row items-center">
                                        <ControlledSelect
                                            allowClear={true}
                                            name='provider'
                                            control={control}
                                            defaultValue={{label: 'common.not_available', value: 'common.not_available'}}
                                            options={providerOptions}
                                        />
                                        <div className='pb-6 ml-2'>
                                            <ProviderMappingToolTip />
                                        </div>
                                    </div> :
                                    <div className='mt-6 body2'>
                                        {userProvider}
                                    </div>
                            }
                        </div>
                    </div>

                    <div className='flex flex-row mt-8 pr-28'>
                        <div className='flex-1 pr-4'>
                            {!!userDetailExtended?.contactQueues && <>
                                <div className='flex flex-row items-center pr-7'>
                                    <label className='pr-4 subtitle'>{t('users.active_queues')}</label>
                                    {
                                        canEditUser && <a rel='noreferrer' target='_blank' className="body2 link"
                                            href={userDetailExtended?.contactProfileLink}>{t('common.change')}</a>
                                    }
                                </div>
                                <div className='flex flex-col mt-4 body2'>
                                    {
                                        React.Children.toArray(userDetailExtended?.contactQueues?.map(queue => <label>{queue}</label>))
                                    }
                                </div>
                            </>}
                        </div>
                        <div className='flex-1'>
                            <div className='w-80'>
                                <label className='subtitle'>{t('users.call_forwarding')}</label>
                                <ControlledCheckbox
                                    control={control}
                                    className='mt-6'
                                    label={t('users.call_forwarding_enabled')}
                                    name='enable_forward'
                                    onChange={onChangeEnableForward}
                                />
                                <ControlledSelect
                                    name='forward_to'
                                    label='users.call_forwarding_type'
                                    control={control}
                                    className='mt-6'
                                    disabled={!isForwardEnabled}
                                    defaultValue=''
                                    required={isForwardEnabled}
                                    options={forwardToOptions}
                                />
                                <div className={isForwardEnabled && forwardToSelected === CallForwardingType.Phone ? 'block' : 'hidden'}>
                                    <ControlledInput
                                        name="forward_to_value_phone"
                                        type={isForwardEnabled && forwardToSelected === CallForwardingType.Phone ? 'tel' : 'text'}
                                        control={control}
                                        errorMessage={formState.errors['forward_to_value_phone']?.message}
                                        disabled={!isForwardEnabled || isMobilePhoneLoading || isMobilePhoneFetching}
                                        label='users.call_forwarding_value_phone'
                                        required={isForwardEnabled && forwardToSelected === CallForwardingType.Phone}
                                    />
                                </div>
                                <div className={isForwardEnabled && forwardToSelected === CallForwardingType.Agent ? 'block' : 'hidden'}>
                                    <ControlledSelect
                                        control={control}
                                        name='forward_to_value_agent'
                                        disabled={!isForwardEnabled}
                                        label='users.call_forwarding_value_agent'
                                        options={connectUserOptions}
                                        required={isForwardEnabled && forwardToSelected === CallForwardingType.Agent}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        userDetailExtended?.user &&
                        <div className='flex flex-col mt-8 pr-28 sm:w-full md:w-1/2 pb-20'>
                            <div className='subtitle'>{t('browser_notifications.title')}</div>
                            <div className='body2 pb-6'>{t('browser_notifications.description')}</div>
                            <UserNotificationPreference isChecked={userDetailExtended.user.callNotification} onSwitch={onNotificationToggleSwitch}
                                isLoading={updateMutation.isLoading} notificationType={UserNotificationPreferences.call} 
                                mutationRunningForType={currentlyUpdatingNotificationPreference} />
                            <UserNotificationPreference isChecked={userDetailExtended.user.chatNotification} onSwitch={onNotificationToggleSwitch}
                                isLoading={updateMutation.isLoading} notificationType={UserNotificationPreferences.chat} 
                                mutationRunningForType={currentlyUpdatingNotificationPreference} />
                            <UserNotificationPreference isChecked={userDetailExtended.user.smsNotification} onSwitch={onNotificationToggleSwitch}
                                isLoading={updateMutation.isLoading} notificationType={UserNotificationPreferences.sms} 
                                mutationRunningForType={currentlyUpdatingNotificationPreference} />
                            <UserNotificationPreference isChecked={userDetailExtended.user.emailNotification} onSwitch={onNotificationToggleSwitch}
                                isLoading={updateMutation.isLoading} notificationType={UserNotificationPreferences.email} 
                                mutationRunningForType={currentlyUpdatingNotificationPreference} hasBottomBorder={true} />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default UserDetails;

