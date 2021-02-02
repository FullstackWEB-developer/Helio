import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { logOut } from '../../store/app-user/appuser.slice';
import { msalInstance } from "../../../pages/login/auth-config";
import { ReactComponent as PlaceholderIcon } from '../../icons/Icon-Placeholder-24px.svg';
const ProfileDropdown = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(logOut());
        msalInstance.logout();
    }
    return (<Fragment>
        <div className="cursor-pointer absolute bg-white mt-2 ring-black right-0 ring-1 ring-opacity-5 rounded-md shadow-lg w-56">
            <div onClick={() => logout()} className="p-4 flex flex-row">
                <div className="px-2">
                    <PlaceholderIcon></PlaceholderIcon>
                </div>
                <div>
                    {t('user_profile.logoutButton')}
                </div>
            </div>
        </div>
    </Fragment>)

}

export default ProfileDropdown;
