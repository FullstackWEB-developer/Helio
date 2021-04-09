import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {logOut, updateUserStatus} from '../../store/app-user/appuser.slice';
import {msalInstance} from '@pages/login/auth-config';
import {ReactComponent as PlaceholderIcon} from '../../icons/Icon-Placeholder-16px.svg';
import {UserStatus} from '../../store/app-user/app-user.models';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import {selectAgentStates, selectUserStatus} from '../../store/app-user/appuser.selectors';
import Logger from '../../services/logger';
import Dropdown from '../../components/dropdown/dropdown';
import StatusDot from '@components/status-dot/status-dot';
import {AgentState} from '@shared/models/agent-state';

interface UserStatuses {
    label: string;
    value: string;
}

const ProfileDropdown = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const agentStates = useSelector(selectAgentStates);
    const currentUserStatus = useSelector(selectUserStatus);
    const logger = Logger.getInstance();

    const signOut = () => {
        dispatch(logOut());
        msalInstance.logout()
            .then()
            .catch((reason: any) => {
                logger.error('Error logging out ' + JSON.stringify(reason));
            });
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

    const GetIconByStatus =(status : string) => {
        const icon = <StatusDot status={status as UserStatus}/>;
        return <span className="w-4 h-4 flex items-center justify-around">{icon}</span>;
    }

    const items : DropdownItemModel[] = [];
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
        value: 'my_profile',
        hasDivider: true,
        icon: <PlaceholderIcon/>
    });
    items.push({
        label: t('user_profile.my_states'),
        value: 'my_states',
        icon: <PlaceholderIcon/>
    });
    items.push({
        label: t('user_profile.sign_out'),
        onClick: () => signOut(),
        value: 'sign_out',
        icon: <PlaceholderIcon/>
    });

    const dropdownModel: DropdownModel = {
        header: <div className='profile-dropdown-header px-4 h-12 pt-2 items-center flex flex-row'>
            <div className='subtitle2 whitespace-pre'>{`${t('user_profile.my_status')}: `}</div>
            <div className='body2'>{currentUserStatus}</div>
        </div>,
        items
    }
    return (<Dropdown model={dropdownModel}/>)

}

export default ProfileDropdown;
