import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {logOut, updateUserStatus} from '../../store/app-user/appuser.slice';
import {msalInstance} from '@pages/login/auth-config';
import {AuthenticationInfo, UserStatus} from '../../store/app-user/app-user.models';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import {authenticationSelector, selectAgentStates, selectUserStatus} from '../../store/app-user/appuser.selectors';
import Logger from '../../services/logger';
import Dropdown from '../../components/dropdown/dropdown';
import StatusDot from '@components/status-dot/status-dot';
import {AgentState} from '@shared/models/agent-state';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import axios from "axios";
import {toggleUserProfileMenu} from '@shared/layout/store/layout.slice';
import {useHistory} from 'react-router-dom';
import {UserDetailsPath} from '@app/paths';
import {selectUserByEmail} from '@shared/store/lookups/lookups.selectors';
import {useEffect} from 'react';
import {getUserList} from '@shared/services/lookups.service';

interface UserStatuses {
    label: string;
    value: string;
}

const ccpConfig = {
    connectBaseUrl: process.env.REACT_APP_CONNECT_BASE_URL,
    ccpLogOutUrl: process.env.REACT_APP_CCP_LOGOUT_URL
}

const ProfileDropdown = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const auth: AuthenticationInfo = useSelector(authenticationSelector);
    const agentStates = useSelector(selectAgentStates);
    const currentUserStatus = useSelector(selectUserStatus);
    const logger = Logger.getInstance();
    const history = useHistory();
    const currentUserDetails = useSelector((state) => selectUserByEmail(state, auth.username));

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch])

    const signOut = () => {
        signOutFromCcp();
        msalInstance.logoutRedirect({
            postLogoutRedirectUri: '/login'
        })
            .then()
            .catch((reason: any) => {
                logger.error('Error logging out ' + JSON.stringify(reason));
            }).finally(() => dispatch(logOut()));
    }

    const signOutFromCcp = () => {
        axios.get(ccpConfig.connectBaseUrl! + ccpConfig.ccpLogOutUrl, {withCredentials: true})
            .catch(() => {
                // Note: This will result in 'CORS policy' error but it will still logout the user which is our goal.
                // We will ignore the error received since we do not care about the response.
            });
    }

    const onMyProfileClick = () => {
        history.push(`${UserDetailsPath}/${currentUserDetails?.id}`);
    }

    const statusList: UserStatuses[] = [];

    agentStates.forEach((agentState: AgentState) => {
        statusList.push(
            {
                label: agentState.name,
                value: agentState.name
            }
        )
    });

    statusList.push(
        {
            label: t(`user_profile.statuses.afterwork`),
            value: UserStatus.AfterWork
        }
    )

    const updateStatus = (status: string) => {
        if (status === UserStatus.AfterWork) return;
        if (window.CCP.agent) {
            const state = agentStates.find((agentState: AgentState) => agentState.name === status);
            window.CCP.agent.setState(state, {
                failure: (e: any) => {
                    logger.error('Cannot set state for agent ', e);
                }
            });
        }
        dispatch(updateUserStatus(status));
    }

    const GetIconByStatus = (status: string) => {
        const icon = <StatusDot status={status as UserStatus} />;
        return <span className="flex items-center justify-around w-4 h-4">{icon}</span>;
    }

    const items: DropdownItemModel[] = [];
    statusList.forEach((status) => {
        if (status.value !== currentUserStatus) {
            items.push({
                label: status.label,
                onClick: () => updateStatus(status.value),
                value: status.value,
                hasDivider: items.length === 0,
                icon: GetIconByStatus(status.value)
            });
        }
    });

    items.push({
        label: t('user_profile.my_profile'),
        onClick: () => onMyProfileClick(),
        value: 'my_profile',
        hasDivider: true,
        icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />
    });
    items.push({
        label: t('user_profile.my_states'),
        value: 'my_states',
        icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />
    });
    items.push({
        label: t('user_profile.sign_out'),
        onClick: () => signOut(),
        value: 'sign_out',
        icon: <SvgIcon type={Icon.Placeholder} className='icon-small' fillClass='' />
    });

    const dropdownModel: DropdownModel = {
        header: <div className='flex flex-row items-center h-12 px-4 pt-2 profile-dropdown-header'>
            <div className='whitespace-pre subtitle2'>{`${t('user_profile.my_status')}: `}</div>
            <div className='body2'>{currentUserStatus}</div>
        </div>,
        items,
        onClick: () => {dispatch(toggleUserProfileMenu(false))}
    }
    return (<Dropdown model={dropdownModel} />)

}

export default ProfileDropdown;
