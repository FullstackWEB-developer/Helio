import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserStatus } from '../../store/app-user/appuser.slice';
import { UserStatus } from '../../store/app-user/app-user.models';
import { DropdownItemModel, DropdownModel } from '@components/dropdown/dropdown.models';
import { selectAgentStates, selectAppUserDetails, selectUserStatus } from '../../store/app-user/appuser.selectors';
import Logger from '../../services/logger';
import Dropdown from '../../components/dropdown/dropdown';
import StatusDot from '@components/status-dot/status-dot';
import { AgentState } from '@shared/models/agent-state';
import { Icon } from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React, { useEffect } from 'react';
import { toggleUserProfileMenu } from '@shared/layout/store/layout.slice';
import { useHistory } from 'react-router-dom';
import { MyStatsPath, UserDetailsPath } from '@app/paths';
import { getUserList } from '@shared/services/lookups.service';
import utils from '@shared/utils/utils';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';

interface UserStatuses {
  label: string;
  value: string;
}

export const ForwardingEnabledStatus = 'Forwarding Enabled';
const ProfileDropdown = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const agentStates = useSelector(selectAgentStates);
  const currentUserStatus = useSelector(selectUserStatus);
  const logger = Logger.getInstance();
  const history = useHistory();
  const currentUserDetails = useSelector(selectAppUserDetails);
  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  const signOut = () => {
    utils.logout().then();
  };

  const onMyProfileClick = () => {
    history.push(`${UserDetailsPath}/${currentUserDetails?.id}`);
  };

  const onMyStatsClick = () => {
    history.push(MyStatsPath);
  };

  const statusList: UserStatuses[] = [];

  agentStates
    .filter(a => a.name !== ForwardingEnabledStatus)
    .forEach((agentState: AgentState) => {
      statusList.push({
        label: agentState.name,
        value: agentState.name,
      });
    });

  statusList.push({
    label: t(`user_profile.statuses.afterwork`),
    value: UserStatus.AfterWork,
  });

  const updateStatus = (status: string) => {
    if (currentUserDetails.callForwardingEnabled) {
      dispatch(
        addSnackbarMessage({
          type: SnackbarType.Error,
          message: 'ccp.cannot_update_status_fw_enabled',
        }),
      );
    } else {
      if (status === UserStatus.AfterWork) {
        return;
      }
      if (window.CCP.agent) {
        const state = agentStates.find((agentState: AgentState) => agentState.name === status);
        window.CCP.agent.setState(state, {
          failure: (e: any) => {
            logger.error('Cannot set state for agent ', e);
          },
        });
      }
      dispatch(updateUserStatus(status));
    }
  };

  const GetIconByStatus = (status: string) => {
    const icon = <StatusDot status={status as UserStatus} />;
    return <span className='flex items-center justify-around w-4 h-4'>{icon}</span>;
  };

  const items: DropdownItemModel[] = [];
  statusList.forEach(status => {
    if (status.value !== currentUserStatus) {
      items.push({
        label: status.label,
        onClick: () => updateStatus(status.value),
        value: status.value,
        hasDivider: items.length === 0,
        icon: GetIconByStatus(status.value),
        className: status.value === UserStatus.AfterWork ? 'cursor-not-allowed' : '',
      });
    }
  });

  items.push({
    label: t('user_profile.my_settings'),
    onClick: () => onMyProfileClick(),
    value: 'my_profile',
    hasDivider: true,
    icon: <SvgIcon type={Icon.MyProfile} className='icon-small' fillClass='rgba-038-fill' />,
  });
  items.push({
    label: t('user_profile.my_stats'),
    onClick: () => onMyStatsClick(),
    value: 'my_stats',
    icon: <SvgIcon type={Icon.MyStats} className='icon-small' fillClass='rgba-038-fill' />,
  });
  items.push({
    label: t('user_profile.sign_out'),
    onClick: () => signOut(),
    value: 'sign_out',
    icon: <SvgIcon type={Icon.SignOut} className='icon-small' fillClass='rgba-038-fill' />,
  });

  const dropdownModel: DropdownModel = {
    header: (
      <div className='flex flex-row items-center h-12 px-4 pt-2 profile-dropdown-header'>
        <div className='whitespace-pre subtitle2'>{`${t('user_profile.my_status')}: `}</div>
        <div className='body2'>{currentUserStatus}</div>
      </div>
    ),
    items,
    onClick: () => {
      dispatch(toggleUserProfileMenu(false));
    },
  };
  return <Dropdown model={dropdownModel} />;
};

export default ProfileDropdown;
