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
    updateUser
} from "@shared/services/user.service";
import {useParams} from 'react-router';
import {useMutation, useQuery} from "react-query";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {GetMobilePhone, GetUserConnect, GetUserExtended} from "@constants/react-query-constants";
import {CallForwardingType, ConnectUser, UserDetailExtended, UserDetailStatus, UserRole} from "@shared/models";
import Spinner from '@components/spinner/Spinner';
import {DATE_LONG_FORMAT} from "@constants/form-constants";
import {selectLiveAgentStatuses} from "@shared/store/app-user/appuser.selectors";
import {addSnackbarMessage} from "@shared/store/snackbar/snackbar.slice";
import {SnackbarType} from "@components/snackbar/snackbar-type.enum";
import {useTranslation} from "react-i18next";
import ProviderMappingToolTip from "../components/provider-tool-tip";
import './user-details.scss';

dayjs.extend(utc);

const UserDetails = () => {

    const {t} = useTranslation();
    const {control, handleSubmit, watch, formState, setValue, getValues, reset} = useForm({
        shouldUnregister: false,
        mode: "all"
    });

    const {isValid, isDirty} = formState;

    const dispatch = useDispatch();
    const providers = useSelector(selectProviderList);
    const forwardToTypes = useSelector(selectForwardToOptions);
    const rolesList = useSelector(selectRoleList);
    const usersLiveStatus = useSelector(selectLiveAgentStatuses);
    const [userLiveStatus, setUserLiveStatus] = useState(UserStatus.Offline);
    const {userId} = useParams<{userId: string}>();
    const [userDetailExtended, setUserDetailExtended] = useState<UserDetailExtended>();
    const forwardToSelected = Number(watch('forward_to')) as CallForwardingType;
    const forwardValuePhone = watch('forward_to_value_phone') as string;
    const [connectUserList, setConnectUserList] = useState<ConnectUser[]>([]);
    const currentUserStatus = userDetailExtended?.user.status;

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

                setValue('forward_to_value_phone', data.mobilePhoneNumber);
            }
        });


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
        }

        if (statusResult) {
            setUserLiveStatus(user.latestConnectStatus as UserStatus ?? UserStatus.Offline);
        }
        if (user.callForwardingEnabled) {
            setValue('enable_forward', {value: undefined, checked: true});
        }

        if (user.callForwardingType) {
            setValue('forward_to', user.callForwardingType.toString());
            if (user.callForwardingType === CallForwardingType.Agent) {
                setValue('forward_to_value_agent', user.callForwardingValue);
            } else {
                setValue('forward_to_value_phone', user.callForwardingValue);
            }
        }


        for (const role of user.roles) {
            setValue(`userrole_${role}`, {value: role, checked: true}, {shouldDirty: false, shouldValidate: false});
        }

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

    const updateMutation = useMutation(updateUser, {
        onSuccess: (data) => {
            const updatedUserDetail = {...userDetailExtended!, user: data};
            setUserDetailExtended(updatedUserDetail);
            reset();
            loadUserData(updatedUserDetail);
            showMessage(SnackbarType.Success, t('users.user_update_success'));
        },
        onError: () => {
            showMessage(SnackbarType.Error, t('users.user_update_error'));
        }
    });

    const getNextStatus = () => {
        return currentUserStatus === UserDetailStatus.Active ? UserDetailStatus.Inactive : UserDetailStatus.Active;
    }

    const changeUserStatusMutation = useMutation(
        (param: {userId: string, userStatus: UserDetailStatus}) => changeUserStatus({id: param.userId, userStatus: param.userStatus}),
        {
            onSuccess: () => {
                const data = {...userDetailExtended!};
                data.user.status = getNextStatus();

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

        user.roles = roles;
        user.providerId = formData.provider && Number(formData.provider);

        updateMutation.mutate(user);
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
                            disabled={!isDirty || !isValid}
                            isLoading={updateMutation.isLoading}
                            onClick={() => handleSubmit(saveUser)()}
                        />
                        <Button
                            type='button'
                            buttonType='secondary-medium'
                            isLoading={changeUserStatusMutation.isLoading}
                            label={currentUserStatus === UserDetailStatus.Active ? 'common.deactivate' : 'common.activate'}
                            onClick={changeStatus}
                        />
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
                                        rolesSorted.map(role =>
                                            <ControlledCheckbox
                                                control={control}
                                                label={t(`users.role_${role.name.toLowerCase()}`)}
                                                name={`userrole_${role.name}`}
                                                value={role.name}
                                            />
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className='flex-1 pl-4'>
                            <label className='subtitle'>{t('users.ehr_settings')}</label>
                            <div className="flex flex-row items-center">
                                <ControlledSelect
                                    label='users.ehr_provider_mapping'
                                    name='provider'
                                    control={control}
                                    defaultValue=''
                                    options={providerOptions}
                                />
                                <div className='pb-6 ml-2'>
                                    <ProviderMappingToolTip />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row mt-8 pr-28'>
                        <div className='flex-1 pr-4'>
                            <div className='flex flex-row items-center justify-between pr-7'>
                                <label className='subtitle'>{t('users.active_queues')}</label>
                                <a rel='noreferrer' target='_blank' className="body2 link" href={userDetailExtended?.contactProfileLink}>{t('common.change')}</a>
                            </div>
                            <div className='flex flex-col mt-4 body2'>
                                {
                                    React.Children.toArray(userDetailExtended?.contactQueues.map(queue => <label>{queue}</label>))
                                }
                            </div>
                        </div>
                        <div className='flex-1'>
                            <div className='w-80'>
                                <label className='subtitle'>{t('users.call_forwarding')}</label>
                                <ControlledCheckbox
                                    control={control}
                                    className='mt-6'
                                    label={t('users.call_forwarding_enabled')}
                                    name='enable_forward'
                                />

                                <ControlledSelect
                                    name='forward_to'
                                    label='users.call_forwarding_type'
                                    control={control}
                                    className='mt-6'
                                    defaultValue=''
                                    options={forwardToOptions}
                                />

                                {forwardToSelected === CallForwardingType.Phone &&
                                    <ControlledInput
                                        name="forward_to_value_phone"
                                        type="tel"
                                        control={control}
                                        disabled={isMobilePhoneLoading || isMobilePhoneFetching}
                                        label='users.call_forwarding_value_phone'
                                    />
                                }

                                {forwardToSelected === CallForwardingType.Agent &&
                                    <ControlledSelect
                                        control={control}
                                        name='forward_to_value_agent'
                                        label='users.call_forwarding_value_agent'
                                        defaultValue=''
                                        options={connectUserOptions}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;

