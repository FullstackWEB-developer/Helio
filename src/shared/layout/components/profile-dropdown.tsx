import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {logOut, updateUserStatus} from '../../store/app-user/appuser.slice';
import {msalInstance} from '../../../pages/login/auth-config';
import {ReactComponent as PlaceholderIcon} from '../../icons/Icon-Placeholder-16px.svg';
import {UserStatus} from '../../store/app-user/app-user.models';
import {StatusIndicatorYellow} from '../../icons/StatusIndicatorYellow';
import {StatusIndicatorGray} from '../../icons/StatusIndicatorGray';
import {DropdownItemModel, DropdownModel} from '../../components/dropdown/dropdown.models';
import {selectUserStatus} from '../../store/app-user/appuser.selectors';
import Logger from '../../services/logger';
import Dropdown from '../../components/dropdown/dropdown';

const ProfileDropdown = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
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


    const statusList = [{
            label: t('user_profile.statuses.after_work'),
            value: UserStatus.AfterWork
        }];

    const updateStatus = (status: UserStatus) => {
        dispatch(updateUserStatus(status));
    }

    const GetIconByStatus =(status : UserStatus) => {
        let icon = <StatusIndicatorGray />;
        if (status === UserStatus.AfterWork) {
            icon = <StatusIndicatorYellow/>;
        }

        return <span className="w-4 h-4 flex items-center justify-around">{icon}</span>;
    }

    const items : DropdownItemModel[] = [];
    statusList.forEach((status) => {
        if (status.value !== currentUserStatus) {
            items.push({
                text: status.label,
                onClick: () => updateStatus(status.value),
                key: status.value,
                hasDivider: items.length === 0,
                icon: GetIconByStatus(status.value)
            });
        }
    });

    items.push({
        text: t('user_profile.my_profile'),
        key: 'my_profile',
        hasDivider: true,
        icon: <PlaceholderIcon/>
    });
    items.push({
        text: t('user_profile.my_stats'),
        key: 'my_stats',
        icon: <PlaceholderIcon/>
    });
    items.push({
        text: t('user_profile.sign_out'),
        onClick: () => signOut(),
        key: 'sign_out',
        icon: <PlaceholderIcon/>
    });

    const dropdownModel: DropdownModel = {
        header: <div className='profile-dropdown-header px-4 h-12 pt-2 items-center flex flex-row'>
            <div className='subtitle2 whitespace-pre'>{`${t('user_profile.my_status')}: `}</div>
            <div className='body2'>{t(`user_profile.statuses.${currentUserStatus}`)}</div>
        </div>,
        items
    }
    return (<Dropdown model={dropdownModel}/>)

}

export default ProfileDropdown;
